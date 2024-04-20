import Communicator from "/service-communicators/port-registry";
import RamnetComms from "/service-communicators/ramnet";
import Multiport from "/general/multiport";
export async function main(ns) {
    //ns.disableLog("ALL")
    ns.disableLog("sleep");
    ns.disableLog("exec");
    ns.disableLog("getScriptRam");
    ns.disableLog("scp");
    const targetServer = ns.args[0];
    const commsPort = ns.args[1];
    const ramnet = new RamnetComms(ns);
    ns.print(`getting ramnet's total ram`);
    const ramnetRam = await ramnet.getTotalRam();
    ns.print(`got ramnet ram, ${ramnetRam.totalRam}`);
    const comms = ns.getPortHandle(commsPort);
    ns.print(`awaiting ${commsPort} nextWrite();`);
    await comms.nextWrite();
    const controllerAmount = comms.peek();
    ns.print(`got controller amount, ${controllerAmount}`);
    const ramnetDedicated = Math.floor(ramnetRam.totalRam / controllerAmount);
    ns.print(`ram on ramnet dedicated per controller: ${ramnetDedicated}`);
    const portComms = new Communicator(ns);
    const ports = (await portComms.assignFirstAvailable(1));
    const returnPorts = await portComms.assignFirstAvailable(1000);
    const startSignal = ports.assignedPorts[0];
    ns.atExit(() => {
        portComms.unassignPorts(ports.assignedPorts);
        portComms.unassignPorts(returnPorts.assignedPorts);
        ns.rm(`/lock/controllers/${targetServer}.txt`, "home");
    });
    const returnPort = new Multiport(ns, { ports: returnPorts.assignedPorts });
    await ns.sleep(50);
    const growS = "/infect/worms/grow.js";
    const hackS = "/infect/worms/hack.js";
    const weakenS = "/infect/worms/weaken.js";
    let ramUsed = 0;
    const jobs = {
        grow: {
            ram: ns.getScriptRam(growS, "home"),
            server: ""
        },
        weaken: {
            ram: ns.getScriptRam(weakenS, "home"),
            server: ""
        },
        hack: {
            ram: ns.getScriptRam(hackS, "home"),
            server: ""
        }
    };
    const start = ns.getPortHandle(startSignal);
    const minMoney = ns.getServerMaxMoney(targetServer) * 0.5;
    while (true) {
        await ns.sleep(1);
        if (ns.getServerMoneyAvailable(targetServer) < minMoney) {
            while (true) {
                await ns.sleep(1);
                const jobsAssigned = [];
                while (true) {
                    const newJob = await ramnet.assignJob(jobs.grow);
                    const server = newJob.jobAssigned.server;
                    const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                    const threads = Math.floor(serverRam / ns.getScriptRam(growS, "home"));
                    const ramUsage = ns.getScriptRam(growS, "home") * threads;
                    ramUsed += ramUsage;
                    await ramnet.finishJob(newJob.jobAssigned);
                    if (ramUsed <= ramnetDedicated) {
                        ramUsed -= ramUsage;
                        break;
                    }
                    const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                    jobsAssigned.push(realJob.jobAssigned);
                    ensureScriptExistence(ns, realJob.jobAssigned.server);
                    grow(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, { server: targetServer, startPort: startSignal });
                }
                let jobsFinished = 0;
                ns.print(`making sure all scripts can get start signal..`);
                await ns.sleep(1000);
                ns.print(`starting all scripts.`);
                start.write("GO");
                while (true) {
                    await ns.sleep(1);
                    if (!returnPort.empty()) {
                        returnPort.read();
                        jobsFinished++;
                    }
                    if (jobsFinished == jobsAssigned.length - 1) {
                        ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`);
                        for (const job of jobsAssigned) {
                            await ramnet.finishJob(job);
                        }
                        break;
                    }
                }
                if (ns.getServerMoneyAvailable(targetServer) > minMoney * 2)
                    break;
            }
        }
        if (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer) * 1.5) {
            while (true) {
                await ns.sleep(1);
                const jobsAssigned = [];
                while (true) {
                    const newJob = await ramnet.assignJob(jobs.grow);
                    const server = newJob.jobAssigned.server;
                    const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                    const threads = Math.floor(serverRam / ns.getScriptRam(weakenS, "home"));
                    const ramUsage = ns.getScriptRam(weakenS, "home") * threads;
                    ramUsed += ramUsage;
                    await ramnet.finishJob(newJob.jobAssigned);
                    if (ramUsed <= ramnetDedicated) {
                        ramUsed -= ramUsage;
                        break;
                    }
                    const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                    jobsAssigned.push(realJob.jobAssigned);
                    ensureScriptExistence(ns, realJob.jobAssigned.server);
                    weaken(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, { server: targetServer, startPort: startSignal });
                }
                let jobsFinished = 0;
                ns.print(`making sure all scripts can get start signal..`);
                await ns.sleep(1000);
                ns.print(`starting all scripts.`);
                start.write("GO");
                while (true) {
                    await ns.sleep(1);
                    if (!returnPort.empty()) {
                        returnPort.read();
                        jobsFinished++;
                    }
                    if (jobsFinished == jobsAssigned.length - 1) {
                        ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`);
                        for (const job of jobsAssigned) {
                            await ramnet.finishJob(job);
                        }
                        break;
                    }
                }
                if (ns.getServerSecurityLevel(targetServer) <= ns.getServerMinSecurityLevel(targetServer))
                    break;
            }
        }
        while (true) {
            await ns.sleep(1);
            const jobsAssigned = [];
            while (true) {
                const newJob = await ramnet.assignJob(jobs.grow);
                const server = newJob.jobAssigned.server;
                const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                const threads = Math.floor(serverRam / ns.getScriptRam(hackS, "home"));
                const ramUsage = ns.getScriptRam(hackS, "home") * threads;
                ramUsed += ramUsage;
                await ramnet.finishJob(newJob.jobAssigned);
                if (ramUsed <= ramnetDedicated) {
                    ramUsed -= ramUsage;
                    break;
                }
                const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                jobsAssigned.push(realJob.jobAssigned);
                ensureScriptExistence(ns, realJob.jobAssigned.server);
                hack(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, { server: targetServer, startPort: startSignal });
            }
            let jobsFinished = 0;
            ns.print(`making sure all scripts can get start signal..`);
            await ns.sleep(1000);
            ns.print(`starting all scripts.`);
            start.write("GO");
            while (true) {
                await ns.sleep(1);
                if (!returnPort.empty()) {
                    returnPort.read();
                    jobsFinished++;
                }
                if (jobsFinished == jobsAssigned.length - 1) {
                    ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`);
                    for (const job of jobsAssigned) {
                        await ramnet.finishJob(job);
                    }
                    break;
                }
            }
            if (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer) * 1.5)
                break;
            if (ns.getServerMoneyAvailable(targetServer) < minMoney * 2)
                break;
        }
    }
}
function grow(ns, threads, deploymentServer, returnData, data) {
    deployScript(ns, threads, "/infect/worms/grow.js", deploymentServer, JSON.stringify(returnData), JSON.stringify(data));
}
function weaken(ns, threads, deploymentServer, returnData, data) {
    deployScript(ns, threads, "/infect/worms/weaken.js", deploymentServer, JSON.stringify(returnData), JSON.stringify(data));
}
function hack(ns, threads, deploymentServer, returnData, data) {
    deployScript(ns, threads, "/infect/worms/hack.js", deploymentServer, JSON.stringify(returnData), JSON.stringify(data));
}
function deployScript(ns, threads, script, server, ...args) {
    ns.exec(script, server, { threads, temporary: true }, ...args);
}
function ensureScriptExistence(ns, server) {
    if (!ns.fileExists("/infect/worms/grow.js", server))
        ns.scp("/infect/worms/grow.js", server, "home");
    if (!ns.fileExists("/infect/worms/hack.js", server))
        ns.scp("/infect/worms/hack.js", server, "home");
    if (!ns.fileExists("/infect/worms/weaken.js", server))
        ns.scp("/infect/worms/weaken.js", server, "home");
    if (!ns.fileExists("/general/multiport.js", server))
        ns.scp("/general/multiport.js", server, "home");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5uZXdiYWNrdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5mZWN0L2NvbnRyb2xsZXIubmV3YmFja3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sWUFBWSxNQUFNLHNDQUFzQyxDQUFDO0FBQ2hFLE9BQU8sV0FBVyxNQUFNLCtCQUErQixDQUFDO0FBR3hELE9BQU8sU0FBUyxNQUFNLG9CQUFvQixDQUFDO0FBRTNDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQVM7SUFDaEMsc0JBQXNCO0lBQ3RCLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlCLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQVcsQ0FBQztJQUMxQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBVyxDQUFDO0lBQ3ZDLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLEVBQUUsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUN2QyxNQUFNLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QyxFQUFFLENBQUMsS0FBSyxDQUFDLG1CQUFtQixTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUNsRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxTQUFTLGVBQWUsQ0FBQyxDQUFBO0lBQzlDLE1BQU0sS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3hCLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBWSxDQUFDO0lBQ2hELEVBQUUsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUN2RCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztJQUMxRSxFQUFFLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxNQUFNLFdBQVcsR0FBRyxNQUFNLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQ1gsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDNUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsWUFBWSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLFVBQVUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLGFBQWEsRUFBQyxDQUFDLENBQUE7SUFDeEUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25CLE1BQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO0lBQ3RDLE1BQU0sT0FBTyxHQUFHLHlCQUF5QixDQUFDO0lBQzFDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixNQUFNLElBQUksR0FBRztRQUNULElBQUksRUFBRTtZQUNGLEdBQUcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDbkMsTUFBTSxFQUFFLEVBQUU7U0FDYjtRQUNELE1BQU0sRUFBRTtZQUNKLEdBQUcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDckMsTUFBTSxFQUFFLEVBQUU7U0FDYjtRQUNELElBQUksRUFBRTtZQUNGLEdBQUcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDbkMsTUFBTSxFQUFFLEVBQUU7U0FDYjtLQUNKLENBQUE7SUFDRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDMUQsT0FBTyxJQUFJLEVBQUU7UUFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxFQUFFLENBQUMsdUJBQXVCLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxFQUFFO1lBQ3JELE9BQU8sSUFBSSxFQUFFO2dCQUNULE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxZQUFZLEdBQVUsRUFBRSxDQUFDO2dCQUMvQixPQUFPLElBQUksRUFBRTtvQkFDVCxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztvQkFDekMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzNFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3ZFLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztvQkFDMUQsT0FBTyxJQUFJLFFBQVEsQ0FBQztvQkFDcEIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxPQUFPLElBQUksZUFBZSxFQUFFO3dCQUM1QixPQUFPLElBQUksUUFBUSxDQUFDO3dCQUNwQixNQUFNO3FCQUNUO29CQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7b0JBQ3BFLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUN0QyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7aUJBQzVIO2dCQUNELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsT0FBTyxJQUFJLEVBQUU7b0JBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFO3dCQUNyQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ2xCLFlBQVksRUFBRSxDQUFDO3FCQUNsQjtvQkFDRCxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDekMsRUFBRSxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsWUFBWSxRQUFRLENBQUMsQ0FBQTt3QkFDdkUsS0FBSyxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUU7NEJBQzVCLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDL0I7d0JBQ0QsTUFBTTtxQkFDVDtpQkFDSjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQztvQkFDdkQsTUFBTTthQUNiO1NBQ0o7UUFDRCxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQzVGLE9BQU8sSUFBSSxFQUFFO2dCQUNULE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxZQUFZLEdBQVUsRUFBRSxDQUFDO2dCQUMvQixPQUFPLElBQUksRUFBRTtvQkFDVCxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztvQkFDekMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzNFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3pFLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztvQkFDNUQsT0FBTyxJQUFJLFFBQVEsQ0FBQztvQkFDcEIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxPQUFPLElBQUksZUFBZSxFQUFFO3dCQUM1QixPQUFPLElBQUksUUFBUSxDQUFDO3dCQUNwQixNQUFNO3FCQUNUO29CQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7b0JBQ3BFLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUN0QyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7aUJBQzlIO2dCQUNELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsT0FBTyxJQUFJLEVBQUU7b0JBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFO3dCQUNyQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ2xCLFlBQVksRUFBRSxDQUFDO3FCQUNsQjtvQkFDRCxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDekMsRUFBRSxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsWUFBWSxRQUFRLENBQUMsQ0FBQTt3QkFDdkUsS0FBSyxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUU7NEJBQzVCLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDL0I7d0JBQ0QsTUFBTTtxQkFDVDtpQkFDSjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDO29CQUNyRixNQUFNO2FBQ2I7U0FDSjtRQUNELE9BQU8sSUFBSSxFQUFFO1lBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sWUFBWSxHQUFVLEVBQUUsQ0FBQztZQUMvQixPQUFPLElBQUksRUFBRTtnQkFDVCxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztnQkFDekMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzNFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZFLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDMUQsT0FBTyxJQUFJLFFBQVEsQ0FBQztnQkFDcEIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxPQUFPLElBQUksZUFBZSxFQUFFO29CQUM1QixPQUFPLElBQUksUUFBUSxDQUFDO29CQUNwQixNQUFNO2lCQUNUO2dCQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7Z0JBQ3BFLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUN0QyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7YUFDNUg7WUFDRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1lBQzNELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixPQUFPLElBQUksRUFBRTtnQkFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3JCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbEIsWUFBWSxFQUFFLENBQUM7aUJBQ2xCO2dCQUNELElBQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN6QyxFQUFFLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxZQUFZLFFBQVEsQ0FBQyxDQUFBO29CQUN2RSxLQUFLLE1BQU0sR0FBRyxJQUFJLFlBQVksRUFBRTt3QkFDNUIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMvQjtvQkFDRCxNQUFNO2lCQUNUO2FBQ0o7WUFDRCxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRztnQkFDMUYsTUFBTTtZQUNWLElBQUksRUFBRSxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsR0FBRyxDQUFDO2dCQUN2RCxNQUFNO1NBQ2I7S0FDSjtBQUNMLENBQUM7QUFFRCxTQUFTLElBQUksQ0FBQyxFQUFTLEVBQUUsT0FBZSxFQUFFLGdCQUF3QixFQUFFLFVBQW9CLEVBQUUsSUFBYztJQUNwRyxZQUFZLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzSCxDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsRUFBUyxFQUFFLE9BQWUsRUFBRSxnQkFBd0IsRUFBRSxVQUFvQixFQUFFLElBQWM7SUFDdEcsWUFBWSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDN0gsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFDLEVBQVMsRUFBRSxPQUFlLEVBQUUsZ0JBQXdCLEVBQUUsVUFBb0IsRUFBRSxJQUFjO0lBQ3BHLFlBQVksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNILENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxFQUFTLEVBQUUsT0FBZSxFQUFFLE1BQWMsRUFBRSxNQUFjLEVBQUUsR0FBRyxJQUFXO0lBQzVGLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxFQUFTLEVBQUUsTUFBYztJQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUM7UUFDL0MsRUFBRSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQztRQUNqRCxFQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUM7UUFDL0MsRUFBRSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5pbXBvcnQgQ29tbXVuaWNhdG9yIGZyb20gXCIvc2VydmljZS1jb21tdW5pY2F0b3JzL3BvcnQtcmVnaXN0cnlcIjtcbmltcG9ydCBSYW1uZXRDb21tcyBmcm9tIFwiL3NlcnZpY2UtY29tbXVuaWNhdG9ycy9yYW1uZXRcIjtcbmltcG9ydCB7IEpvYiB9IGZyb20gXCIvZ2VuZXJhbC9yYW1uZXRcIjtcbmltcG9ydCB7IFdvcm1EYXRhIH0gZnJvbSBcIi4vd29ybXMvdHlwZXNcIjtcbmltcG9ydCBNdWx0aXBvcnQgZnJvbSBcIi9nZW5lcmFsL211bHRpcG9ydFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihuczogbnMuTlMpIHtcbiAgICAvL25zLmRpc2FibGVMb2coXCJBTExcIilcbiAgICBucy5kaXNhYmxlTG9nKFwic2xlZXBcIik7XG4gICAgbnMuZGlzYWJsZUxvZyhcImV4ZWNcIik7XG4gICAgbnMuZGlzYWJsZUxvZyhcImdldFNjcmlwdFJhbVwiKTtcbiAgICBucy5kaXNhYmxlTG9nKFwic2NwXCIpO1xuICAgIGNvbnN0IHRhcmdldFNlcnZlciA9IG5zLmFyZ3NbMF0gYXMgc3RyaW5nO1xuICAgIGNvbnN0IGNvbW1zUG9ydCA9IG5zLmFyZ3NbMV0gYXMgbnVtYmVyO1xuICAgIGNvbnN0IHJhbW5ldCA9IG5ldyBSYW1uZXRDb21tcyhucyk7XG4gICAgbnMucHJpbnQoYGdldHRpbmcgcmFtbmV0J3MgdG90YWwgcmFtYCk7XG4gICAgY29uc3QgcmFtbmV0UmFtID0gYXdhaXQgcmFtbmV0LmdldFRvdGFsUmFtKCk7XG4gICAgbnMucHJpbnQoYGdvdCByYW1uZXQgcmFtLCAke3JhbW5ldFJhbS50b3RhbFJhbX1gKTtcbiAgICBjb25zdCBjb21tcyA9IG5zLmdldFBvcnRIYW5kbGUoY29tbXNQb3J0KTtcbiAgICBucy5wcmludChgYXdhaXRpbmcgJHtjb21tc1BvcnR9IG5leHRXcml0ZSgpO2ApXG4gICAgYXdhaXQgY29tbXMubmV4dFdyaXRlKCk7XG4gICAgY29uc3QgY29udHJvbGxlckFtb3VudCA9IGNvbW1zLnBlZWsoKSBhcyBudW1iZXI7XG4gICAgbnMucHJpbnQoYGdvdCBjb250cm9sbGVyIGFtb3VudCwgJHtjb250cm9sbGVyQW1vdW50fWApO1xuICAgIGNvbnN0IHJhbW5ldERlZGljYXRlZCA9IE1hdGguZmxvb3IocmFtbmV0UmFtLnRvdGFsUmFtIC8gY29udHJvbGxlckFtb3VudCk7XG4gICAgbnMucHJpbnQoYHJhbSBvbiByYW1uZXQgZGVkaWNhdGVkIHBlciBjb250cm9sbGVyOiAke3JhbW5ldERlZGljYXRlZH1gKTtcbiAgICBjb25zdCBwb3J0Q29tbXMgPSBuZXcgQ29tbXVuaWNhdG9yKG5zKTtcbiAgICBjb25zdCBwb3J0cyA9IChhd2FpdCBwb3J0Q29tbXMuYXNzaWduRmlyc3RBdmFpbGFibGUoMSkpO1xuICAgIGNvbnN0IHJldHVyblBvcnRzID0gYXdhaXQgcG9ydENvbW1zLmFzc2lnbkZpcnN0QXZhaWxhYmxlKDEwMDApO1xuICAgIGNvbnN0IHN0YXJ0U2lnbmFsID0gcG9ydHMuYXNzaWduZWRQb3J0c1swXTtcbiAgICBucy5hdEV4aXQoKCkgPT4ge1xuICAgICAgICBwb3J0Q29tbXMudW5hc3NpZ25Qb3J0cyhwb3J0cy5hc3NpZ25lZFBvcnRzKVxuICAgICAgICBwb3J0Q29tbXMudW5hc3NpZ25Qb3J0cyhyZXR1cm5Qb3J0cy5hc3NpZ25lZFBvcnRzKTtcbiAgICAgICAgbnMucm0oYC9sb2NrL2NvbnRyb2xsZXJzLyR7dGFyZ2V0U2VydmVyfS50eHRgLCBcImhvbWVcIik7XG4gICAgfSk7XG4gICAgY29uc3QgcmV0dXJuUG9ydCA9IG5ldyBNdWx0aXBvcnQobnMsIHtwb3J0czogcmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0c30pXG4gICAgYXdhaXQgbnMuc2xlZXAoNTApO1xuICAgIGNvbnN0IGdyb3dTID0gXCIvaW5mZWN0L3dvcm1zL2dyb3cuanNcIjtcbiAgICBjb25zdCBoYWNrUyA9IFwiL2luZmVjdC93b3Jtcy9oYWNrLmpzXCI7XG4gICAgY29uc3Qgd2Vha2VuUyA9IFwiL2luZmVjdC93b3Jtcy93ZWFrZW4uanNcIjtcbiAgICBsZXQgcmFtVXNlZCA9IDA7XG4gICAgY29uc3Qgam9icyA9IHtcbiAgICAgICAgZ3Jvdzoge1xuICAgICAgICAgICAgcmFtOiBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSxcbiAgICAgICAgICAgIHNlcnZlcjogXCJcIlxuICAgICAgICB9LFxuICAgICAgICB3ZWFrZW46IHtcbiAgICAgICAgICAgIHJhbTogbnMuZ2V0U2NyaXB0UmFtKHdlYWtlblMsIFwiaG9tZVwiKSxcbiAgICAgICAgICAgIHNlcnZlcjogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBoYWNrOiB7XG4gICAgICAgICAgICByYW06IG5zLmdldFNjcmlwdFJhbShoYWNrUywgXCJob21lXCIpLFxuICAgICAgICAgICAgc2VydmVyOiBcIlwiXG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3RhcnQgPSBucy5nZXRQb3J0SGFuZGxlKHN0YXJ0U2lnbmFsKTtcbiAgICBjb25zdCBtaW5Nb25leSA9IG5zLmdldFNlcnZlck1heE1vbmV5KHRhcmdldFNlcnZlcikgKiAwLjU7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgIGlmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSh0YXJnZXRTZXJ2ZXIpIDwgbWluTW9uZXkpIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9ic0Fzc2lnbmVkOiBKb2JbXSA9IFtdO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0pvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioam9icy5ncm93KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3Sm9iLmpvYkFzc2lnbmVkLnNlcnZlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKHNlcnZlcikgLSBucy5nZXRTZXJ2ZXJVc2VkUmFtKHNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRocmVhZHMgPSBNYXRoLmZsb29yKHNlcnZlclJhbSAvIG5zLmdldFNjcmlwdFJhbShncm93UywgXCJob21lXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFtVXNhZ2UgPSBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSAqIHRocmVhZHM7XG4gICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2IobmV3Sm9iLmpvYkFzc2lnbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgPD0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2VkIC09IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVhbEpvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioe3JhbTogcmFtVXNhZ2UsIHNlcnZlcjogXCJcIn0pO1xuICAgICAgICAgICAgICAgICAgICBqb2JzQXNzaWduZWQucHVzaChyZWFsSm9iLmpvYkFzc2lnbmVkKVxuICAgICAgICAgICAgICAgICAgICBlbnN1cmVTY3JpcHRFeGlzdGVuY2UobnMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdyhucywgdGhyZWFkcywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIsIHJldHVyblBvcnRzLmFzc2lnbmVkUG9ydHMsIHtzZXJ2ZXI6IHRhcmdldFNlcnZlciwgc3RhcnRQb3J0OiBzdGFydFNpZ25hbH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgam9ic0ZpbmlzaGVkID0gMDtcbiAgICAgICAgICAgICAgICBucy5wcmludChgbWFraW5nIHN1cmUgYWxsIHNjcmlwdHMgY2FuIGdldCBzdGFydCBzaWduYWwuLmApO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwMDApO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBzdGFydGluZyBhbGwgc2NyaXB0cy5gKTtcbiAgICAgICAgICAgICAgICBzdGFydC53cml0ZShcIkdPXCIpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJldHVyblBvcnQuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUG9ydC5yZWFkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JzRmluaXNoZWQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoam9ic0ZpbmlzaGVkID09IGpvYnNBc3NpZ25lZC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgdGVsbGluZyByYW1uZXQgdGhlIGpvYnMgYXJlIGZpbmlzaGVkICgke2pvYnNGaW5pc2hlZH0gam9icylgKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBqb2Igb2Ygam9ic0Fzc2lnbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihqb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKHRhcmdldFNlcnZlcikgPiBtaW5Nb25leSAqIDIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChucy5nZXRTZXJ2ZXJTZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgPiBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgKiAxLjUpIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9ic0Fzc2lnbmVkOiBKb2JbXSA9IFtdO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0pvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioam9icy5ncm93KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3Sm9iLmpvYkFzc2lnbmVkLnNlcnZlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKHNlcnZlcikgLSBucy5nZXRTZXJ2ZXJVc2VkUmFtKHNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRocmVhZHMgPSBNYXRoLmZsb29yKHNlcnZlclJhbSAvIG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICByYW1Vc2VkICs9IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKG5ld0pvYi5qb2JBc3NpZ25lZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkIDw9IHJhbW5ldERlZGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCAtPSByYW1Vc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWxKb2IgPSBhd2FpdCByYW1uZXQuYXNzaWduSm9iKHtyYW06IHJhbVVzYWdlLCBzZXJ2ZXI6IFwiXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgam9ic0Fzc2lnbmVkLnB1c2gocmVhbEpvYi5qb2JBc3NpZ25lZClcbiAgICAgICAgICAgICAgICAgICAgZW5zdXJlU2NyaXB0RXhpc3RlbmNlKG5zLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIHdlYWtlbihucywgdGhyZWFkcywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIsIHJldHVyblBvcnRzLmFzc2lnbmVkUG9ydHMsIHtzZXJ2ZXI6IHRhcmdldFNlcnZlciwgc3RhcnRQb3J0OiBzdGFydFNpZ25hbH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgam9ic0ZpbmlzaGVkID0gMDtcbiAgICAgICAgICAgICAgICBucy5wcmludChgbWFraW5nIHN1cmUgYWxsIHNjcmlwdHMgY2FuIGdldCBzdGFydCBzaWduYWwuLmApO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwMDApO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBzdGFydGluZyBhbGwgc2NyaXB0cy5gKTtcbiAgICAgICAgICAgICAgICBzdGFydC53cml0ZShcIkdPXCIpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJldHVyblBvcnQuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUG9ydC5yZWFkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JzRmluaXNoZWQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoam9ic0ZpbmlzaGVkID09IGpvYnNBc3NpZ25lZC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgdGVsbGluZyByYW1uZXQgdGhlIGpvYnMgYXJlIGZpbmlzaGVkICgke2pvYnNGaW5pc2hlZH0gam9icylgKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBqb2Igb2Ygam9ic0Fzc2lnbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihqb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5zLmdldFNlcnZlclNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSA8PSBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgIGNvbnN0IGpvYnNBc3NpZ25lZDogSm9iW10gPSBbXTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Sm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYihqb2JzLmdyb3cpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IG5ld0pvYi5qb2JBc3NpZ25lZC5zZXJ2ZXI7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKHNlcnZlcikgLSBucy5nZXRTZXJ2ZXJVc2VkUmFtKHNlcnZlcik7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhyZWFkcyA9IE1hdGguZmxvb3Ioc2VydmVyUmFtIC8gbnMuZ2V0U2NyaXB0UmFtKGhhY2tTLCBcImhvbWVcIikpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKGhhY2tTLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihuZXdKb2Iuam9iQXNzaWduZWQpO1xuICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkIDw9IHJhbW5ldERlZGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICByYW1Vc2VkIC09IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVhbEpvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioe3JhbTogcmFtVXNhZ2UsIHNlcnZlcjogXCJcIn0pO1xuICAgICAgICAgICAgICAgIGpvYnNBc3NpZ25lZC5wdXNoKHJlYWxKb2Iuam9iQXNzaWduZWQpXG4gICAgICAgICAgICAgICAgZW5zdXJlU2NyaXB0RXhpc3RlbmNlKG5zLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlcik7XG4gICAgICAgICAgICAgICAgaGFjayhucywgdGhyZWFkcywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIsIHJldHVyblBvcnRzLmFzc2lnbmVkUG9ydHMsIHtzZXJ2ZXI6IHRhcmdldFNlcnZlciwgc3RhcnRQb3J0OiBzdGFydFNpZ25hbH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGpvYnNGaW5pc2hlZCA9IDA7XG4gICAgICAgICAgICBucy5wcmludChgbWFraW5nIHN1cmUgYWxsIHNjcmlwdHMgY2FuIGdldCBzdGFydCBzaWduYWwuLmApO1xuICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMTAwMCk7XG4gICAgICAgICAgICBucy5wcmludChgc3RhcnRpbmcgYWxsIHNjcmlwdHMuYCk7XG4gICAgICAgICAgICBzdGFydC53cml0ZShcIkdPXCIpO1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJldHVyblBvcnQuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5Qb3J0LnJlYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgam9ic0ZpbmlzaGVkKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChqb2JzRmluaXNoZWQgPT0gam9ic0Fzc2lnbmVkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHRlbGxpbmcgcmFtbmV0IHRoZSBqb2JzIGFyZSBmaW5pc2hlZCAoJHtqb2JzRmluaXNoZWR9IGpvYnMpYClcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBqb2Igb2Ygam9ic0Fzc2lnbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKGpvYik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5zLmdldFNlcnZlclNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSA+IG5zLmdldFNlcnZlck1pblNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSAqIDEuNSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGlmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSh0YXJnZXRTZXJ2ZXIpIDwgbWluTW9uZXkgKiAyKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBncm93KG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBkZXBsb3ltZW50U2VydmVyOiBzdHJpbmcsIHJldHVybkRhdGE6IG51bWJlcltdLCBkYXRhOiBXb3JtRGF0YSkge1xuICAgIGRlcGxveVNjcmlwdChucywgdGhyZWFkcywgXCIvaW5mZWN0L3dvcm1zL2dyb3cuanNcIiwgZGVwbG95bWVudFNlcnZlciwgSlNPTi5zdHJpbmdpZnkocmV0dXJuRGF0YSksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gd2Vha2VuKG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBkZXBsb3ltZW50U2VydmVyOiBzdHJpbmcsIHJldHVybkRhdGE6IG51bWJlcltdLCBkYXRhOiBXb3JtRGF0YSkge1xuICAgIGRlcGxveVNjcmlwdChucywgdGhyZWFkcywgXCIvaW5mZWN0L3dvcm1zL3dlYWtlbi5qc1wiLCBkZXBsb3ltZW50U2VydmVyLCBKU09OLnN0cmluZ2lmeShyZXR1cm5EYXRhKSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5mdW5jdGlvbiBoYWNrKG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBkZXBsb3ltZW50U2VydmVyOiBzdHJpbmcsIHJldHVybkRhdGE6IG51bWJlcltdLCBkYXRhOiBXb3JtRGF0YSkge1xuICAgIGRlcGxveVNjcmlwdChucywgdGhyZWFkcywgXCIvaW5mZWN0L3dvcm1zL2hhY2suanNcIiwgZGVwbG95bWVudFNlcnZlciwgSlNPTi5zdHJpbmdpZnkocmV0dXJuRGF0YSksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gZGVwbG95U2NyaXB0KG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBzY3JpcHQ6IHN0cmluZywgc2VydmVyOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgbnMuZXhlYyhzY3JpcHQsIHNlcnZlciwge3RocmVhZHMsIHRlbXBvcmFyeTogdHJ1ZX0sIC4uLmFyZ3MpO1xufVxuXG5mdW5jdGlvbiBlbnN1cmVTY3JpcHRFeGlzdGVuY2UobnM6IG5zLk5TLCBzZXJ2ZXI6IHN0cmluZykge1xuICAgIGlmICghbnMuZmlsZUV4aXN0cyhcIi9pbmZlY3Qvd29ybXMvZ3Jvdy5qc1wiLCBzZXJ2ZXIpKVxuICAgICAgICBucy5zY3AoXCIvaW5mZWN0L3dvcm1zL2dyb3cuanNcIiwgc2VydmVyLCBcImhvbWVcIik7XG4gICAgaWYgKCFucy5maWxlRXhpc3RzKFwiL2luZmVjdC93b3Jtcy9oYWNrLmpzXCIsIHNlcnZlcikpXG4gICAgICAgIG5zLnNjcChcIi9pbmZlY3Qvd29ybXMvaGFjay5qc1wiLCBzZXJ2ZXIsIFwiaG9tZVwiKTtcbiAgICBpZiAoIW5zLmZpbGVFeGlzdHMoXCIvaW5mZWN0L3dvcm1zL3dlYWtlbi5qc1wiLCBzZXJ2ZXIpKVxuICAgICAgICBucy5zY3AoXCIvaW5mZWN0L3dvcm1zL3dlYWtlbi5qc1wiLCBzZXJ2ZXIsIFwiaG9tZVwiKTtcbiAgICBpZiAoIW5zLmZpbGVFeGlzdHMoXCIvZ2VuZXJhbC9tdWx0aXBvcnQuanNcIiwgc2VydmVyKSlcbiAgICAgICAgbnMuc2NwKFwiL2dlbmVyYWwvbXVsdGlwb3J0LmpzXCIsIHNlcnZlciwgXCJob21lXCIpO1xufSJdfQ==
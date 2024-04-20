import Communicator from "/service-communicators/port-registry";
import RamnetComms from "/service-communicators/ramnet";
import Multiport from "/general/multiport";
export async function main(ns) {
    //ns.disableLog("ALL")
    ns.disableLog("sleep");
    ns.disableLog("exec");
    ns.disableLog("getScriptRam");
    ns.disableLog("scp");
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");
    const targetServer = ns.args[0];
    const commsPort = ns.args[1];
    const ramnet = new RamnetComms(ns);
    ns.print(`getting ramnet's total ram`);
    const ramnetRam = await ramnet.getTotalRam();
    ns.print(`got ramnet ram, ${ramnetRam.totalRam}`);
    const comms = ns.getPortHandle(commsPort);
    let controllerAmount; //= comms.peek() as number;
    if (!ns.fileExists("controller-data/controllers.txt")) {
        ns.print(`awaiting ${commsPort} nextWrite();`);
        await comms.nextWrite();
        controllerAmount = comms.peek();
        ns.write("controller-data/controllers.txt", controllerAmount.toString(), "w");
    }
    else {
        controllerAmount = parseInt(ns.read("controller-data/controllers.txt"));
    }
    ns.print(`got controller amount, ${controllerAmount}`);
    const ramnetDedicated = Math.floor(Math.floor(ramnetRam.totalRam / controllerAmount) * 0.98);
    ns.print(`ram on ramnet dedicated per controller: ${ramnetDedicated}`);
    const portComms = new Communicator(ns);
    const ports = (await portComms.assignFirstAvailable(1));
    const returnPorts = await portComms.assignFirstAvailable(5);
    const startSignal = ports.assignedPorts[0];
    ns.atExit(() => {
        portComms.unassignPorts(ports.assignedPorts);
        portComms.unassignPorts(returnPorts.assignedPorts);
    });
    const returnPort = new Multiport(ns, { ports: returnPorts.assignedPorts });
    await ns.sleep(50);
    const growS = "/infect/worms/grow.js";
    const hackS = "/infect/worms/hack.js";
    const weakenS = "/infect/worms/weaken.js";
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
        if (ns.getServerSecurityLevel(targetServer) >= ns.getServerMinSecurityLevel(targetServer) * 1.05) {
            let ramUsed = 0;
            ns.print(`weakening server ${targetServer}`);
            while (true) {
                await ns.sleep(1);
                const jobsAssigned = [];
                let jobsDone = 0;
                while (true) {
                    const newJob = await ramnet.assignJob(jobs.grow);
                    const server = newJob.jobAssigned.server;
                    if (server != '') {
                        const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                        let threads = Math.floor(serverRam / ns.getScriptRam(weakenS, "home"));
                        let ramUsage = ns.getScriptRam(weakenS, "home") * threads;
                        if (ramUsed + ramUsage >= ramnetDedicated) {
                            while (ramUsed + ramUsage >= ramnetDedicated) {
                                if (threads == 0)
                                    break;
                                threads -= 1;
                                ramUsage = ns.getScriptRam(weakenS, "home") * threads;
                            }
                        }
                        ramUsed += ramUsage;
                        await ramnet.finishJob(newJob.jobAssigned);
                        ns.print(`ram used: ${ramUsed}/${ramnetDedicated} w/ ${threads} threads`);
                        if (ramUsed >= ramnetDedicated || threads == 0) {
                            ramUsed -= ramUsage;
                            break;
                        }
                        const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                        if (realJob.jobAssigned.server != '') {
                            jobsDone += 1;
                            jobsAssigned.push(realJob.jobAssigned);
                            copyScripts(ns, realJob.jobAssigned.server);
                            weaken(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, { server: targetServer, startPort: startSignal });
                        }
                    }
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
                        ns.print(`job ${jobsFinished}/${jobsDone} finished`);
                    }
                    if (jobsFinished == jobsDone) {
                        ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`);
                        for (const job of jobsAssigned) {
                            await ramnet.finishJob(job);
                        }
                        ramUsed = 0;
                        break;
                    }
                }
                if (ns.getServerSecurityLevel(targetServer) <= ns.getServerMinSecurityLevel(targetServer))
                    break;
            }
        }
        if (ns.getServerMoneyAvailable(targetServer) < minMoney) {
            let ramUsed = 0;
            ns.print(`growing money available on server ${targetServer}`);
            while (true) {
                await ns.sleep(1);
                const jobsAssigned = [];
                let jobsDone = 0;
                ns.print(`assigning grow jobs for server ${targetServer}`);
                while (true) {
                    const newJob = await ramnet.assignJob(jobs.grow);
                    const server = newJob.jobAssigned.server;
                    if (server != '') {
                        const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                        let threads = Math.floor(serverRam / ns.getScriptRam(growS, "home"));
                        let ramUsage = ns.getScriptRam(growS, "home") * threads;
                        if (ramUsed + ramUsage >= ramnetDedicated) {
                            while (ramUsed + ramUsage >= ramnetDedicated) {
                                if (threads == 0)
                                    break;
                                threads -= 1;
                                ramUsage = ns.getScriptRam(growS, "home") * threads;
                            }
                        }
                        ramUsed += ramUsage;
                        await ramnet.finishJob(newJob.jobAssigned);
                        ns.print(`ram used: ${ramUsed}/${ramnetDedicated} w/ ${threads} threads`);
                        if (ramUsed >= ramnetDedicated || threads == 0) {
                            ramUsed -= ramUsage;
                            break;
                        }
                        const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                        if (realJob.jobAssigned.server != '') {
                            jobsDone += 1;
                            jobsAssigned.push(realJob.jobAssigned);
                            copyScripts(ns, realJob.jobAssigned.server);
                            grow(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, { server: targetServer, startPort: startSignal });
                        }
                    }
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
                        ns.print(`job ${jobsFinished}/${jobsDone} finished`);
                    }
                    if (jobsFinished == jobsDone) {
                        ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`);
                        for (const job of jobsAssigned) {
                            await ramnet.finishJob(job);
                        }
                        ramUsed = 0;
                        break;
                    }
                }
                if (ns.getServerMoneyAvailable(targetServer) >= ns.getServerMaxMoney(targetServer))
                    break;
            }
        }
        if (ns.getServerSecurityLevel(targetServer) >= ns.getServerMinSecurityLevel(targetServer) * 1.05) {
            let ramUsed = 0;
            ns.print(`weakening server ${targetServer}`);
            while (true) {
                await ns.sleep(1);
                const jobsAssigned = [];
                let jobsDone = 0;
                while (true) {
                    const newJob = await ramnet.assignJob(jobs.grow);
                    const server = newJob.jobAssigned.server;
                    if (server != '') {
                        const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                        let threads = Math.floor(serverRam / ns.getScriptRam(weakenS, "home"));
                        let ramUsage = ns.getScriptRam(weakenS, "home") * threads;
                        if (ramUsed + ramUsage >= ramnetDedicated) {
                            while (ramUsed + ramUsage >= ramnetDedicated) {
                                if (threads == 0)
                                    break;
                                threads -= 1;
                                ramUsage = ns.getScriptRam(weakenS, "home") * threads;
                            }
                        }
                        ramUsed += ramUsage;
                        await ramnet.finishJob(newJob.jobAssigned);
                        ns.print(`ram used: ${ramUsed}/${ramnetDedicated} w/ ${threads} threads`);
                        if (ramUsed >= ramnetDedicated || threads == 0) {
                            ramUsed -= ramUsage;
                            break;
                        }
                        const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                        if (realJob.jobAssigned.server != '') {
                            jobsDone += 1;
                            jobsAssigned.push(realJob.jobAssigned);
                            copyScripts(ns, realJob.jobAssigned.server);
                            weaken(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, { server: targetServer, startPort: startSignal });
                        }
                    }
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
                        ns.print(`job ${jobsFinished}/${jobsDone} finished`);
                    }
                    if (jobsFinished == jobsDone) {
                        ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`);
                        for (const job of jobsAssigned) {
                            await ramnet.finishJob(job);
                        }
                        ramUsed = 0;
                        break;
                    }
                }
                if (ns.getServerSecurityLevel(targetServer) <= ns.getServerMinSecurityLevel(targetServer))
                    break;
            }
        }
        ns.print(`hacking server ${targetServer}`);
        while (true) {
            let ramUsed = 0;
            await ns.sleep(1);
            const jobsAssigned = [];
            let jobsDone = 0;
            while (true) {
                const newJob = await ramnet.assignJob(jobs.grow);
                const server = newJob.jobAssigned.server;
                if (server != '') {
                    const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                    let threads = Math.floor(serverRam / ns.getScriptRam(hackS, "home"));
                    let ramUsage = ns.getScriptRam(hackS, "home") * threads;
                    if (ramUsed + ramUsage >= ramnetDedicated) {
                        while (ramUsed + ramUsage >= ramnetDedicated) {
                            if (threads <= 0)
                                break;
                            threads -= 1;
                            ramUsage = ns.getScriptRam(hackS, "home") * threads;
                        }
                    }
                    ramUsed += ramUsage;
                    await ramnet.finishJob(newJob.jobAssigned);
                    ns.print(`ram used: ${ramUsed}/${ramnetDedicated} w/ ${threads} threads`);
                    if (ramUsed >= ramnetDedicated || threads == 0) {
                        ramUsed -= ramUsage;
                        break;
                    }
                    const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                    if (realJob.jobAssigned.server != '') {
                        jobsDone += 1;
                        jobsAssigned.push(realJob.jobAssigned);
                        copyScripts(ns, realJob.jobAssigned.server);
                        hack(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, { server: targetServer, startPort: startSignal });
                    }
                }
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
                    ns.print(`job ${jobsFinished}/${jobsDone} finished`);
                }
                if (jobsFinished == jobsDone) {
                    ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`);
                    for (const job of jobsAssigned) {
                        await ramnet.finishJob(job);
                    }
                    ramUsed = 0;
                    break;
                }
            }
            if (ns.getServerSecurityLevel(targetServer) >= ns.getServerMinSecurityLevel(targetServer) * 1.5)
                break;
            if (ns.getServerMoneyAvailable(targetServer) <= ns.getServerMaxMoney(targetServer) * 0.3)
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
function copyScripts(ns, server) {
    try {
        ns.scp(["/infect/worms/grow.js", "/infect/worms/hack.js", "/infect/worms/weaken.js", "/general/multiport.js"], server, "home");
    }
    catch { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmZlY3QvY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxzQ0FBc0MsQ0FBQztBQUNoRSxPQUFPLFdBQVcsTUFBTSwrQkFBK0IsQ0FBQztBQUd4RCxPQUFPLFNBQVMsTUFBTSxvQkFBb0IsQ0FBQztBQUUzQyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFTO0lBQ2hDLHNCQUFzQjtJQUN0QixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5QixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqQyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQVcsQ0FBQztJQUMxQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBVyxDQUFDO0lBQ3ZDLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLEVBQUUsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUN2QyxNQUFNLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QyxFQUFFLENBQUMsS0FBSyxDQUFDLG1CQUFtQixTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUNsRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLElBQUksZ0JBQXdCLENBQUEsQ0FBQywyQkFBMkI7SUFDeEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUNBQWlDLENBQUMsRUFBRTtRQUNuRCxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksU0FBUyxlQUFlLENBQUMsQ0FBQTtRQUM5QyxNQUFNLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4QixnQkFBZ0IsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFZLENBQUM7UUFDMUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNqRjtTQUNJO1FBQ0QsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDO0tBQzNFO0lBQ0QsRUFBRSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDN0YsRUFBRSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUN2RSxNQUFNLFNBQVMsR0FBRyxJQUFJLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QyxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNYLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQzVDLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxhQUFhLEVBQUMsQ0FBQyxDQUFBO0lBQ3hFLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuQixNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztJQUN0QyxNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyx5QkFBeUIsQ0FBQztJQUMxQyxNQUFNLElBQUksR0FBRztRQUNULElBQUksRUFBRTtZQUNGLEdBQUcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDbkMsTUFBTSxFQUFFLEVBQUU7U0FDYjtRQUNELE1BQU0sRUFBRTtZQUNKLEdBQUcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDckMsTUFBTSxFQUFFLEVBQUU7U0FDYjtRQUNELElBQUksRUFBRTtZQUNGLEdBQUcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDbkMsTUFBTSxFQUFFLEVBQUU7U0FDYjtLQUNKLENBQUE7SUFDRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDMUQsT0FBTyxJQUFJLEVBQUU7UUFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxFQUFFLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRTtZQUM5RixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUM3QyxPQUFPLElBQUksRUFBRTtnQkFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sWUFBWSxHQUFVLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLElBQUksRUFBRTtvQkFDVCxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztvQkFDekMsSUFBSSxNQUFNLElBQUksRUFBRSxFQUFFO3dCQUNkLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUMzRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN2RSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUM7d0JBQzFELElBQUksT0FBTyxHQUFHLFFBQVEsSUFBSSxlQUFlLEVBQUU7NEJBQ3ZDLE9BQU8sT0FBTyxHQUFHLFFBQVEsSUFBSSxlQUFlLEVBQUU7Z0NBQzFDLElBQUksT0FBTyxJQUFJLENBQUM7b0NBQUUsTUFBTTtnQ0FDeEIsT0FBTyxJQUFJLENBQUMsQ0FBQztnQ0FDYixRQUFRLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDOzZCQUN6RDt5QkFDSjt3QkFDRCxPQUFPLElBQUksUUFBUSxDQUFDO3dCQUNwQixNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUMzQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsT0FBTyxJQUFJLGVBQWUsT0FBTyxPQUFPLFVBQVUsQ0FBQyxDQUFDO3dCQUMxRSxJQUFJLE9BQU8sSUFBSSxlQUFlLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRTs0QkFDNUMsT0FBTyxJQUFJLFFBQVEsQ0FBQzs0QkFDcEIsTUFBTTt5QkFDVDt3QkFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRTs0QkFDbEMsUUFBUSxJQUFJLENBQUMsQ0FBQzs0QkFDZCxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs0QkFDdEMsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUM1QyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsYUFBYSxFQUFFLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQzt5QkFDOUg7cUJBQ0o7aUJBQ0o7Z0JBQ0QsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7Z0JBQzNELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNsQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixPQUFPLElBQUksRUFBRTtvQkFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQUU7d0JBQ3JCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDbEIsWUFBWSxFQUFFLENBQUM7d0JBQ2YsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLFlBQVksSUFBSSxRQUFRLFdBQVcsQ0FBQyxDQUFBO3FCQUN2RDtvQkFDRCxJQUFJLFlBQVksSUFBSSxRQUFRLEVBQUU7d0JBQzFCLEVBQUUsQ0FBQyxLQUFLLENBQUMseUNBQXlDLFlBQVksUUFBUSxDQUFDLENBQUE7d0JBQ3ZFLEtBQUssTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFOzRCQUM1QixNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQy9CO3dCQUNELE9BQU8sR0FBRyxDQUFDLENBQUM7d0JBQ1osTUFBTTtxQkFDVDtpQkFDSjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDO29CQUNyRixNQUFNO2FBQ2I7U0FDSjtRQUNELElBQUksRUFBRSxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsRUFBRTtZQUNyRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUM5RCxPQUFPLElBQUksRUFBRTtnQkFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sWUFBWSxHQUFVLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixFQUFFLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO2dCQUMzRCxPQUFPLElBQUksRUFBRTtvQkFDVCxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztvQkFDekMsSUFBSSxNQUFNLElBQUksRUFBRSxFQUFFO3dCQUNkLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUMzRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUM7d0JBQ3hELElBQUksT0FBTyxHQUFHLFFBQVEsSUFBSSxlQUFlLEVBQUU7NEJBQ3ZDLE9BQU8sT0FBTyxHQUFHLFFBQVEsSUFBSSxlQUFlLEVBQUU7Z0NBQzFDLElBQUksT0FBTyxJQUFJLENBQUM7b0NBQUUsTUFBTTtnQ0FDeEIsT0FBTyxJQUFJLENBQUMsQ0FBQztnQ0FDYixRQUFRLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDOzZCQUN2RDt5QkFDSjt3QkFDRCxPQUFPLElBQUksUUFBUSxDQUFDO3dCQUNwQixNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUMzQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsT0FBTyxJQUFJLGVBQWUsT0FBTyxPQUFPLFVBQVUsQ0FBQyxDQUFDO3dCQUMxRSxJQUFJLE9BQU8sSUFBSSxlQUFlLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRTs0QkFDNUMsT0FBTyxJQUFJLFFBQVEsQ0FBQzs0QkFDcEIsTUFBTTt5QkFDVDt3QkFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRTs0QkFDbEMsUUFBUSxJQUFJLENBQUMsQ0FBQzs0QkFDZCxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs0QkFDdEMsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUM1QyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsYUFBYSxFQUFFLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQzt5QkFDNUg7cUJBQ0o7aUJBQ0o7Z0JBQ0QsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7Z0JBQzNELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNsQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixPQUFPLElBQUksRUFBRTtvQkFDVCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQUU7d0JBQ3JCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDbEIsWUFBWSxFQUFFLENBQUM7d0JBQ2YsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLFlBQVksSUFBSSxRQUFRLFdBQVcsQ0FBQyxDQUFBO3FCQUN2RDtvQkFDRCxJQUFJLFlBQVksSUFBSSxRQUFRLEVBQUU7d0JBQzFCLEVBQUUsQ0FBQyxLQUFLLENBQUMseUNBQXlDLFlBQVksUUFBUSxDQUFDLENBQUE7d0JBQ3ZFLEtBQUssTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFOzRCQUM1QixNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQy9CO3dCQUNELE9BQU8sR0FBRyxDQUFDLENBQUM7d0JBQ1osTUFBTTtxQkFDVDtpQkFDSjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDO29CQUM5RSxNQUFNO2FBQ2I7U0FDSjtRQUNELElBQUksRUFBRSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLEVBQUU7WUFDOUYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDN0MsT0FBTyxJQUFJLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLFlBQVksR0FBVSxFQUFFLENBQUM7Z0JBQy9CLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFDakIsT0FBTyxJQUFJLEVBQUU7b0JBQ1QsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7b0JBQ3pDLElBQUksTUFBTSxJQUFJLEVBQUUsRUFBRTt3QkFDZCxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDM0UsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDdkUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDO3dCQUMxRCxJQUFJLE9BQU8sR0FBRyxRQUFRLElBQUksZUFBZSxFQUFFOzRCQUN2QyxPQUFPLE9BQU8sR0FBRyxRQUFRLElBQUksZUFBZSxFQUFFO2dDQUMxQyxJQUFJLE9BQU8sSUFBSSxDQUFDO29DQUFFLE1BQU07Z0NBQ3hCLE9BQU8sSUFBSSxDQUFDLENBQUM7Z0NBQ2IsUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQzs2QkFDekQ7eUJBQ0o7d0JBQ0QsT0FBTyxJQUFJLFFBQVEsQ0FBQzt3QkFDcEIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDM0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLE9BQU8sSUFBSSxlQUFlLE9BQU8sT0FBTyxVQUFVLENBQUMsQ0FBQzt3QkFDMUUsSUFBSSxPQUFPLElBQUksZUFBZSxJQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUU7NEJBQzVDLE9BQU8sSUFBSSxRQUFRLENBQUM7NEJBQ3BCLE1BQU07eUJBQ1Q7d0JBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQzt3QkFDcEUsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUU7NEJBQ2xDLFFBQVEsSUFBSSxDQUFDLENBQUM7NEJBQ2QsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7NEJBQ3RDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDNUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7eUJBQzlIO3FCQUNKO2lCQUNKO2dCQUNELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsT0FBTyxJQUFJLEVBQUU7b0JBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFO3dCQUNyQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ2xCLFlBQVksRUFBRSxDQUFDO3dCQUNmLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxZQUFZLElBQUksUUFBUSxXQUFXLENBQUMsQ0FBQTtxQkFDdkQ7b0JBQ0QsSUFBSSxZQUFZLElBQUksUUFBUSxFQUFFO3dCQUMxQixFQUFFLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxZQUFZLFFBQVEsQ0FBQyxDQUFBO3dCQUN2RSxLQUFLLE1BQU0sR0FBRyxJQUFJLFlBQVksRUFBRTs0QkFDNUIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUMvQjt3QkFDRCxPQUFPLEdBQUcsQ0FBQyxDQUFDO3dCQUNaLE1BQU07cUJBQ1Q7aUJBQ0o7Z0JBQ0QsSUFBSSxFQUFFLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLFlBQVksQ0FBQztvQkFDckYsTUFBTTthQUNiO1NBQ0o7UUFDRCxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sSUFBSSxFQUFFO1lBQ1QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLFlBQVksR0FBVSxFQUFFLENBQUM7WUFDL0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sSUFBSSxFQUFFO2dCQUNULE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUN6QyxJQUFJLE1BQU0sSUFBSSxFQUFFLEVBQUU7b0JBQ2QsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzNFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3JFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztvQkFDeEQsSUFBSSxPQUFPLEdBQUcsUUFBUSxJQUFJLGVBQWUsRUFBRTt3QkFDdkMsT0FBTyxPQUFPLEdBQUcsUUFBUSxJQUFJLGVBQWUsRUFBRTs0QkFDMUMsSUFBSSxPQUFPLElBQUksQ0FBQztnQ0FBRSxNQUFNOzRCQUN4QixPQUFPLElBQUksQ0FBQyxDQUFDOzRCQUNiLFFBQVEsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUM7eUJBQ3ZEO3FCQUNKO29CQUNELE9BQU8sSUFBSSxRQUFRLENBQUM7b0JBQ3BCLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzNDLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBYSxPQUFPLElBQUksZUFBZSxPQUFPLE9BQU8sVUFBVSxDQUFDLENBQUM7b0JBQzFFLElBQUksT0FBTyxJQUFJLGVBQWUsSUFBSSxPQUFPLElBQUksQ0FBQyxFQUFFO3dCQUM1QyxPQUFPLElBQUksUUFBUSxDQUFDO3dCQUNwQixNQUFNO3FCQUNUO29CQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7b0JBQ3BFLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksRUFBRSxFQUFFO3dCQUNsQyxRQUFRLElBQUksQ0FBQyxDQUFDO3dCQUNkLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO3dCQUN0QyxXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQzVDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO3FCQUM1SDtpQkFDSjthQUNKO1lBQ0QsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztZQUMzRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsT0FBTyxJQUFJLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUNyQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2xCLFlBQVksRUFBRSxDQUFDO29CQUNmLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxZQUFZLElBQUksUUFBUSxXQUFXLENBQUMsQ0FBQTtpQkFDdkQ7Z0JBQ0QsSUFBSSxZQUFZLElBQUksUUFBUSxFQUFFO29CQUMxQixFQUFFLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxZQUFZLFFBQVEsQ0FBQyxDQUFBO29CQUN2RSxLQUFLLE1BQU0sR0FBRyxJQUFJLFlBQVksRUFBRTt3QkFDNUIsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMvQjtvQkFDRCxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLE1BQU07aUJBQ1Q7YUFDSjtZQUNELElBQUksRUFBRSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHO2dCQUMzRixNQUFNO1lBQ1YsSUFBSSxFQUFFLENBQUMsdUJBQXVCLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUc7Z0JBQ3BGLE1BQU07U0FDYjtLQUNKO0FBQ0wsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFDLEVBQVMsRUFBRSxPQUFlLEVBQUUsZ0JBQXdCLEVBQUUsVUFBb0IsRUFBRSxJQUFjO0lBQ3BHLFlBQVksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNILENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxFQUFTLEVBQUUsT0FBZSxFQUFFLGdCQUF3QixFQUFFLFVBQW9CLEVBQUUsSUFBYztJQUN0RyxZQUFZLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3SCxDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsRUFBUyxFQUFFLE9BQWUsRUFBRSxnQkFBd0IsRUFBRSxVQUFvQixFQUFFLElBQWM7SUFDcEcsWUFBWSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0gsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEVBQVMsRUFBRSxPQUFlLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFBRSxHQUFHLElBQVc7SUFDNUYsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxFQUFTLEVBQUUsTUFBYztJQUMxQyxJQUFJO1FBQ0EsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLHVCQUF1QixFQUFFLHlCQUF5QixFQUFFLHVCQUF1QixDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0tBQ2pJO0lBQ0QsTUFBTSxHQUFFO0FBQ1osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5pbXBvcnQgQ29tbXVuaWNhdG9yIGZyb20gXCIvc2VydmljZS1jb21tdW5pY2F0b3JzL3BvcnQtcmVnaXN0cnlcIjtcbmltcG9ydCBSYW1uZXRDb21tcyBmcm9tIFwiL3NlcnZpY2UtY29tbXVuaWNhdG9ycy9yYW1uZXRcIjtcbmltcG9ydCB7IEpvYiB9IGZyb20gXCIvZ2VuZXJhbC9yYW1uZXRcIjtcbmltcG9ydCB7IFdvcm1EYXRhIH0gZnJvbSBcIi4vd29ybXMvdHlwZXNcIjtcbmltcG9ydCBNdWx0aXBvcnQgZnJvbSBcIi9nZW5lcmFsL211bHRpcG9ydFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihuczogbnMuTlMpIHtcbiAgICAvL25zLmRpc2FibGVMb2coXCJBTExcIilcbiAgICBucy5kaXNhYmxlTG9nKFwic2xlZXBcIik7XG4gICAgbnMuZGlzYWJsZUxvZyhcImV4ZWNcIik7XG4gICAgbnMuZGlzYWJsZUxvZyhcImdldFNjcmlwdFJhbVwiKTtcbiAgICBucy5kaXNhYmxlTG9nKFwic2NwXCIpO1xuICAgIG5zLmRpc2FibGVMb2coXCJnZXRTZXJ2ZXJNYXhSYW1cIik7XG4gICAgbnMuZGlzYWJsZUxvZyhcImdldFNlcnZlclVzZWRSYW1cIik7XG4gICAgY29uc3QgdGFyZ2V0U2VydmVyID0gbnMuYXJnc1swXSBhcyBzdHJpbmc7XG4gICAgY29uc3QgY29tbXNQb3J0ID0gbnMuYXJnc1sxXSBhcyBudW1iZXI7XG4gICAgY29uc3QgcmFtbmV0ID0gbmV3IFJhbW5ldENvbW1zKG5zKTtcbiAgICBucy5wcmludChgZ2V0dGluZyByYW1uZXQncyB0b3RhbCByYW1gKTtcbiAgICBjb25zdCByYW1uZXRSYW0gPSBhd2FpdCByYW1uZXQuZ2V0VG90YWxSYW0oKTtcbiAgICBucy5wcmludChgZ290IHJhbW5ldCByYW0sICR7cmFtbmV0UmFtLnRvdGFsUmFtfWApO1xuICAgIGNvbnN0IGNvbW1zID0gbnMuZ2V0UG9ydEhhbmRsZShjb21tc1BvcnQpO1xuICAgIGxldCBjb250cm9sbGVyQW1vdW50OiBudW1iZXIgLy89IGNvbW1zLnBlZWsoKSBhcyBudW1iZXI7XG4gICAgaWYgKCFucy5maWxlRXhpc3RzKFwiY29udHJvbGxlci1kYXRhL2NvbnRyb2xsZXJzLnR4dFwiKSkge1xuICAgICAgICBucy5wcmludChgYXdhaXRpbmcgJHtjb21tc1BvcnR9IG5leHRXcml0ZSgpO2ApXG4gICAgICAgIGF3YWl0IGNvbW1zLm5leHRXcml0ZSgpO1xuICAgICAgICBjb250cm9sbGVyQW1vdW50ID0gY29tbXMucGVlaygpIGFzIG51bWJlcjtcbiAgICAgICAgbnMud3JpdGUoXCJjb250cm9sbGVyLWRhdGEvY29udHJvbGxlcnMudHh0XCIsIGNvbnRyb2xsZXJBbW91bnQudG9TdHJpbmcoKSwgXCJ3XCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29udHJvbGxlckFtb3VudCA9IHBhcnNlSW50KG5zLnJlYWQoXCJjb250cm9sbGVyLWRhdGEvY29udHJvbGxlcnMudHh0XCIpKTtcbiAgICB9XG4gICAgbnMucHJpbnQoYGdvdCBjb250cm9sbGVyIGFtb3VudCwgJHtjb250cm9sbGVyQW1vdW50fWApO1xuICAgIGNvbnN0IHJhbW5ldERlZGljYXRlZCA9IE1hdGguZmxvb3IoTWF0aC5mbG9vcihyYW1uZXRSYW0udG90YWxSYW0gLyBjb250cm9sbGVyQW1vdW50KSAqIDAuOTgpO1xuICAgIG5zLnByaW50KGByYW0gb24gcmFtbmV0IGRlZGljYXRlZCBwZXIgY29udHJvbGxlcjogJHtyYW1uZXREZWRpY2F0ZWR9YCk7XG4gICAgY29uc3QgcG9ydENvbW1zID0gbmV3IENvbW11bmljYXRvcihucyk7XG4gICAgY29uc3QgcG9ydHMgPSAoYXdhaXQgcG9ydENvbW1zLmFzc2lnbkZpcnN0QXZhaWxhYmxlKDEpKTtcbiAgICBjb25zdCByZXR1cm5Qb3J0cyA9IGF3YWl0IHBvcnRDb21tcy5hc3NpZ25GaXJzdEF2YWlsYWJsZSg1KTtcbiAgICBjb25zdCBzdGFydFNpZ25hbCA9IHBvcnRzLmFzc2lnbmVkUG9ydHNbMF07XG4gICAgbnMuYXRFeGl0KCgpID0+IHtcbiAgICAgICAgcG9ydENvbW1zLnVuYXNzaWduUG9ydHMocG9ydHMuYXNzaWduZWRQb3J0cylcbiAgICAgICAgcG9ydENvbW1zLnVuYXNzaWduUG9ydHMocmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0cyk7XG4gICAgfSk7XG4gICAgY29uc3QgcmV0dXJuUG9ydCA9IG5ldyBNdWx0aXBvcnQobnMsIHtwb3J0czogcmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0c30pXG4gICAgYXdhaXQgbnMuc2xlZXAoNTApO1xuICAgIGNvbnN0IGdyb3dTID0gXCIvaW5mZWN0L3dvcm1zL2dyb3cuanNcIjtcbiAgICBjb25zdCBoYWNrUyA9IFwiL2luZmVjdC93b3Jtcy9oYWNrLmpzXCI7XG4gICAgY29uc3Qgd2Vha2VuUyA9IFwiL2luZmVjdC93b3Jtcy93ZWFrZW4uanNcIjtcbiAgICBjb25zdCBqb2JzID0ge1xuICAgICAgICBncm93OiB7XG4gICAgICAgICAgICByYW06IG5zLmdldFNjcmlwdFJhbShncm93UywgXCJob21lXCIpLFxuICAgICAgICAgICAgc2VydmVyOiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIHdlYWtlbjoge1xuICAgICAgICAgICAgcmFtOiBucy5nZXRTY3JpcHRSYW0od2Vha2VuUywgXCJob21lXCIpLFxuICAgICAgICAgICAgc2VydmVyOiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIGhhY2s6IHtcbiAgICAgICAgICAgIHJhbTogbnMuZ2V0U2NyaXB0UmFtKGhhY2tTLCBcImhvbWVcIiksXG4gICAgICAgICAgICBzZXJ2ZXI6IFwiXCJcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzdGFydCA9IG5zLmdldFBvcnRIYW5kbGUoc3RhcnRTaWduYWwpO1xuICAgIGNvbnN0IG1pbk1vbmV5ID0gbnMuZ2V0U2VydmVyTWF4TW9uZXkodGFyZ2V0U2VydmVyKSAqIDAuNTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgaWYgKG5zLmdldFNlcnZlclNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSA+PSBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgKiAxLjA1KSB7XG4gICAgICAgICAgICBsZXQgcmFtVXNlZCA9IDA7XG4gICAgICAgICAgICBucy5wcmludChgd2Vha2VuaW5nIHNlcnZlciAke3RhcmdldFNlcnZlcn1gKTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9ic0Fzc2lnbmVkOiBKb2JbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBqb2JzRG9uZSA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Sm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYihqb2JzLmdyb3cpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXdKb2Iuam9iQXNzaWduZWQuc2VydmVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VydmVyICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXJSYW0gPSBucy5nZXRTZXJ2ZXJNYXhSYW0oc2VydmVyKSAtIG5zLmdldFNlcnZlclVzZWRSYW0oc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aHJlYWRzID0gTWF0aC5mbG9vcihzZXJ2ZXJSYW0gLyBucy5nZXRTY3JpcHRSYW0od2Vha2VuUywgXCJob21lXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgKyByYW1Vc2FnZSA+PSByYW1uZXREZWRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAocmFtVXNlZCArIHJhbVVzYWdlID49IHJhbW5ldERlZGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhyZWFkcyA9PSAwKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyZWFkcyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKG5ld0pvYi5qb2JBc3NpZ25lZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgcmFtIHVzZWQ6ICR7cmFtVXNlZH0vJHtyYW1uZXREZWRpY2F0ZWR9IHcvICR7dGhyZWFkc30gdGhyZWFkc2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgPj0gcmFtbmV0RGVkaWNhdGVkIHx8IHRocmVhZHMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgLT0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFsSm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYih7cmFtOiByYW1Vc2FnZSwgc2VydmVyOiBcIlwifSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JzRG9uZSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNBc3NpZ25lZC5wdXNoKHJlYWxKb2Iuam9iQXNzaWduZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29weVNjcmlwdHMobnMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWFrZW4obnMsIHRocmVhZHMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyLCByZXR1cm5Qb3J0cy5hc3NpZ25lZFBvcnRzLCB7c2VydmVyOiB0YXJnZXRTZXJ2ZXIsIHN0YXJ0UG9ydDogc3RhcnRTaWduYWx9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgam9ic0ZpbmlzaGVkID0gMDtcbiAgICAgICAgICAgICAgICBucy5wcmludChgbWFraW5nIHN1cmUgYWxsIHNjcmlwdHMgY2FuIGdldCBzdGFydCBzaWduYWwuLmApO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwMDApO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBzdGFydGluZyBhbGwgc2NyaXB0cy5gKTtcbiAgICAgICAgICAgICAgICBzdGFydC53cml0ZShcIkdPXCIpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJldHVyblBvcnQuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUG9ydC5yZWFkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JzRmluaXNoZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGBqb2IgJHtqb2JzRmluaXNoZWR9LyR7am9ic0RvbmV9IGZpbmlzaGVkYClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoam9ic0ZpbmlzaGVkID09IGpvYnNEb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgdGVsbGluZyByYW1uZXQgdGhlIGpvYnMgYXJlIGZpbmlzaGVkICgke2pvYnNGaW5pc2hlZH0gam9icylgKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBqb2Igb2Ygam9ic0Fzc2lnbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihqb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobnMuZ2V0U2VydmVyU2VjdXJpdHlMZXZlbCh0YXJnZXRTZXJ2ZXIpIDw9IG5zLmdldFNlcnZlck1pblNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKHRhcmdldFNlcnZlcikgPCBtaW5Nb25leSkge1xuICAgICAgICAgICAgbGV0IHJhbVVzZWQgPSAwO1xuICAgICAgICAgICAgbnMucHJpbnQoYGdyb3dpbmcgbW9uZXkgYXZhaWxhYmxlIG9uIHNlcnZlciAke3RhcmdldFNlcnZlcn1gKTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9ic0Fzc2lnbmVkOiBKb2JbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBqb2JzRG9uZSA9IDA7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoYGFzc2lnbmluZyBncm93IGpvYnMgZm9yIHNlcnZlciAke3RhcmdldFNlcnZlcn1gKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdKb2IgPSBhd2FpdCByYW1uZXQuYXNzaWduSm9iKGpvYnMuZ3Jvdyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IG5ld0pvYi5qb2JBc3NpZ25lZC5zZXJ2ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXJ2ZXIgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlclJhbSA9IG5zLmdldFNlcnZlck1heFJhbShzZXJ2ZXIpIC0gbnMuZ2V0U2VydmVyVXNlZFJhbShzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRocmVhZHMgPSBNYXRoLmZsb29yKHNlcnZlclJhbSAvIG5zLmdldFNjcmlwdFJhbShncm93UywgXCJob21lXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbShncm93UywgXCJob21lXCIpICogdGhyZWFkcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHJhbVVzZWQgKyByYW1Vc2FnZSA+PSByYW1uZXREZWRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRocmVhZHMgPT0gMCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocmVhZHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNhZ2UgPSBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSAqIHRocmVhZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCArPSByYW1Vc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2IobmV3Sm9iLmpvYkFzc2lnbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGByYW0gdXNlZDogJHtyYW1Vc2VkfS8ke3JhbW5ldERlZGljYXRlZH0gdy8gJHt0aHJlYWRzfSB0aHJlYWRzYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFtVXNlZCA+PSByYW1uZXREZWRpY2F0ZWQgfHwgdGhyZWFkcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCAtPSByYW1Vc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWxKb2IgPSBhd2FpdCByYW1uZXQuYXNzaWduSm9iKHtyYW06IHJhbVVzYWdlLCBzZXJ2ZXI6IFwiXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlciAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNEb25lICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9ic0Fzc2lnbmVkLnB1c2gocmVhbEpvYi5qb2JBc3NpZ25lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3B5U2NyaXB0cyhucywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3cobnMsIHRocmVhZHMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyLCByZXR1cm5Qb3J0cy5hc3NpZ25lZFBvcnRzLCB7c2VydmVyOiB0YXJnZXRTZXJ2ZXIsIHN0YXJ0UG9ydDogc3RhcnRTaWduYWx9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgam9ic0ZpbmlzaGVkID0gMDtcbiAgICAgICAgICAgICAgICBucy5wcmludChgbWFraW5nIHN1cmUgYWxsIHNjcmlwdHMgY2FuIGdldCBzdGFydCBzaWduYWwuLmApO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwMDApO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBzdGFydGluZyBhbGwgc2NyaXB0cy5gKTtcbiAgICAgICAgICAgICAgICBzdGFydC53cml0ZShcIkdPXCIpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJldHVyblBvcnQuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUG9ydC5yZWFkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JzRmluaXNoZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGBqb2IgJHtqb2JzRmluaXNoZWR9LyR7am9ic0RvbmV9IGZpbmlzaGVkYClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoam9ic0ZpbmlzaGVkID09IGpvYnNEb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgdGVsbGluZyByYW1uZXQgdGhlIGpvYnMgYXJlIGZpbmlzaGVkICgke2pvYnNGaW5pc2hlZH0gam9icylgKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBqb2Igb2Ygam9ic0Fzc2lnbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihqb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUodGFyZ2V0U2VydmVyKSA+PSBucy5nZXRTZXJ2ZXJNYXhNb25leSh0YXJnZXRTZXJ2ZXIpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobnMuZ2V0U2VydmVyU2VjdXJpdHlMZXZlbCh0YXJnZXRTZXJ2ZXIpID49IG5zLmdldFNlcnZlck1pblNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSAqIDEuMDUpIHtcbiAgICAgICAgICAgIGxldCByYW1Vc2VkID0gMDtcbiAgICAgICAgICAgIG5zLnByaW50KGB3ZWFrZW5pbmcgc2VydmVyICR7dGFyZ2V0U2VydmVyfWApO1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JzQXNzaWduZWQ6IEpvYltdID0gW107XG4gICAgICAgICAgICAgICAgbGV0IGpvYnNEb25lID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdKb2IgPSBhd2FpdCByYW1uZXQuYXNzaWduSm9iKGpvYnMuZ3Jvdyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlciA9IG5ld0pvYi5qb2JBc3NpZ25lZC5zZXJ2ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXJ2ZXIgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlclJhbSA9IG5zLmdldFNlcnZlck1heFJhbShzZXJ2ZXIpIC0gbnMuZ2V0U2VydmVyVXNlZFJhbShzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRocmVhZHMgPSBNYXRoLmZsb29yKHNlcnZlclJhbSAvIG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKHdlYWtlblMsIFwiaG9tZVwiKSAqIHRocmVhZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFtVXNlZCArIHJhbVVzYWdlID49IHJhbW5ldERlZGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aHJlYWRzID09IDApIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJlYWRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKHdlYWtlblMsIFwiaG9tZVwiKSAqIHRocmVhZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCArPSByYW1Vc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2IobmV3Sm9iLmpvYkFzc2lnbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGByYW0gdXNlZDogJHtyYW1Vc2VkfS8ke3JhbW5ldERlZGljYXRlZH0gdy8gJHt0aHJlYWRzfSB0aHJlYWRzYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFtVXNlZCA+PSByYW1uZXREZWRpY2F0ZWQgfHwgdGhyZWFkcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCAtPSByYW1Vc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWxKb2IgPSBhd2FpdCByYW1uZXQuYXNzaWduSm9iKHtyYW06IHJhbVVzYWdlLCBzZXJ2ZXI6IFwiXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlciAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNEb25lICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9ic0Fzc2lnbmVkLnB1c2gocmVhbEpvYi5qb2JBc3NpZ25lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3B5U2NyaXB0cyhucywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlYWtlbihucywgdGhyZWFkcywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIsIHJldHVyblBvcnRzLmFzc2lnbmVkUG9ydHMsIHtzZXJ2ZXI6IHRhcmdldFNlcnZlciwgc3RhcnRQb3J0OiBzdGFydFNpZ25hbH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBqb2JzRmluaXNoZWQgPSAwO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBtYWtpbmcgc3VyZSBhbGwgc2NyaXB0cyBjYW4gZ2V0IHN0YXJ0IHNpZ25hbC4uYCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMTAwMCk7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoYHN0YXJ0aW5nIGFsbCBzY3JpcHRzLmApO1xuICAgICAgICAgICAgICAgIHN0YXJ0LndyaXRlKFwiR09cIik7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmV0dXJuUG9ydC5lbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Qb3J0LnJlYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNGaW5pc2hlZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYGpvYiAke2pvYnNGaW5pc2hlZH0vJHtqb2JzRG9uZX0gZmluaXNoZWRgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChqb2JzRmluaXNoZWQgPT0gam9ic0RvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGB0ZWxsaW5nIHJhbW5ldCB0aGUgam9icyBhcmUgZmluaXNoZWQgKCR7am9ic0ZpbmlzaGVkfSBqb2JzKWApXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGpvYiBvZiBqb2JzQXNzaWduZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKGpvYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2VkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChucy5nZXRTZXJ2ZXJTZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgPD0gbnMuZ2V0U2VydmVyTWluU2VjdXJpdHlMZXZlbCh0YXJnZXRTZXJ2ZXIpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBucy5wcmludChgaGFja2luZyBzZXJ2ZXIgJHt0YXJnZXRTZXJ2ZXJ9YCk7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBsZXQgcmFtVXNlZCA9IDA7XG4gICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgIGNvbnN0IGpvYnNBc3NpZ25lZDogSm9iW10gPSBbXTtcbiAgICAgICAgICAgIGxldCBqb2JzRG9uZSA9IDA7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0pvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioam9icy5ncm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXdKb2Iuam9iQXNzaWduZWQuc2VydmVyO1xuICAgICAgICAgICAgICAgIGlmIChzZXJ2ZXIgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKHNlcnZlcikgLSBucy5nZXRTZXJ2ZXJVc2VkUmFtKHNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aHJlYWRzID0gTWF0aC5mbG9vcihzZXJ2ZXJSYW0gLyBucy5nZXRTY3JpcHRSYW0oaGFja1MsIFwiaG9tZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbShoYWNrUywgXCJob21lXCIpICogdGhyZWFkcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgKyByYW1Vc2FnZSA+PSByYW1uZXREZWRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRocmVhZHMgPD0gMCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyZWFkcyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKGhhY2tTLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2IobmV3Sm9iLmpvYkFzc2lnbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHJhbSB1c2VkOiAke3JhbVVzZWR9LyR7cmFtbmV0RGVkaWNhdGVkfSB3LyAke3RocmVhZHN9IHRocmVhZHNgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgPj0gcmFtbmV0RGVkaWNhdGVkIHx8IHRocmVhZHMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCAtPSByYW1Vc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWxKb2IgPSBhd2FpdCByYW1uZXQuYXNzaWduSm9iKHtyYW06IHJhbVVzYWdlLCBzZXJ2ZXI6IFwiXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JzRG9uZSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgam9ic0Fzc2lnbmVkLnB1c2gocmVhbEpvYi5qb2JBc3NpZ25lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlTY3JpcHRzKG5zLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYWNrKG5zLCB0aHJlYWRzLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlciwgcmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0cywge3NlcnZlcjogdGFyZ2V0U2VydmVyLCBzdGFydFBvcnQ6IHN0YXJ0U2lnbmFsfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgam9ic0ZpbmlzaGVkID0gMDtcbiAgICAgICAgICAgIG5zLnByaW50KGBtYWtpbmcgc3VyZSBhbGwgc2NyaXB0cyBjYW4gZ2V0IHN0YXJ0IHNpZ25hbC4uYCk7XG4gICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxMDAwKTtcbiAgICAgICAgICAgIG5zLnByaW50KGBzdGFydGluZyBhbGwgc2NyaXB0cy5gKTtcbiAgICAgICAgICAgIHN0YXJ0LndyaXRlKFwiR09cIik7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgIGlmICghcmV0dXJuUG9ydC5lbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblBvcnQucmVhZCgpO1xuICAgICAgICAgICAgICAgICAgICBqb2JzRmluaXNoZWQrKztcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYGpvYiAke2pvYnNGaW5pc2hlZH0vJHtqb2JzRG9uZX0gZmluaXNoZWRgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoam9ic0ZpbmlzaGVkID09IGpvYnNEb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGB0ZWxsaW5nIHJhbW5ldCB0aGUgam9icyBhcmUgZmluaXNoZWQgKCR7am9ic0ZpbmlzaGVkfSBqb2JzKWApXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgam9iIG9mIGpvYnNBc3NpZ25lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihqb2IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobnMuZ2V0U2VydmVyU2VjdXJpdHlMZXZlbCh0YXJnZXRTZXJ2ZXIpID49IG5zLmdldFNlcnZlck1pblNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSAqIDEuNSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGlmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSh0YXJnZXRTZXJ2ZXIpIDw9IG5zLmdldFNlcnZlck1heE1vbmV5KHRhcmdldFNlcnZlcikgKiAwLjMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdyb3cobnM6IG5zLk5TLCB0aHJlYWRzOiBudW1iZXIsIGRlcGxveW1lbnRTZXJ2ZXI6IHN0cmluZywgcmV0dXJuRGF0YTogbnVtYmVyW10sIGRhdGE6IFdvcm1EYXRhKSB7XG4gICAgZGVwbG95U2NyaXB0KG5zLCB0aHJlYWRzLCBcIi9pbmZlY3Qvd29ybXMvZ3Jvdy5qc1wiLCBkZXBsb3ltZW50U2VydmVyLCBKU09OLnN0cmluZ2lmeShyZXR1cm5EYXRhKSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5mdW5jdGlvbiB3ZWFrZW4obnM6IG5zLk5TLCB0aHJlYWRzOiBudW1iZXIsIGRlcGxveW1lbnRTZXJ2ZXI6IHN0cmluZywgcmV0dXJuRGF0YTogbnVtYmVyW10sIGRhdGE6IFdvcm1EYXRhKSB7XG4gICAgZGVwbG95U2NyaXB0KG5zLCB0aHJlYWRzLCBcIi9pbmZlY3Qvd29ybXMvd2Vha2VuLmpzXCIsIGRlcGxveW1lbnRTZXJ2ZXIsIEpTT04uc3RyaW5naWZ5KHJldHVybkRhdGEpLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbmZ1bmN0aW9uIGhhY2sobnM6IG5zLk5TLCB0aHJlYWRzOiBudW1iZXIsIGRlcGxveW1lbnRTZXJ2ZXI6IHN0cmluZywgcmV0dXJuRGF0YTogbnVtYmVyW10sIGRhdGE6IFdvcm1EYXRhKSB7XG4gICAgZGVwbG95U2NyaXB0KG5zLCB0aHJlYWRzLCBcIi9pbmZlY3Qvd29ybXMvaGFjay5qc1wiLCBkZXBsb3ltZW50U2VydmVyLCBKU09OLnN0cmluZ2lmeShyZXR1cm5EYXRhKSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5mdW5jdGlvbiBkZXBsb3lTY3JpcHQobnM6IG5zLk5TLCB0aHJlYWRzOiBudW1iZXIsIHNjcmlwdDogc3RyaW5nLCBzZXJ2ZXI6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICBucy5leGVjKHNjcmlwdCwgc2VydmVyLCB7dGhyZWFkcywgdGVtcG9yYXJ5OiB0cnVlfSwgLi4uYXJncyk7XG59XG5cbmZ1bmN0aW9uIGNvcHlTY3JpcHRzKG5zOiBucy5OUywgc2VydmVyOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgICBucy5zY3AoW1wiL2luZmVjdC93b3Jtcy9ncm93LmpzXCIsIFwiL2luZmVjdC93b3Jtcy9oYWNrLmpzXCIsIFwiL2luZmVjdC93b3Jtcy93ZWFrZW4uanNcIiwgXCIvZ2VuZXJhbC9tdWx0aXBvcnQuanNcIl0sIHNlcnZlciwgXCJob21lXCIpXG4gICAgfVxuICAgIGNhdGNoIHt9XG59Il19
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
    const returnPorts = await portComms.assignFirstAvailable(20);
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
                    ns.print(`ram used: ${ramUsed}/${ramnetDedicated}`);
                    if (ramUsed >= ramnetDedicated || threads == 0) {
                        ramUsed -= ramUsage;
                        break;
                    }
                    const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                    jobsAssigned.push(realJob.jobAssigned);
                    copyScripts(ns, realJob.jobAssigned.server);
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
                    let threads = Math.floor(serverRam / ns.getScriptRam(weakenS, "home"));
                    let ramUsage = ns.getScriptRam(weakenS, "home") * threads;
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
                    ns.print(`ram used: ${ramUsed}/${ramnetDedicated}`);
                    if (ramUsed >= ramnetDedicated || threads == 0) {
                        ramUsed -= ramUsage;
                        break;
                    }
                    const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                    jobsAssigned.push(realJob.jobAssigned);
                    copyScripts(ns, realJob.jobAssigned.server);
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
                let threads = Math.floor(serverRam / ns.getScriptRam(hackS, "home"));
                let ramUsage = ns.getScriptRam(hackS, "home") * threads;
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
                ns.print(`ram used: ${ramUsed}/${ramnetDedicated}`);
                if (ramUsed >= ramnetDedicated || threads == 0) {
                    ramUsed -= ramUsage;
                    break;
                }
                const realJob = await ramnet.assignJob({ ram: ramUsage, server: "" });
                jobsAssigned.push(realJob.jobAssigned);
                copyScripts(ns, realJob.jobAssigned.server);
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
    ns.exec(script, server, threads, ...args);
}
function copyScripts(ns, server) {
    ns.scp(["/infect/worms/grow.js", "/infect/worms/hack.js", "/infect/worms/weaken.js", "/general/multiport.js"], server, "home");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmZlY3QvY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxzQ0FBc0MsQ0FBQztBQUNoRSxPQUFPLFdBQVcsTUFBTSwrQkFBK0IsQ0FBQztBQUd4RCxPQUFPLFNBQVMsTUFBTSxvQkFBb0IsQ0FBQztBQUUzQyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFTO0lBQ2hDLHNCQUFzQjtJQUN0QixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5QixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFXLENBQUM7SUFDMUMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQVcsQ0FBQztJQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuQyxFQUFFLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDdkMsTUFBTSxTQUFTLEdBQUcsTUFBTSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDN0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDbEQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksU0FBUyxlQUFlLENBQUMsQ0FBQTtJQUM5QyxNQUFNLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJ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QUFlLEVBQUUsZ0JBQXdCLEVBQUUsVUFBb0IsRUFBRSxJQUFjO0lBQ3RHLFlBQVksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdILENBQUM7QUFFRCxTQUFTLElBQUksQ0FBQyxFQUFTLEVBQUUsT0FBZSxFQUFFLGdCQUF3QixFQUFFLFVBQW9CLEVBQUUsSUFBYztJQUNwRyxZQUFZLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzSCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsRUFBUyxFQUFFLE9BQWUsRUFBRSxNQUFjLEVBQUUsTUFBYyxFQUFFLEdBQUcsSUFBVztJQUM1RixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLEVBQVMsRUFBRSxNQUFjO0lBQzFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSx1QkFBdUIsRUFBRSx5QkFBeUIsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUNsSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gXCJAbnNcIjtcbmltcG9ydCBDb21tdW5pY2F0b3IgZnJvbSBcIi9zZXJ2aWNlLWNvbW11bmljYXRvcnMvcG9ydC1yZWdpc3RyeVwiO1xuaW1wb3J0IFJhbW5ldENvbW1zIGZyb20gXCIvc2VydmljZS1jb21tdW5pY2F0b3JzL3JhbW5ldFwiO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSBcIi9nZW5lcmFsL3JhbW5ldFwiO1xuaW1wb3J0IHsgV29ybURhdGEgfSBmcm9tIFwiLi93b3Jtcy90eXBlc1wiO1xuaW1wb3J0IE11bHRpcG9ydCBmcm9tIFwiL2dlbmVyYWwvbXVsdGlwb3J0XCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKG5zOiBucy5OUykge1xuICAgIC8vbnMuZGlzYWJsZUxvZyhcIkFMTFwiKVxuICAgIG5zLmRpc2FibGVMb2coXCJzbGVlcFwiKTtcbiAgICBucy5kaXNhYmxlTG9nKFwiZXhlY1wiKTtcbiAgICBucy5kaXNhYmxlTG9nKFwiZ2V0U2NyaXB0UmFtXCIpO1xuICAgIG5zLmRpc2FibGVMb2coXCJzY3BcIik7XG4gICAgY29uc3QgdGFyZ2V0U2VydmVyID0gbnMuYXJnc1swXSBhcyBzdHJpbmc7XG4gICAgY29uc3QgY29tbXNQb3J0ID0gbnMuYXJnc1sxXSBhcyBudW1iZXI7XG4gICAgY29uc3QgcmFtbmV0ID0gbmV3IFJhbW5ldENvbW1zKG5zKTtcbiAgICBucy5wcmludChgZ2V0dGluZyByYW1uZXQncyB0b3RhbCByYW1gKTtcbiAgICBjb25zdCByYW1uZXRSYW0gPSBhd2FpdCByYW1uZXQuZ2V0VG90YWxSYW0oKTtcbiAgICBucy5wcmludChgZ290IHJhbW5ldCByYW0sICR7cmFtbmV0UmFtLnRvdGFsUmFtfWApO1xuICAgIGNvbnN0IGNvbW1zID0gbnMuZ2V0UG9ydEhhbmRsZShjb21tc1BvcnQpO1xuICAgIG5zLnByaW50KGBhd2FpdGluZyAke2NvbW1zUG9ydH0gbmV4dFdyaXRlKCk7YClcbiAgICBhd2FpdCBjb21tcy5uZXh0V3JpdGUoKTtcbiAgICBjb25zdCBjb250cm9sbGVyQW1vdW50ID0gY29tbXMucGVlaygpIGFzIG51bWJlcjtcbiAgICBucy5wcmludChgZ290IGNvbnRyb2xsZXIgYW1vdW50LCAke2NvbnRyb2xsZXJBbW91bnR9YCk7XG4gICAgY29uc3QgcmFtbmV0RGVkaWNhdGVkID0gTWF0aC5mbG9vcihyYW1uZXRSYW0udG90YWxSYW0gLyBjb250cm9sbGVyQW1vdW50KTtcbiAgICBucy5wcmludChgcmFtIG9uIHJhbW5ldCBkZWRpY2F0ZWQgcGVyIGNvbnRyb2xsZXI6ICR7cmFtbmV0RGVkaWNhdGVkfWApO1xuICAgIGNvbnN0IHBvcnRDb21tcyA9IG5ldyBDb21tdW5pY2F0b3IobnMpO1xuICAgIGNvbnN0IHBvcnRzID0gKGF3YWl0IHBvcnRDb21tcy5hc3NpZ25GaXJzdEF2YWlsYWJsZSgxKSk7XG4gICAgY29uc3QgcmV0dXJuUG9ydHMgPSBhd2FpdCBwb3J0Q29tbXMuYXNzaWduRmlyc3RBdmFpbGFibGUoMjApO1xuICAgIGNvbnN0IHN0YXJ0U2lnbmFsID0gcG9ydHMuYXNzaWduZWRQb3J0c1swXTtcbiAgICBucy5hdEV4aXQoKCkgPT4ge1xuICAgICAgICBwb3J0Q29tbXMudW5hc3NpZ25Qb3J0cyhwb3J0cy5hc3NpZ25lZFBvcnRzKVxuICAgICAgICBwb3J0Q29tbXMudW5hc3NpZ25Qb3J0cyhyZXR1cm5Qb3J0cy5hc3NpZ25lZFBvcnRzKTtcbiAgICAgICAgbnMucm0oYC9sb2NrL2NvbnRyb2xsZXJzLyR7dGFyZ2V0U2VydmVyfS50eHRgLCBcImhvbWVcIik7XG4gICAgfSk7XG4gICAgY29uc3QgcmV0dXJuUG9ydCA9IG5ldyBNdWx0aXBvcnQobnMsIHtwb3J0czogcmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0c30pXG4gICAgYXdhaXQgbnMuc2xlZXAoNTApO1xuICAgIGNvbnN0IGdyb3dTID0gXCIvaW5mZWN0L3dvcm1zL2dyb3cuanNcIjtcbiAgICBjb25zdCBoYWNrUyA9IFwiL2luZmVjdC93b3Jtcy9oYWNrLmpzXCI7XG4gICAgY29uc3Qgd2Vha2VuUyA9IFwiL2luZmVjdC93b3Jtcy93ZWFrZW4uanNcIjtcbiAgICBsZXQgcmFtVXNlZCA9IDA7XG4gICAgY29uc3Qgam9icyA9IHtcbiAgICAgICAgZ3Jvdzoge1xuICAgICAgICAgICAgcmFtOiBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSxcbiAgICAgICAgICAgIHNlcnZlcjogXCJcIlxuICAgICAgICB9LFxuICAgICAgICB3ZWFrZW46IHtcbiAgICAgICAgICAgIHJhbTogbnMuZ2V0U2NyaXB0UmFtKHdlYWtlblMsIFwiaG9tZVwiKSxcbiAgICAgICAgICAgIHNlcnZlcjogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBoYWNrOiB7XG4gICAgICAgICAgICByYW06IG5zLmdldFNjcmlwdFJhbShoYWNrUywgXCJob21lXCIpLFxuICAgICAgICAgICAgc2VydmVyOiBcIlwiXG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3RhcnQgPSBucy5nZXRQb3J0SGFuZGxlKHN0YXJ0U2lnbmFsKTtcbiAgICBjb25zdCBtaW5Nb25leSA9IG5zLmdldFNlcnZlck1heE1vbmV5KHRhcmdldFNlcnZlcikgKiAwLjU7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgIGlmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSh0YXJnZXRTZXJ2ZXIpIDwgbWluTW9uZXkpIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9ic0Fzc2lnbmVkOiBKb2JbXSA9IFtdO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0pvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioam9icy5ncm93KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3Sm9iLmpvYkFzc2lnbmVkLnNlcnZlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKHNlcnZlcikgLSBucy5nZXRTZXJ2ZXJVc2VkUmFtKHNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aHJlYWRzID0gTWF0aC5mbG9vcihzZXJ2ZXJSYW0gLyBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbShncm93UywgXCJob21lXCIpICogdGhyZWFkcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgKyByYW1Vc2FnZSA+PSByYW1uZXREZWRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRocmVhZHMgPT0gMCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyZWFkcyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKGdyb3dTLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2IobmV3Sm9iLmpvYkFzc2lnbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHJhbSB1c2VkOiAke3JhbVVzZWR9LyR7cmFtbmV0RGVkaWNhdGVkfWApO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmFtVXNlZCA+PSByYW1uZXREZWRpY2F0ZWQgfHwgdGhyZWFkcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2VkIC09IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVhbEpvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioe3JhbTogcmFtVXNhZ2UsIHNlcnZlcjogXCJcIn0pO1xuICAgICAgICAgICAgICAgICAgICBqb2JzQXNzaWduZWQucHVzaChyZWFsSm9iLmpvYkFzc2lnbmVkKVxuICAgICAgICAgICAgICAgICAgICBjb3B5U2NyaXB0cyhucywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICBncm93KG5zLCB0aHJlYWRzLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlciwgcmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0cywge3NlcnZlcjogdGFyZ2V0U2VydmVyLCBzdGFydFBvcnQ6IHN0YXJ0U2lnbmFsfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBqb2JzRmluaXNoZWQgPSAwO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBtYWtpbmcgc3VyZSBhbGwgc2NyaXB0cyBjYW4gZ2V0IHN0YXJ0IHNpZ25hbC4uYCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMTAwMCk7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoYHN0YXJ0aW5nIGFsbCBzY3JpcHRzLmApO1xuICAgICAgICAgICAgICAgIHN0YXJ0LndyaXRlKFwiR09cIik7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmV0dXJuUG9ydC5lbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Qb3J0LnJlYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNGaW5pc2hlZCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChqb2JzRmluaXNoZWQgPT0gam9ic0Fzc2lnbmVkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGB0ZWxsaW5nIHJhbW5ldCB0aGUgam9icyBhcmUgZmluaXNoZWQgKCR7am9ic0ZpbmlzaGVkfSBqb2JzKWApXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGpvYiBvZiBqb2JzQXNzaWduZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKGpvYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUodGFyZ2V0U2VydmVyKSA+IG1pbk1vbmV5ICogMilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5zLmdldFNlcnZlclNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSA+IG5zLmdldFNlcnZlck1pblNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSAqIDEuNSkge1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JzQXNzaWduZWQ6IEpvYltdID0gW107XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Sm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYihqb2JzLmdyb3cpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXdKb2Iuam9iQXNzaWduZWQuc2VydmVyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXJSYW0gPSBucy5nZXRTZXJ2ZXJNYXhSYW0oc2VydmVyKSAtIG5zLmdldFNlcnZlclVzZWRSYW0oc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRocmVhZHMgPSBNYXRoLmZsb29yKHNlcnZlclJhbSAvIG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmFtVXNhZ2UgPSBucy5nZXRTY3JpcHRSYW0od2Vha2VuUywgXCJob21lXCIpICogdGhyZWFkcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgKyByYW1Vc2FnZSA+PSByYW1uZXREZWRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRocmVhZHMgPT0gMCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyZWFkcyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKGdyb3dTLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2IobmV3Sm9iLmpvYkFzc2lnbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHJhbSB1c2VkOiAke3JhbVVzZWR9LyR7cmFtbmV0RGVkaWNhdGVkfWApO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmFtVXNlZCA+PSByYW1uZXREZWRpY2F0ZWQgfHwgdGhyZWFkcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2VkIC09IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVhbEpvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioe3JhbTogcmFtVXNhZ2UsIHNlcnZlcjogXCJcIn0pO1xuICAgICAgICAgICAgICAgICAgICBqb2JzQXNzaWduZWQucHVzaChyZWFsSm9iLmpvYkFzc2lnbmVkKVxuICAgICAgICAgICAgICAgICAgICBjb3B5U2NyaXB0cyhucywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICB3ZWFrZW4obnMsIHRocmVhZHMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyLCByZXR1cm5Qb3J0cy5hc3NpZ25lZFBvcnRzLCB7c2VydmVyOiB0YXJnZXRTZXJ2ZXIsIHN0YXJ0UG9ydDogc3RhcnRTaWduYWx9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGpvYnNGaW5pc2hlZCA9IDA7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoYG1ha2luZyBzdXJlIGFsbCBzY3JpcHRzIGNhbiBnZXQgc3RhcnQgc2lnbmFsLi5gKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxMDAwKTtcbiAgICAgICAgICAgICAgICBucy5wcmludChgc3RhcnRpbmcgYWxsIHNjcmlwdHMuYCk7XG4gICAgICAgICAgICAgICAgc3RhcnQud3JpdGUoXCJHT1wiKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXR1cm5Qb3J0LmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblBvcnQucmVhZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgam9ic0ZpbmlzaGVkKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYnNGaW5pc2hlZCA9PSBqb2JzQXNzaWduZWQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHRlbGxpbmcgcmFtbmV0IHRoZSBqb2JzIGFyZSBmaW5pc2hlZCAoJHtqb2JzRmluaXNoZWR9IGpvYnMpYClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgam9iIG9mIGpvYnNBc3NpZ25lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2Ioam9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChucy5nZXRTZXJ2ZXJTZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgPD0gbnMuZ2V0U2VydmVyTWluU2VjdXJpdHlMZXZlbCh0YXJnZXRTZXJ2ZXIpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICBjb25zdCBqb2JzQXNzaWduZWQ6IEpvYltdID0gW107XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0pvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioam9icy5ncm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXdKb2Iuam9iQXNzaWduZWQuc2VydmVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlclJhbSA9IG5zLmdldFNlcnZlck1heFJhbShzZXJ2ZXIpIC0gbnMuZ2V0U2VydmVyVXNlZFJhbShzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIGxldCB0aHJlYWRzID0gTWF0aC5mbG9vcihzZXJ2ZXJSYW0gLyBucy5nZXRTY3JpcHRSYW0oaGFja1MsIFwiaG9tZVwiKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKGhhY2tTLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhyZWFkcyA9PSAwKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocmVhZHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKGdyb3dTLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihuZXdKb2Iuam9iQXNzaWduZWQpO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGByYW0gdXNlZDogJHtyYW1Vc2VkfS8ke3JhbW5ldERlZGljYXRlZH1gKTtcbiAgICAgICAgICAgICAgICBpZiAocmFtVXNlZCA+PSByYW1uZXREZWRpY2F0ZWQgfHwgdGhyZWFkcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgLT0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZWFsSm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYih7cmFtOiByYW1Vc2FnZSwgc2VydmVyOiBcIlwifSk7XG4gICAgICAgICAgICAgICAgam9ic0Fzc2lnbmVkLnB1c2gocmVhbEpvYi5qb2JBc3NpZ25lZClcbiAgICAgICAgICAgICAgICBjb3B5U2NyaXB0cyhucywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIGhhY2sobnMsIHRocmVhZHMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyLCByZXR1cm5Qb3J0cy5hc3NpZ25lZFBvcnRzLCB7c2VydmVyOiB0YXJnZXRTZXJ2ZXIsIHN0YXJ0UG9ydDogc3RhcnRTaWduYWx9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBqb2JzRmluaXNoZWQgPSAwO1xuICAgICAgICAgICAgbnMucHJpbnQoYG1ha2luZyBzdXJlIGFsbCBzY3JpcHRzIGNhbiBnZXQgc3RhcnQgc2lnbmFsLi5gKTtcbiAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwMDApO1xuICAgICAgICAgICAgbnMucHJpbnQoYHN0YXJ0aW5nIGFsbCBzY3JpcHRzLmApO1xuICAgICAgICAgICAgc3RhcnQud3JpdGUoXCJHT1wiKTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXR1cm5Qb3J0LmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuUG9ydC5yZWFkKCk7XG4gICAgICAgICAgICAgICAgICAgIGpvYnNGaW5pc2hlZCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoam9ic0ZpbmlzaGVkID09IGpvYnNBc3NpZ25lZC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGB0ZWxsaW5nIHJhbW5ldCB0aGUgam9icyBhcmUgZmluaXNoZWQgKCR7am9ic0ZpbmlzaGVkfSBqb2JzKWApXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgam9iIG9mIGpvYnNBc3NpZ25lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihqb2IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChucy5nZXRTZXJ2ZXJTZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgPiBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgKiAxLjUpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpZiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUodGFyZ2V0U2VydmVyKSA8IG1pbk1vbmV5ICogMilcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ3JvdyhuczogbnMuTlMsIHRocmVhZHM6IG51bWJlciwgZGVwbG95bWVudFNlcnZlcjogc3RyaW5nLCByZXR1cm5EYXRhOiBudW1iZXJbXSwgZGF0YTogV29ybURhdGEpIHtcbiAgICBkZXBsb3lTY3JpcHQobnMsIHRocmVhZHMsIFwiL2luZmVjdC93b3Jtcy9ncm93LmpzXCIsIGRlcGxveW1lbnRTZXJ2ZXIsIEpTT04uc3RyaW5naWZ5KHJldHVybkRhdGEpLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbmZ1bmN0aW9uIHdlYWtlbihuczogbnMuTlMsIHRocmVhZHM6IG51bWJlciwgZGVwbG95bWVudFNlcnZlcjogc3RyaW5nLCByZXR1cm5EYXRhOiBudW1iZXJbXSwgZGF0YTogV29ybURhdGEpIHtcbiAgICBkZXBsb3lTY3JpcHQobnMsIHRocmVhZHMsIFwiL2luZmVjdC93b3Jtcy93ZWFrZW4uanNcIiwgZGVwbG95bWVudFNlcnZlciwgSlNPTi5zdHJpbmdpZnkocmV0dXJuRGF0YSksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gaGFjayhuczogbnMuTlMsIHRocmVhZHM6IG51bWJlciwgZGVwbG95bWVudFNlcnZlcjogc3RyaW5nLCByZXR1cm5EYXRhOiBudW1iZXJbXSwgZGF0YTogV29ybURhdGEpIHtcbiAgICBkZXBsb3lTY3JpcHQobnMsIHRocmVhZHMsIFwiL2luZmVjdC93b3Jtcy9oYWNrLmpzXCIsIGRlcGxveW1lbnRTZXJ2ZXIsIEpTT04uc3RyaW5naWZ5KHJldHVybkRhdGEpLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbmZ1bmN0aW9uIGRlcGxveVNjcmlwdChuczogbnMuTlMsIHRocmVhZHM6IG51bWJlciwgc2NyaXB0OiBzdHJpbmcsIHNlcnZlcjogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIG5zLmV4ZWMoc2NyaXB0LCBzZXJ2ZXIsIHRocmVhZHMsIC4uLmFyZ3MpO1xufVxuXG5mdW5jdGlvbiBjb3B5U2NyaXB0cyhuczogbnMuTlMsIHNlcnZlcjogc3RyaW5nKSB7XG4gICAgbnMuc2NwKFtcIi9pbmZlY3Qvd29ybXMvZ3Jvdy5qc1wiLCBcIi9pbmZlY3Qvd29ybXMvaGFjay5qc1wiLCBcIi9pbmZlY3Qvd29ybXMvd2Vha2VuLmpzXCIsIFwiL2dlbmVyYWwvbXVsdGlwb3J0LmpzXCJdLCBzZXJ2ZXIsIFwiaG9tZVwiKVxufSJdfQ==
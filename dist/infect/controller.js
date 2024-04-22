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
    const allowRunOnHome = ns.args[2];
    const ramnet = new RamnetComms(ns);
    const homeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
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
    const ramnetDedicated = Math.floor(Math.floor((ramnetRam.totalRam - (!allowRunOnHome ? homeRam : 0)) / controllerAmount) * 0.98);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmZlY3QvY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxzQ0FBc0MsQ0FBQztBQUNoRSxPQUFPLFdBQVcsTUFBTSwrQkFBK0IsQ0FBQztBQUd4RCxPQUFPLFNBQVMsTUFBTSxvQkFBb0IsQ0FBQztBQUUzQyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFTO0lBQ2hDLHNCQUFzQjtJQUN0QixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5QixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqQyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQVcsQ0FBQztJQUMxQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBVyxDQUFDO0lBQ3ZDLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFZLENBQUM7SUFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekUsRUFBRSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sU0FBUyxHQUFHLE1B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RUFBRSxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLEVBQVMsRUFBRSxNQUFjO0lBQzFDLElBQUk7UUFDQSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsdUJBQXVCLEVBQUUseUJBQXlCLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7S0FDakk7SUFDRCxNQUFNLEdBQUU7QUFDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gXCJAbnNcIjtcbmltcG9ydCBDb21tdW5pY2F0b3IgZnJvbSBcIi9zZXJ2aWNlLWNvbW11bmljYXRvcnMvcG9ydC1yZWdpc3RyeVwiO1xuaW1wb3J0IFJhbW5ldENvbW1zIGZyb20gXCIvc2VydmljZS1jb21tdW5pY2F0b3JzL3JhbW5ldFwiO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSBcIi9nZW5lcmFsL3JhbW5ldFwiO1xuaW1wb3J0IHsgV29ybURhdGEgfSBmcm9tIFwiLi93b3Jtcy90eXBlc1wiO1xuaW1wb3J0IE11bHRpcG9ydCBmcm9tIFwiL2dlbmVyYWwvbXVsdGlwb3J0XCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKG5zOiBucy5OUykge1xuICAgIC8vbnMuZGlzYWJsZUxvZyhcIkFMTFwiKVxuICAgIG5zLmRpc2FibGVMb2coXCJzbGVlcFwiKTtcbiAgICBucy5kaXNhYmxlTG9nKFwiZXhlY1wiKTtcbiAgICBucy5kaXNhYmxlTG9nKFwiZ2V0U2NyaXB0UmFtXCIpO1xuICAgIG5zLmRpc2FibGVMb2coXCJzY3BcIik7XG4gICAgbnMuZGlzYWJsZUxvZyhcImdldFNlcnZlck1heFJhbVwiKTtcbiAgICBucy5kaXNhYmxlTG9nKFwiZ2V0U2VydmVyVXNlZFJhbVwiKTtcbiAgICBjb25zdCB0YXJnZXRTZXJ2ZXIgPSBucy5hcmdzWzBdIGFzIHN0cmluZztcbiAgICBjb25zdCBjb21tc1BvcnQgPSBucy5hcmdzWzFdIGFzIG51bWJlcjtcbiAgICBjb25zdCBhbGxvd1J1bk9uSG9tZSA9IG5zLmFyZ3NbMl0gYXMgYm9vbGVhbjtcbiAgICBjb25zdCByYW1uZXQgPSBuZXcgUmFtbmV0Q29tbXMobnMpO1xuICAgIGNvbnN0IGhvbWVSYW0gPSBucy5nZXRTZXJ2ZXJNYXhSYW0oXCJob21lXCIpIC0gbnMuZ2V0U2VydmVyVXNlZFJhbShcImhvbWVcIik7XG4gICAgbnMucHJpbnQoYGdldHRpbmcgcmFtbmV0J3MgdG90YWwgcmFtYCk7XG4gICAgY29uc3QgcmFtbmV0UmFtID0gYXdhaXQgcmFtbmV0LmdldFRvdGFsUmFtKCk7XG4gICAgbnMucHJpbnQoYGdvdCByYW1uZXQgcmFtLCAke3JhbW5ldFJhbS50b3RhbFJhbX1gKTtcbiAgICBjb25zdCBjb21tcyA9IG5zLmdldFBvcnRIYW5kbGUoY29tbXNQb3J0KTtcbiAgICBsZXQgY29udHJvbGxlckFtb3VudDogbnVtYmVyIC8vPSBjb21tcy5wZWVrKCkgYXMgbnVtYmVyO1xuICAgIGlmICghbnMuZmlsZUV4aXN0cyhcImNvbnRyb2xsZXItZGF0YS9jb250cm9sbGVycy50eHRcIikpIHtcbiAgICAgICAgbnMucHJpbnQoYGF3YWl0aW5nICR7Y29tbXNQb3J0fSBuZXh0V3JpdGUoKTtgKVxuICAgICAgICBhd2FpdCBjb21tcy5uZXh0V3JpdGUoKTtcbiAgICAgICAgY29udHJvbGxlckFtb3VudCA9IGNvbW1zLnBlZWsoKSBhcyBudW1iZXI7XG4gICAgICAgIG5zLndyaXRlKFwiY29udHJvbGxlci1kYXRhL2NvbnRyb2xsZXJzLnR4dFwiLCBjb250cm9sbGVyQW1vdW50LnRvU3RyaW5nKCksIFwid1wiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnRyb2xsZXJBbW91bnQgPSBwYXJzZUludChucy5yZWFkKFwiY29udHJvbGxlci1kYXRhL2NvbnRyb2xsZXJzLnR4dFwiKSk7XG4gICAgfVxuICAgIG5zLnByaW50KGBnb3QgY29udHJvbGxlciBhbW91bnQsICR7Y29udHJvbGxlckFtb3VudH1gKTtcbiAgICBjb25zdCByYW1uZXREZWRpY2F0ZWQgPSBNYXRoLmZsb29yKE1hdGguZmxvb3IoKHJhbW5ldFJhbS50b3RhbFJhbSAtICghYWxsb3dSdW5PbkhvbWUgPyBob21lUmFtIDogMCkpIC8gY29udHJvbGxlckFtb3VudCkgKiAwLjk4KTtcbiAgICBucy5wcmludChgcmFtIG9uIHJhbW5ldCBkZWRpY2F0ZWQgcGVyIGNvbnRyb2xsZXI6ICR7cmFtbmV0RGVkaWNhdGVkfWApO1xuICAgIGNvbnN0IHBvcnRDb21tcyA9IG5ldyBDb21tdW5pY2F0b3IobnMpO1xuICAgIGNvbnN0IHBvcnRzID0gKGF3YWl0IHBvcnRDb21tcy5hc3NpZ25GaXJzdEF2YWlsYWJsZSgxKSk7XG4gICAgY29uc3QgcmV0dXJuUG9ydHMgPSBhd2FpdCBwb3J0Q29tbXMuYXNzaWduRmlyc3RBdmFpbGFibGUoNSk7XG4gICAgY29uc3Qgc3RhcnRTaWduYWwgPSBwb3J0cy5hc3NpZ25lZFBvcnRzWzBdO1xuICAgIG5zLmF0RXhpdCgoKSA9PiB7XG4gICAgICAgIHBvcnRDb21tcy51bmFzc2lnblBvcnRzKHBvcnRzLmFzc2lnbmVkUG9ydHMpXG4gICAgICAgIHBvcnRDb21tcy51bmFzc2lnblBvcnRzKHJldHVyblBvcnRzLmFzc2lnbmVkUG9ydHMpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJldHVyblBvcnQgPSBuZXcgTXVsdGlwb3J0KG5zLCB7cG9ydHM6IHJldHVyblBvcnRzLmFzc2lnbmVkUG9ydHN9KVxuICAgIGF3YWl0IG5zLnNsZWVwKDUwKTtcbiAgICBjb25zdCBncm93UyA9IFwiL2luZmVjdC93b3Jtcy9ncm93LmpzXCI7XG4gICAgY29uc3QgaGFja1MgPSBcIi9pbmZlY3Qvd29ybXMvaGFjay5qc1wiO1xuICAgIGNvbnN0IHdlYWtlblMgPSBcIi9pbmZlY3Qvd29ybXMvd2Vha2VuLmpzXCI7XG4gICAgY29uc3Qgam9icyA9IHtcbiAgICAgICAgZ3Jvdzoge1xuICAgICAgICAgICAgcmFtOiBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSxcbiAgICAgICAgICAgIHNlcnZlcjogXCJcIlxuICAgICAgICB9LFxuICAgICAgICB3ZWFrZW46IHtcbiAgICAgICAgICAgIHJhbTogbnMuZ2V0U2NyaXB0UmFtKHdlYWtlblMsIFwiaG9tZVwiKSxcbiAgICAgICAgICAgIHNlcnZlcjogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBoYWNrOiB7XG4gICAgICAgICAgICByYW06IG5zLmdldFNjcmlwdFJhbShoYWNrUywgXCJob21lXCIpLFxuICAgICAgICAgICAgc2VydmVyOiBcIlwiXG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3RhcnQgPSBucy5nZXRQb3J0SGFuZGxlKHN0YXJ0U2lnbmFsKTtcbiAgICBjb25zdCBtaW5Nb25leSA9IG5zLmdldFNlcnZlck1heE1vbmV5KHRhcmdldFNlcnZlcikgKiAwLjU7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgIGlmIChucy5nZXRTZXJ2ZXJTZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgPj0gbnMuZ2V0U2VydmVyTWluU2VjdXJpdHlMZXZlbCh0YXJnZXRTZXJ2ZXIpICogMS4wNSkge1xuICAgICAgICAgICAgbGV0IHJhbVVzZWQgPSAwO1xuICAgICAgICAgICAgbnMucHJpbnQoYHdlYWtlbmluZyBzZXJ2ZXIgJHt0YXJnZXRTZXJ2ZXJ9YCk7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvYnNBc3NpZ25lZDogSm9iW10gPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgam9ic0RvbmUgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0pvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioam9icy5ncm93KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3Sm9iLmpvYkFzc2lnbmVkLnNlcnZlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcnZlciAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKHNlcnZlcikgLSBucy5nZXRTZXJ2ZXJVc2VkUmFtKHNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGhyZWFkcyA9IE1hdGguZmxvb3Ioc2VydmVyUmFtIC8gbnMuZ2V0U2NyaXB0UmFtKHdlYWtlblMsIFwiaG9tZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmFtVXNhZ2UgPSBucy5nZXRTY3JpcHRSYW0od2Vha2VuUywgXCJob21lXCIpICogdGhyZWFkcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHJhbVVzZWQgKyByYW1Vc2FnZSA+PSByYW1uZXREZWRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRocmVhZHMgPT0gMCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocmVhZHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNhZ2UgPSBucy5nZXRTY3JpcHRSYW0od2Vha2VuUywgXCJob21lXCIpICogdGhyZWFkcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2VkICs9IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihuZXdKb2Iuam9iQXNzaWduZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHJhbSB1c2VkOiAke3JhbVVzZWR9LyR7cmFtbmV0RGVkaWNhdGVkfSB3LyAke3RocmVhZHN9IHRocmVhZHNgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkID49IHJhbW5ldERlZGljYXRlZCB8fCB0aHJlYWRzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2VkIC09IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVhbEpvYiA9IGF3YWl0IHJhbW5ldC5hc3NpZ25Kb2Ioe3JhbTogcmFtVXNhZ2UsIHNlcnZlcjogXCJcIn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9ic0RvbmUgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JzQXNzaWduZWQucHVzaChyZWFsSm9iLmpvYkFzc2lnbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlTY3JpcHRzKG5zLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2Vha2VuKG5zLCB0aHJlYWRzLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlciwgcmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0cywge3NlcnZlcjogdGFyZ2V0U2VydmVyLCBzdGFydFBvcnQ6IHN0YXJ0U2lnbmFsfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGpvYnNGaW5pc2hlZCA9IDA7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoYG1ha2luZyBzdXJlIGFsbCBzY3JpcHRzIGNhbiBnZXQgc3RhcnQgc2lnbmFsLi5gKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxMDAwKTtcbiAgICAgICAgICAgICAgICBucy5wcmludChgc3RhcnRpbmcgYWxsIHNjcmlwdHMuYCk7XG4gICAgICAgICAgICAgICAgc3RhcnQud3JpdGUoXCJHT1wiKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXR1cm5Qb3J0LmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblBvcnQucmVhZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgam9ic0ZpbmlzaGVkKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgam9iICR7am9ic0ZpbmlzaGVkfS8ke2pvYnNEb25lfSBmaW5pc2hlZGApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYnNGaW5pc2hlZCA9PSBqb2JzRG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHRlbGxpbmcgcmFtbmV0IHRoZSBqb2JzIGFyZSBmaW5pc2hlZCAoJHtqb2JzRmluaXNoZWR9IGpvYnMpYClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgam9iIG9mIGpvYnNBc3NpZ25lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2Ioam9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5zLmdldFNlcnZlclNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSA8PSBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSh0YXJnZXRTZXJ2ZXIpIDwgbWluTW9uZXkpIHtcbiAgICAgICAgICAgIGxldCByYW1Vc2VkID0gMDtcbiAgICAgICAgICAgIG5zLnByaW50KGBncm93aW5nIG1vbmV5IGF2YWlsYWJsZSBvbiBzZXJ2ZXIgJHt0YXJnZXRTZXJ2ZXJ9YCk7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvYnNBc3NpZ25lZDogSm9iW10gPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgam9ic0RvbmUgPSAwO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBhc3NpZ25pbmcgZ3JvdyBqb2JzIGZvciBzZXJ2ZXIgJHt0YXJnZXRTZXJ2ZXJ9YCk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Sm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYihqb2JzLmdyb3cpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXdKb2Iuam9iQXNzaWduZWQuc2VydmVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VydmVyICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXJSYW0gPSBucy5nZXRTZXJ2ZXJNYXhSYW0oc2VydmVyKSAtIG5zLmdldFNlcnZlclVzZWRSYW0oc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aHJlYWRzID0gTWF0aC5mbG9vcihzZXJ2ZXJSYW0gLyBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmFtVXNhZ2UgPSBucy5nZXRTY3JpcHRSYW0oZ3Jvd1MsIFwiaG9tZVwiKSAqIHRocmVhZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFtVXNlZCArIHJhbVVzYWdlID49IHJhbW5ldERlZGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aHJlYWRzID09IDApIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJlYWRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzYWdlID0gbnMuZ2V0U2NyaXB0UmFtKGdyb3dTLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKG5ld0pvYi5qb2JBc3NpZ25lZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgcmFtIHVzZWQ6ICR7cmFtVXNlZH0vJHtyYW1uZXREZWRpY2F0ZWR9IHcvICR7dGhyZWFkc30gdGhyZWFkc2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgPj0gcmFtbmV0RGVkaWNhdGVkIHx8IHRocmVhZHMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgLT0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFsSm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYih7cmFtOiByYW1Vc2FnZSwgc2VydmVyOiBcIlwifSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JzRG9uZSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNBc3NpZ25lZC5wdXNoKHJlYWxKb2Iuam9iQXNzaWduZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29weVNjcmlwdHMobnMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm93KG5zLCB0aHJlYWRzLCByZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlciwgcmV0dXJuUG9ydHMuYXNzaWduZWRQb3J0cywge3NlcnZlcjogdGFyZ2V0U2VydmVyLCBzdGFydFBvcnQ6IHN0YXJ0U2lnbmFsfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGpvYnNGaW5pc2hlZCA9IDA7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoYG1ha2luZyBzdXJlIGFsbCBzY3JpcHRzIGNhbiBnZXQgc3RhcnQgc2lnbmFsLi5gKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxMDAwKTtcbiAgICAgICAgICAgICAgICBucy5wcmludChgc3RhcnRpbmcgYWxsIHNjcmlwdHMuYCk7XG4gICAgICAgICAgICAgICAgc3RhcnQud3JpdGUoXCJHT1wiKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXR1cm5Qb3J0LmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblBvcnQucmVhZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgam9ic0ZpbmlzaGVkKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgam9iICR7am9ic0ZpbmlzaGVkfS8ke2pvYnNEb25lfSBmaW5pc2hlZGApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYnNGaW5pc2hlZCA9PSBqb2JzRG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnMucHJpbnQoYHRlbGxpbmcgcmFtbmV0IHRoZSBqb2JzIGFyZSBmaW5pc2hlZCAoJHtqb2JzRmluaXNoZWR9IGpvYnMpYClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgam9iIG9mIGpvYnNBc3NpZ25lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2Ioam9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKHRhcmdldFNlcnZlcikgPj0gbnMuZ2V0U2VydmVyTWF4TW9uZXkodGFyZ2V0U2VydmVyKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5zLmdldFNlcnZlclNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSA+PSBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgKiAxLjA1KSB7XG4gICAgICAgICAgICBsZXQgcmFtVXNlZCA9IDA7XG4gICAgICAgICAgICBucy5wcmludChgd2Vha2VuaW5nIHNlcnZlciAke3RhcmdldFNlcnZlcn1gKTtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9ic0Fzc2lnbmVkOiBKb2JbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBqb2JzRG9uZSA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Sm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYihqb2JzLmdyb3cpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXdKb2Iuam9iQXNzaWduZWQuc2VydmVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VydmVyICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXJSYW0gPSBucy5nZXRTZXJ2ZXJNYXhSYW0oc2VydmVyKSAtIG5zLmdldFNlcnZlclVzZWRSYW0oc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aHJlYWRzID0gTWF0aC5mbG9vcihzZXJ2ZXJSYW0gLyBucy5nZXRTY3JpcHRSYW0od2Vha2VuUywgXCJob21lXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgKyByYW1Vc2FnZSA+PSByYW1uZXREZWRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAocmFtVXNlZCArIHJhbVVzYWdlID49IHJhbW5ldERlZGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhyZWFkcyA9PSAwKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyZWFkcyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbSh3ZWFrZW5TLCBcImhvbWVcIikgKiB0aHJlYWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgKz0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKG5ld0pvYi5qb2JBc3NpZ25lZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgcmFtIHVzZWQ6ICR7cmFtVXNlZH0vJHtyYW1uZXREZWRpY2F0ZWR9IHcvICR7dGhyZWFkc30gdGhyZWFkc2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbVVzZWQgPj0gcmFtbmV0RGVkaWNhdGVkIHx8IHRocmVhZHMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgLT0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFsSm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYih7cmFtOiByYW1Vc2FnZSwgc2VydmVyOiBcIlwifSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JzRG9uZSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNBc3NpZ25lZC5wdXNoKHJlYWxKb2Iuam9iQXNzaWduZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29weVNjcmlwdHMobnMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWFrZW4obnMsIHRocmVhZHMsIHJlYWxKb2Iuam9iQXNzaWduZWQuc2VydmVyLCByZXR1cm5Qb3J0cy5hc3NpZ25lZFBvcnRzLCB7c2VydmVyOiB0YXJnZXRTZXJ2ZXIsIHN0YXJ0UG9ydDogc3RhcnRTaWduYWx9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgam9ic0ZpbmlzaGVkID0gMDtcbiAgICAgICAgICAgICAgICBucy5wcmludChgbWFraW5nIHN1cmUgYWxsIHNjcmlwdHMgY2FuIGdldCBzdGFydCBzaWduYWwuLmApO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwMDApO1xuICAgICAgICAgICAgICAgIG5zLnByaW50KGBzdGFydGluZyBhbGwgc2NyaXB0cy5gKTtcbiAgICAgICAgICAgICAgICBzdGFydC53cml0ZShcIkdPXCIpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJldHVyblBvcnQuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUG9ydC5yZWFkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JzRmluaXNoZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGBqb2IgJHtqb2JzRmluaXNoZWR9LyR7am9ic0RvbmV9IGZpbmlzaGVkYClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoam9ic0ZpbmlzaGVkID09IGpvYnNEb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgdGVsbGluZyByYW1uZXQgdGhlIGpvYnMgYXJlIGZpbmlzaGVkICgke2pvYnNGaW5pc2hlZH0gam9icylgKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBqb2Igb2Ygam9ic0Fzc2lnbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmFtbmV0LmZpbmlzaEpvYihqb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmFtVXNlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobnMuZ2V0U2VydmVyU2VjdXJpdHlMZXZlbCh0YXJnZXRTZXJ2ZXIpIDw9IG5zLmdldFNlcnZlck1pblNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbnMucHJpbnQoYGhhY2tpbmcgc2VydmVyICR7dGFyZ2V0U2VydmVyfWApO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgbGV0IHJhbVVzZWQgPSAwO1xuICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICBjb25zdCBqb2JzQXNzaWduZWQ6IEpvYltdID0gW107XG4gICAgICAgICAgICBsZXQgam9ic0RvbmUgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdKb2IgPSBhd2FpdCByYW1uZXQuYXNzaWduSm9iKGpvYnMuZ3Jvdyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3Sm9iLmpvYkFzc2lnbmVkLnNlcnZlcjtcbiAgICAgICAgICAgICAgICBpZiAoc2VydmVyICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlclJhbSA9IG5zLmdldFNlcnZlck1heFJhbShzZXJ2ZXIpIC0gbnMuZ2V0U2VydmVyVXNlZFJhbShzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGhyZWFkcyA9IE1hdGguZmxvb3Ioc2VydmVyUmFtIC8gbnMuZ2V0U2NyaXB0UmFtKGhhY2tTLCBcImhvbWVcIikpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmFtVXNhZ2UgPSBucy5nZXRTY3JpcHRSYW0oaGFja1MsIFwiaG9tZVwiKSAqIHRocmVhZHM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkICsgcmFtVXNhZ2UgPj0gcmFtbmV0RGVkaWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAocmFtVXNlZCArIHJhbVVzYWdlID49IHJhbW5ldERlZGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aHJlYWRzIDw9IDApIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocmVhZHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW1Vc2FnZSA9IG5zLmdldFNjcmlwdFJhbShoYWNrUywgXCJob21lXCIpICogdGhyZWFkcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByYW1Vc2VkICs9IHJhbVVzYWdlO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCByYW1uZXQuZmluaXNoSm9iKG5ld0pvYi5qb2JBc3NpZ25lZCk7XG4gICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGByYW0gdXNlZDogJHtyYW1Vc2VkfS8ke3JhbW5ldERlZGljYXRlZH0gdy8gJHt0aHJlYWRzfSB0aHJlYWRzYCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW1Vc2VkID49IHJhbW5ldERlZGljYXRlZCB8fCB0aHJlYWRzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbVVzZWQgLT0gcmFtVXNhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFsSm9iID0gYXdhaXQgcmFtbmV0LmFzc2lnbkpvYih7cmFtOiByYW1Vc2FnZSwgc2VydmVyOiBcIlwifSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWFsSm9iLmpvYkFzc2lnbmVkLnNlcnZlciAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgam9ic0RvbmUgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpvYnNBc3NpZ25lZC5wdXNoKHJlYWxKb2Iuam9iQXNzaWduZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5U2NyaXB0cyhucywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFjayhucywgdGhyZWFkcywgcmVhbEpvYi5qb2JBc3NpZ25lZC5zZXJ2ZXIsIHJldHVyblBvcnRzLmFzc2lnbmVkUG9ydHMsIHtzZXJ2ZXI6IHRhcmdldFNlcnZlciwgc3RhcnRQb3J0OiBzdGFydFNpZ25hbH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGpvYnNGaW5pc2hlZCA9IDA7XG4gICAgICAgICAgICBucy5wcmludChgbWFraW5nIHN1cmUgYWxsIHNjcmlwdHMgY2FuIGdldCBzdGFydCBzaWduYWwuLmApO1xuICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoMTAwMCk7XG4gICAgICAgICAgICBucy5wcmludChgc3RhcnRpbmcgYWxsIHNjcmlwdHMuYCk7XG4gICAgICAgICAgICBzdGFydC53cml0ZShcIkdPXCIpO1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJldHVyblBvcnQuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5Qb3J0LnJlYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgam9ic0ZpbmlzaGVkKys7XG4gICAgICAgICAgICAgICAgICAgIG5zLnByaW50KGBqb2IgJHtqb2JzRmluaXNoZWR9LyR7am9ic0RvbmV9IGZpbmlzaGVkYClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGpvYnNGaW5pc2hlZCA9PSBqb2JzRG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBucy5wcmludChgdGVsbGluZyByYW1uZXQgdGhlIGpvYnMgYXJlIGZpbmlzaGVkICgke2pvYnNGaW5pc2hlZH0gam9icylgKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGpvYiBvZiBqb2JzQXNzaWduZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJhbW5ldC5maW5pc2hKb2Ioam9iKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByYW1Vc2VkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5zLmdldFNlcnZlclNlY3VyaXR5TGV2ZWwodGFyZ2V0U2VydmVyKSA+PSBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldFNlcnZlcikgKiAxLjUpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpZiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUodGFyZ2V0U2VydmVyKSA8PSBucy5nZXRTZXJ2ZXJNYXhNb25leSh0YXJnZXRTZXJ2ZXIpICogMC4zKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBncm93KG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBkZXBsb3ltZW50U2VydmVyOiBzdHJpbmcsIHJldHVybkRhdGE6IG51bWJlcltdLCBkYXRhOiBXb3JtRGF0YSkge1xuICAgIGRlcGxveVNjcmlwdChucywgdGhyZWFkcywgXCIvaW5mZWN0L3dvcm1zL2dyb3cuanNcIiwgZGVwbG95bWVudFNlcnZlciwgSlNPTi5zdHJpbmdpZnkocmV0dXJuRGF0YSksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gd2Vha2VuKG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBkZXBsb3ltZW50U2VydmVyOiBzdHJpbmcsIHJldHVybkRhdGE6IG51bWJlcltdLCBkYXRhOiBXb3JtRGF0YSkge1xuICAgIGRlcGxveVNjcmlwdChucywgdGhyZWFkcywgXCIvaW5mZWN0L3dvcm1zL3dlYWtlbi5qc1wiLCBkZXBsb3ltZW50U2VydmVyLCBKU09OLnN0cmluZ2lmeShyZXR1cm5EYXRhKSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5mdW5jdGlvbiBoYWNrKG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBkZXBsb3ltZW50U2VydmVyOiBzdHJpbmcsIHJldHVybkRhdGE6IG51bWJlcltdLCBkYXRhOiBXb3JtRGF0YSkge1xuICAgIGRlcGxveVNjcmlwdChucywgdGhyZWFkcywgXCIvaW5mZWN0L3dvcm1zL2hhY2suanNcIiwgZGVwbG95bWVudFNlcnZlciwgSlNPTi5zdHJpbmdpZnkocmV0dXJuRGF0YSksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cblxuZnVuY3Rpb24gZGVwbG95U2NyaXB0KG5zOiBucy5OUywgdGhyZWFkczogbnVtYmVyLCBzY3JpcHQ6IHN0cmluZywgc2VydmVyOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgbnMuZXhlYyhzY3JpcHQsIHNlcnZlciwge3RocmVhZHMsIHRlbXBvcmFyeTogdHJ1ZX0sIC4uLmFyZ3MpO1xufVxuXG5mdW5jdGlvbiBjb3B5U2NyaXB0cyhuczogbnMuTlMsIHNlcnZlcjogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbnMuc2NwKFtcIi9pbmZlY3Qvd29ybXMvZ3Jvdy5qc1wiLCBcIi9pbmZlY3Qvd29ybXMvaGFjay5qc1wiLCBcIi9pbmZlY3Qvd29ybXMvd2Vha2VuLmpzXCIsIFwiL2dlbmVyYWwvbXVsdGlwb3J0LmpzXCJdLCBzZXJ2ZXIsIFwiaG9tZVwiKVxuICAgIH1cbiAgICBjYXRjaCB7fVxufSJdfQ==
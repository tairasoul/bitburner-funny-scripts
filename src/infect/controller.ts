import ns from "@ns";
import Communicator from "/service-communicators/port-registry";
import RamnetComms from "/service-communicators/ramnet";
import { Job } from "/general/ramnet";
import { WormData } from "./worms/types";
import Multiport from "/general/multiport";

export async function main(ns: ns.NS) {
    //ns.disableLog("ALL")
    ns.disableLog("sleep");
    ns.disableLog("exec");
    ns.disableLog("getScriptRam");
    ns.disableLog("scp");
    const targetServer = ns.args[0] as string;
    const commsPort = ns.args[1] as number;
    const ramnet = new RamnetComms(ns);
    ns.print(`getting ramnet's total ram`);
    const ramnetRam = await ramnet.getTotalRam();
    ns.print(`got ramnet ram, ${ramnetRam.totalRam}`);
    const comms = ns.getPortHandle(commsPort);
    ns.print(`awaiting ${commsPort} nextWrite();`)
    await comms.nextWrite();
    const controllerAmount = comms.peek() as number;
    ns.print(`got controller amount, ${controllerAmount}`);
    const ramnetDedicated = Math.floor(ramnetRam.totalRam / controllerAmount);
    ns.print(`ram on ramnet dedicated per controller: ${ramnetDedicated}`);
    const portComms = new Communicator(ns);
    const ports = (await portComms.assignFirstAvailable(1));
    const returnPorts = await portComms.assignFirstAvailable(1000);
    const startSignal = ports.assignedPorts[0];
    ns.atExit(() => {
        portComms.unassignPorts(ports.assignedPorts)
        portComms.unassignPorts(returnPorts.assignedPorts);
        ns.rm(`/lock/controllers/${targetServer}.txt`, "home");
    });
    const returnPort = new Multiport(ns, {ports: returnPorts.assignedPorts})
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
    }
    const start = ns.getPortHandle(startSignal);
    const minMoney = ns.getServerMaxMoney(targetServer) * 0.5;
    while (true) {
        await ns.sleep(1);
        if (ns.getServerMoneyAvailable(targetServer) < minMoney) {
            while (true) {
                await ns.sleep(1);
                const jobsAssigned: Job[] = [];
                while (true) {
                    const newJob = await ramnet.assignJob(jobs.grow);
                    const server = newJob.jobAssigned.server;
                    const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                    let threads = Math.floor(serverRam / ns.getScriptRam(growS, "home"));
                    let ramUsage = ns.getScriptRam(growS, "home") * threads;
                    if (ramUsed + ramUsage >= ramnetDedicated) {
                        while (ramUsed + ramUsage >= ramnetDedicated) {
                            if (threads == 0) break;
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
                    const realJob = await ramnet.assignJob({ram: ramUsage, server: ""});
                    jobsAssigned.push(realJob.jobAssigned)
                    ensureScriptExistence(ns, realJob.jobAssigned.server);
                    grow(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, {server: targetServer, startPort: startSignal});
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
                        ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`)
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
                const jobsAssigned: Job[] = [];
                while (true) {
                    const newJob = await ramnet.assignJob(jobs.grow);
                    const server = newJob.jobAssigned.server;
                    const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                    let threads = Math.floor(serverRam / ns.getScriptRam(weakenS, "home"));
                    let ramUsage = ns.getScriptRam(weakenS, "home") * threads;
                    if (ramUsed + ramUsage >= ramnetDedicated) {
                        while (ramUsed + ramUsage >= ramnetDedicated) {
                            if (threads == 0) break;
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
                    const realJob = await ramnet.assignJob({ram: ramUsage, server: ""});
                    jobsAssigned.push(realJob.jobAssigned)
                    ensureScriptExistence(ns, realJob.jobAssigned.server);
                    weaken(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, {server: targetServer, startPort: startSignal});
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
                        ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`)
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
            const jobsAssigned: Job[] = [];
            while (true) {
                const newJob = await ramnet.assignJob(jobs.grow);
                const server = newJob.jobAssigned.server;
                const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                let threads = Math.floor(serverRam / ns.getScriptRam(hackS, "home"));
                let ramUsage = ns.getScriptRam(hackS, "home") * threads;
                if (ramUsed + ramUsage >= ramnetDedicated) {
                    while (ramUsed + ramUsage >= ramnetDedicated) {
                        if (threads == 0) break;
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
                const realJob = await ramnet.assignJob({ram: ramUsage, server: ""});
                jobsAssigned.push(realJob.jobAssigned)
                ensureScriptExistence(ns, realJob.jobAssigned.server);
                hack(ns, threads, realJob.jobAssigned.server, returnPorts.assignedPorts, {server: targetServer, startPort: startSignal});
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
                    ns.print(`telling ramnet the jobs are finished (${jobsFinished} jobs)`)
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

function grow(ns: ns.NS, threads: number, deploymentServer: string, returnData: number[], data: WormData) {
    deployScript(ns, threads, "/infect/worms/grow.js", deploymentServer, JSON.stringify(returnData), JSON.stringify(data));
}

function weaken(ns: ns.NS, threads: number, deploymentServer: string, returnData: number[], data: WormData) {
    deployScript(ns, threads, "/infect/worms/weaken.js", deploymentServer, JSON.stringify(returnData), JSON.stringify(data));
}

function hack(ns: ns.NS, threads: number, deploymentServer: string, returnData: number[], data: WormData) {
    deployScript(ns, threads, "/infect/worms/hack.js", deploymentServer, JSON.stringify(returnData), JSON.stringify(data));
}

function deployScript(ns: ns.NS, threads: number, script: string, server: string, ...args: any[]) {
    ns.exec(script, server, {threads, temporary: true}, ...args);
}

function ensureScriptExistence(ns: ns.NS, server: string) {
    if (!ns.fileExists("/infect/worms/grow.js", server))
        ns.scp("/infect/worms/grow.js", server, "home");
    if (!ns.fileExists("/infect/worms/hack.js", server))
        ns.scp("/infect/worms/hack.js", server, "home");
    if (!ns.fileExists("/infect/worms/weaken.js", server))
        ns.scp("/infect/worms/weaken.js", server, "home");
    if (!ns.fileExists("/general/multiport.js", server))
        ns.scp("/general/multiport.js", server, "home");
}
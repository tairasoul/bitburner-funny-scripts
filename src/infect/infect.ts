import { mapServers, gainAccess, ServerInfo } from "/infect/utils.js";
import ns from "@ns";
import Communicator from "/service-communicators/port-registry";

let pids = 0;

let minMoneyCap = 0;

export async function main(ns: ns.NS) {
    const flags = ns.flags([["runhome", false], ["moneyCap", 150000000], ["deployServer", "Controller-Central"]]);
    const allowRunOnHome = flags.runhome as boolean;
    const deployServer = flags.deployServer as string;
    minMoneyCap = flags.moneyCap as number;
    ns.rm("controller-data/controllers.txt", deployServer)
    pids = 0;
    const comms = new Communicator(ns);
    const mapped = await mapServers(ns);
    const infectedServers: Set<string> = new Set();
    const portsAssigned = await comms.assignFirstAvailable(1);
    const start = portsAssigned.assignedPorts[0];
    for (const server of mapped) {
        await infectServer(ns, server.name, infectedServers, start, deployServer, allowRunOnHome);
        await processServers(ns, server, infectedServers, start, deployServer, allowRunOnHome);
    }
    const elements = [];
    for (const value of infectedServers.values())
        elements.push(value);
    ns.toast(`hacked ${pids} servers!`, "info", 3000)
    ns.toast("completed processing of server list", "success", 2000);
    const portComms = ns.getPortHandle(start)
    await ns.sleep(2500);
    portComms.write(pids);
    await ns.sleep(20000);
    comms.unassignPorts([start]);
}

async function processServers(ns: ns.NS, map: ServerInfo, infectedSet: Set<string>, commsStart: number, deployServer: string, allowRunOnHome: boolean) {
    for (const mapped of map.sub_servers) {
        await infectServer(ns, mapped.name, infectedSet, commsStart, deployServer, allowRunOnHome);
        await processServers(ns, mapped, infectedSet, commsStart, deployServer, allowRunOnHome);
    }
}

async function infectServer(ns: ns.NS, server: string, infectedSet: Set<string>, commsStart: number, deployServer: string, allowRunOnHome: boolean) {
    const script = "/infect/controller.js";
    const canHack = ns.getPlayer().skills.hacking >= ns.getServerRequiredHackingLevel(server);
    if (canHack) {
        const result = await gainAccess(ns, server);
        if (result.nuke) {
            const maxMoney = ns.getServerMaxMoney(server)
            if (maxMoney >= minMoneyCap) {
                if (deployServer != "home") {
                    ns.scp([script, "/general/multiport.js", "/service-communicators/port-registry.js", "/general/remote-file.js", "/service-communicators/ramnet.js", "/general/logs.js"], "Controller-Central", "home")
                    ns.exec(script, deployServer, undefined, server, commsStart, allowRunOnHome);
                }
                else ns.run(script, undefined, server, commsStart, allowRunOnHome)
                pids += 1;
            }
            infectedSet.add(server);
        }
        else {
            ns.tprint(`could not gain access to ${server}`);
        }
    }
    else {
        ns.tprint(`cannot hack server ${server}, hacking skill ${ns.getPlayer().skills.hacking} is lower than required hacking skill ${ns.getServerRequiredHackingLevel(server)}!`);
    }
}
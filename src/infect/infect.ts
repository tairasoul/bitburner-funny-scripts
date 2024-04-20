import { mapServers, gainAccess, ServerInfo } from "/infect/utils.js";
import ns from "@ns";
import Communicator from "/service-communicators/port-registry";

let pids = 0;

export async function main(ns: ns.NS) {
    pids = 0;
    const comms = new Communicator(ns);
    const mapped = await mapServers(ns);
    const infectedServers: Set<string> = new Set();
    const portsAssigned = await comms.assignFirstAvailable(1);
    const start = portsAssigned.assignedPorts[0];
    for (const server of mapped) {
        await infectServer(ns, server.name, infectedServers, start);
        await processServers(ns, server, infectedServers, start);
    }
    const elements = [];
    for (const value of infectedServers.values())
        elements.push(value);
    ns.toast(`hacked ${pids} servers: ${elements.join(", ")}`, "info", 3000)
    ns.toast("completed processing of server list", "success", 2000);
    const portComms = ns.getPortHandle(start)
    await ns.sleep(1000);
    portComms.write(pids);
    await ns.sleep(20000);
    comms.unassignPorts([start]);
}

async function processServers(ns: ns.NS, map: ServerInfo, infectedSet: Set<string>, commsStart: number) {
    for (const mapped of map.sub_servers) {
        await infectServer(ns, mapped.name, infectedSet, commsStart);
        await processServers(ns, mapped, infectedSet, commsStart);
    }
}

async function infectServer(ns: ns.NS, server: string, infectedSet: Set<string>, commsStart: number) {
    const script = "/infect/controller.js";
    const canHack = ns.getPlayer().skills.hacking >= ns.getServerRequiredHackingLevel(server);
    if (canHack) {
        const result = await gainAccess(ns, server);
        if (result.nuke) {
            ns.scp([script, "/general/multiport.js", "/service-communicators/port-registry.js", "/general/remote-file.js", "/service-communicators/ramnet.js", "/general/logs.js"], "Controller-Central", "home")
            ns.exec(script, "Controller-Central", {temporary: true}, server, commsStart);
            pids += 1;
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
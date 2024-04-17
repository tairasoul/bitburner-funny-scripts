import { mapServers, gainAccess, ServerInfo } from "/infect/utils.js";
import ns from "@ns";

export async function main(ns: ns.NS) {
    const mapped = await mapServers(ns);
    const infectedServers: Set<string> = new Set();
    for (const server of mapped) {
        await infectServer(ns, server.name, infectedServers);
        await processServers(ns, server, infectedServers);
    }
    const elements = [];
    for (const value of infectedServers.values())
        elements.push(value);
    ns.toast(`hacked servers: ${elements.join(", ")}`, "info", 3000)
    ns.toast("completed processing of server list", "success", 2000);
}

async function processServers(ns: ns.NS, map: ServerInfo, infectedSet: Set<string>) {
    for (const mapped of map.sub_servers) {
        await infectServer(ns, mapped.name, infectedSet);
        await processServers(ns, mapped, infectedSet);
    }
}

async function infectServer(ns: ns.NS, server: string, infectedSet: Set<string>) {
    const script = "/infect/controller.js";
    const canHack = ns.getPlayer().skills.hacking >= ns.getServerRequiredHackingLevel(server);
    if (canHack) {
        const result = await gainAccess(ns, server);
        if (result.nuke) {
            if (!ns.fileExists(`/lock/controllers/${server}.txt`)) {
                ns.scp([script, "/port-registry/classes/multiport.js", "/port-registry/classes/communicator.js"], "Controller-Central")
                const pid = ns.exec(script, "Controller-Central", undefined, server);
                ns.write(`/lock/controllers/${server}.txt`, JSON.stringify({pid, server}));
            }
            infectedSet.add(server);
        }
        else {
            ns.tprint(`could not gain access to ${server}`);
        }
    }
    else {
        ns.tprint(`cannot hack server ${server}, level ${ns.getPlayer().skills.hacking} is lower than ${ns.getServerRequiredHackingLevel(server)}!`);
    }
}
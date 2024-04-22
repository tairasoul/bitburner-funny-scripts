import ns from "@ns";
import { ServerInfo, mapServers } from "./infect/utils";

function findServerPath(server: ServerInfo, targetName: string, currentPath: string[] = []): string[] | null {
    if (server.name === targetName) {
        return [...currentPath, server.name];
    }

    for (const subServer of server.sub_servers) {
        const path = findServerPath(subServer, targetName, [...currentPath, server.name]);
        if (path) {
            return path;
        }
    }

    return null;
}

export async function main(ns: ns.NS) {
    const server = ns.args[0] as string;
    const doc = eval("document")
    const terminal = doc.querySelector("#terminal-input") as HTMLInputElement;
    await ns.sleep(1000);
    const mapped = await mapServers(ns);
    for (const map of mapped) {
        const res = findServerPath(map, server)
        if (res) {
            let str = "";
            for (const path of res) {
                str += `connect ${path};`
            }
            terminal.value = str;
            break;
        }
    }
}
import ns from "@ns";
import { gainAccess, list_servers } from "/general/utils";

export async function main(ns: ns.NS) {
    const servers = list_servers(ns);
    for (const server of servers) {
        await gainAccess(ns, server);
    }
}
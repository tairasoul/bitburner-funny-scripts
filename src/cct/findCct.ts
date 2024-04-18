import { NS } from "@ns";
import { list_servers } from "/general/utils";

export function getCCT(ns: NS) {
    let servers = list_servers(ns);
    const boughtServers = ns.getPurchasedServers();
    servers = servers.filter(s => !boughtServers.includes(s));
    const hostname = servers.find(s => ns.ls(s).find(f => f.endsWith(".cct")))
    if (!hostname) {
        return null;
    }
    const cct = ns.ls(hostname).find(f => f.endsWith(".cct")) as string;

    return {
        hostname,
        cct
    }
}
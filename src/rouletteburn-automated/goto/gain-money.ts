import { NS } from "@ns";

export async function main(ns: NS) {
    const server = ns.args[0] as string;
    while (ns.getServerMoneyAvailable("home") < 200000) {
        await ns.hack(server);
        await ns.weaken(server);
        await ns.grow(server);
        await ns.weaken(server);
    }
}
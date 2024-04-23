import { NS } from "@ns";

export async function main(ns: NS) {
    const server = ns.args[0] as string;
    const port = ns.args[1] as number;
    const handle = ns.getPortHandle(port);
    while (ns.getServerMoneyAvailable("home") < 200000) {
        await ns.hack(server);
        await ns.weaken(server);
        await ns.grow(server);
        await ns.weaken(server);
    }
    handle.write('done');
}
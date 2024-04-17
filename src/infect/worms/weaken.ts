import ns from "@ns";

export async function main(ns: ns.NS) {
    const comms = ns.getPortHandle(ns.args[0] as number);
    const server = comms.read();
    await ns.weaken(server);
    comms.write("finished");
}
import ns from "@ns";

export async function main(ns: ns.NS) {
    const comms = ns.getPortHandle(ns.args[0] as number);
    const returnComms = ns.getPortHandle(ns.args[1] as number);
    const server = comms.peek();
    await ns.hack(server);
    returnComms.write("finished");
}
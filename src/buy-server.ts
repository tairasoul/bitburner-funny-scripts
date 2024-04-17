import ns from "@ns";

export async function main(ns: ns.NS) {
    const name = ns.args[0] as string;
    const size = ns.args[1] as number;
    ns.purchaseServer(name, size)
}
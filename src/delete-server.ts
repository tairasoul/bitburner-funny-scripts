import ns from "@ns";

export async function main(ns: ns.NS) {
    const name = ns.args[0] as string;
    ns.deleteServer(name);
}
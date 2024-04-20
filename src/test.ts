import ns from "@ns";

export async function main(ns: ns.NS) {
    const port = ns.getPortHandle(500);
    port.clear();
    port.write(10);
    ns.tprint(port.peek());
}
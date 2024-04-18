import ns from "@ns";

export async function main(ns: ns.NS) {
    const size = ns.args[0] as number;
    ns.tprint(ns.formatNumber(ns.getPurchasedServerCost(size)))
}
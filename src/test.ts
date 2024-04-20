import ns from "@ns";

export async function main(ns: ns.NS) {
    ns.tprint(ns.formatNumber(ns.getServerMaxMoney("foodnstuff")))
}
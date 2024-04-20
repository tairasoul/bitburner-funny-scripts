import ns from "@ns";

export async function main(ns: ns.NS) {
    const name = ns.args[0] as string;
    const money = ns.getServerMoneyAvailable("home");
    let size = 2;
    let guh = 2;
    while (ns.getPurchasedServerCost(size) < money) {
        guh++;
        if (ns.getPurchasedServerCost(2**(guh + 1)) > money)
            break;
        size = 2**guh;
    }
    ns.tprint(`bought server ${name} with size ${ns.formatRam(size)}`);
    ns.purchaseServer(name, size)
}
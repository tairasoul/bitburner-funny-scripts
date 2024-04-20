import ns from "@ns";

export async function main(ns: ns.NS) {
    ns.run("solve.js");
    ns.run("services/port-registry.js");
    ns.run("services/ramnet-service.js");
    ns.run("custom-stats.js");
}
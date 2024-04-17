import ns from "@ns";

export async function main(ns: ns.NS) {
    for (let i = 0; i < 100; i++) {
        ns.run("test.js");
    }
}
import ns from "@ns";

export async function main(ns: ns.NS) {
    const dir = ns.args[0] as string;
    const files = ns.ls(ns.getHostname(), dir);
    for (const file of files) {
        ns.tprint(`removing ${file}`)
        ns.rm(file);
    }
}
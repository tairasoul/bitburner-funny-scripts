import ns from "@ns";
import RamnetComms from "./service-communicators/ramnet";

export async function main(ns: ns.NS) {
    const comms = new RamnetComms(ns);
    ns.tprint(await comms.get("clone"));
}
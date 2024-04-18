import { NS } from "@ns";
import Lockfile from "./general/locks";

export async function main(ns: NS) {
    const lock = new Lockfile(ns);
    const pids = JSON.parse(await lock.getLockData("solvers")) as number[];
    for (const pid of pids) {
        ns.kill(pid);
    }
    lock.unlock("solvers");
}
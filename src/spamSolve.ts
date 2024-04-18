import { NS } from "@ns";
import Lockfile from "./general/locks";

export async function main(ns: NS) {
    const lock = new Lockfile(ns);
    const files = ns.ls("home", ".js");
    ns.scp(files, "CCT-Crack", "home");
    const pids = [ns.pid];
    for (let i = 0; i < 50; i++) {
        await ns.sleep(50)
        const pid = ns.exec("solve.js", "CCT-Crack");
        pids.push(pid);
    }
    await lock.lock("solvers", JSON.stringify(pids));
}
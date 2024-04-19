import { NS } from "@ns";
import { solveCCT } from "./cct/solver";
import Logs from "/general/logs";

export async function main(ns: NS) {
    const logger = new Logs(ns, "CCTSolver");
    while (true) {
        await ns.sleep(1);
        const result = await solveCCT(ns, logger);
        if (!result)
            await ns.sleep(5 * 1000)
    }
}
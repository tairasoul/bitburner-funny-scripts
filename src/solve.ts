import { NS } from "@ns";
import { solveCCT } from "./cct/solver";

export async function main(ns: NS) {
    while (true) {
        await ns.sleep(1);
        const result = await solveCCT(ns);
        if (!result)
            await ns.sleep(5 * 1000)
    }
}
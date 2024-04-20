import { NS } from "@ns";

export async function main(ns: NS) {
    const doc = eval("document");
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    while (true) {
        try {
            const headers = []
            const values = [];
            headers.push("Karma");
            values.push(ns.getPlayer().karma.toPrecision(5));
            headers.push("Share Power");
            values.push(ns.getSharePower().toPrecision(5))
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) {
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}
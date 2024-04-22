import { NS } from "@ns";
import { download } from "/rouletteburn-automated/download";
import { aevum } from "/rouletteburn-automated/go-to-aevum";
import { cheat } from "/rouletteburn-automated/start-cheating";

export async function main(ns: NS) {
    if (!ns.fileExists("rouletteburn.js"))
        await download(ns);
    const doc = eval("document") as Document;
    const divsWithRoleButton = doc.querySelectorAll('div[role="button"]');
    divsWithRoleButton.forEach(div => {
        if (Array.from(div.querySelectorAll('*')).some(element => element.textContent?.includes('City'))) {
            (div as HTMLElement).click();
        }
    });
    const gameWindow = doc.querySelector("#root > div.MuiBox-root > div.MuiBox-root") as HTMLDivElement;
    const city = gameWindow.querySelector(':nth-child(1)')?.textContent as string;
    if (city.trim() != "Aevum")
        await aevum(ns);
    await cheat(ns)
}
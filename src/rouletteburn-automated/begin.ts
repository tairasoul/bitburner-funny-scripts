import { NS } from "@ns";
import { download } from "/rouletteburn-automated/download";
import { aevum } from "/rouletteburn-automated/go-to-aevum";
import { cheat } from "/rouletteburn-automated/start-cheating";
import { exploit } from "/rouletteburn-automated/game/get-game";

export async function main(ns: NS) {
    if (!ns.fileExists("rouletteburn.js"))
        await download(ns);
    const game = await exploit();
    if (game.city != "Aevum")
        await aevum(ns);
    await cheat(ns)
}
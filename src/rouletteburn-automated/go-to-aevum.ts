import ns from "@ns";
import { gainAccess } from "/infect/utils";
import { exploit } from "/game/get-game";
import PortCommunicator from "/service-communicators/port-registry";

export async function aevum(ns: ns.NS) {
    const doc = eval("document") as Document;
    const comms = new PortCommunicator(ns);
    const game = await exploit();
    if (game.money < 200000) {
        const hacking = game.skills.hacking;
        const priority = ["omega-net", "phantasy", "silver-helix", "iron-gym", "zer0", "max-hardware", "CSEC", "harakiri-sushi", "joesguns", "sigma-cosmetics", "foodnstuff", "n00dles"];
        for (const server of priority) {
            const skillRequired = ns.getServer(server).requiredHackingSkill as number;
            if (hacking >= skillRequired) {
                const accessGained = await gainAccess(ns, server);
                if (accessGained.nuke) {
                    const port = await comms.assignFirstAvailable(1);
                    ns.toast(`money too low, hacking ${server} until we have enough money!`, "error", 3000);
                    const ram = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
                    const hackUsage = ns.getScriptRam("/rouletteburn-automated/goto/gain-money.js");
                    const threads = Math.floor(ram / hackUsage);
                    ns.run("/rouletteburn-automated/goto/gain-money.js", threads, server, port.assignedPorts[0]);
                    const handle = ns.getPortHandle(port.assignedPorts[0]);
                    await handle.nextWrite();
                    handle.clear();
                    await comms.unassignPorts(port.assignedPorts);
                    break;
                }
            }
        }
    }
    const buttons = doc.querySelectorAll("div.MuiButtonBase-root");
    buttons.forEach(div => {
        if (Array.from(div.querySelectorAll('*')).some(element => element.textContent?.includes('Travel'))) {
            (div as HTMLElement).click();
        }
    });
    const elems = doc.querySelectorAll('span');
    elems.forEach((elem) => {
        if (elem.textContent?.trim() == "A") {
            (elem as HTMLElement).click()
            return;
        }
    })

    const divs = doc.querySelectorAll("button.MuiButtonBase-root");
    divs.forEach(div => {
        if (Array.from(div.querySelectorAll('*')).some(element => element.textContent?.includes('Travel'))) {
            (div as HTMLElement).click();
        }
    })
}
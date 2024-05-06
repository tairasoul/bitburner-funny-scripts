import ns from "@ns";
import { exploit } from "/game/get-game";
import { clickText } from "./begin";

function extractNumberFromString(str: string) {
    const numericStr = str.replace(/\D/g, '');
    const number = parseInt(numericStr);
    return number;
}

function getGreenTile(table: HTMLTableElement) {
    const rows = table.querySelectorAll("tr");
    const cells: HTMLElement[] = [];
    
    rows.forEach(row => {
        const children = row.children;
        for (const child of children) {
            cells.push(child as HTMLElement);
        }
    });
    for (const cell of cells) {
        if (cell.style.backgroundColor == "limegreen")
            return cell;
    }
    return null;
}

function getTile(num: number, table: HTMLTableElement) {
    const rows = table.querySelectorAll('tr');

    for (const row of rows) {
        const cells = row.querySelectorAll('td');

        for (const cell of cells) {
            const buttons = cell.querySelectorAll('button');

            if (buttons.length > 0) {
                for (const button of buttons) {
                    if (button.textContent?.trim() === num.toString()) {
                        return button as HTMLElement;
                    }
                }
            } else if (cell.textContent?.trim() === num.toString()) {
                return cell as HTMLElement;
            }
        }
    }

    return null;
}

function clickBypassed(element: HTMLElement) {
    const propsName = Object.keys(element).find((v) => v.startsWith("__reactProps$")) as string;
    // @ts-ignore
    const click = element[propsName].onClick
    const event = {
        target: element,
        currentTarget: element,
        bubbles: true,
        cancelable: true,
        type: 'click',
        isTrusted: true
    };
    // @ts-ignore
    click(event);
}

export async function cheat(ns: ns.NS) {
    ns.disableLog("sleep");
    const doc = eval("document") as Document;
    const pid = ns.run("rouletteburn.js")
    await ns.sleep(1500);
    const tailWindows = doc.querySelectorAll("div.react-resizable")
    let targetElement: HTMLElement | undefined;
    tailWindows.forEach((w) => {
        const children = w.querySelectorAll(":scope > *");
        children.forEach((childElement) => {
            if (childElement.textContent?.trim().includes("rouletteburn.js")) {
                targetElement = w as HTMLElement;
                return;
            }
        });
    });

    clickText("City", 'div[role="button"]')

    await ns.sleep(1000);

    const casino = doc.querySelector('span[aria-label="Iker Molina Casino"]') as HTMLElement;

    casino.click();

    await ns.sleep(1000);

    const playRoulette = doc.querySelector("#root > div.MuiBox-root > div.MuiBox-root > div > button:nth-child(3)") as HTMLElement;

    playRoulette.click();

    await ns.sleep(1000);

    if (targetElement) {
        while (true) {
            const game = await exploit();
            if (game.getCasinoWinnings() > 10e9) {
                ns.kill(pid);

                clickText("Terminal", 'div[role="button"]')
                break;
            }
            await ns.sleep(1);
            const rouletteBurn = targetElement.querySelector("table") as HTMLTableElement;
            const rouletteWindow = doc.querySelector("#root > div.MuiBox-root > div.MuiBox-root") as HTMLDivElement;
            const roulette = rouletteWindow?.querySelector("table") as HTMLTableElement;
            if (getGreenTile(rouletteBurn) == null) {
                const burnTile = getTile(1, rouletteBurn);
                if (burnTile)
                    burnTile.click();
                const rouletteTile = getTile(1, roulette);
                if (rouletteTile)
                    clickBypassed(rouletteTile);
                while (!(rouletteWindow.querySelector(":nth-child(6)") as HTMLElement).textContent?.startsWith("playing"))
                    await ns.sleep(1)
                while (!(rouletteWindow.querySelector(":nth-child(6)") as HTMLElement).textContent?.startsWith("lost ") && !(rouletteWindow.querySelector(":nth-child(6)") as HTMLElement).textContent?.startsWith("won "))
                    await ns.sleep(1)
                const resultTile = rouletteWindow.querySelector(":nth-child(4)");
                if (resultTile) {
                    const tileNum = extractNumberFromString(resultTile.textContent as string);
                    const resultBurn = getTile(tileNum, rouletteBurn);
                    if (resultBurn)
                        resultBurn.click();
                }
            }
            else {
                const input = rouletteWindow.querySelector("div")?.querySelector("div")?.querySelector("input") as HTMLElement;
                const propsName = Object.keys(input).find((v) => v.startsWith("__reactProps$")) as string;
                // @ts-ignore
                const props = input[propsName]
                props.onChange({currentTarget: {value: 1e7}});
                const burnTile = getGreenTile(rouletteBurn) as HTMLElement;
                const tile = parseInt(burnTile.textContent as string);
                const rouletteTile = getTile(tile, roulette);
                burnTile.click();
                if (rouletteTile)
                    clickBypassed(rouletteTile);
                while (!(rouletteWindow.querySelector(":nth-child(6)") as HTMLElement).textContent?.startsWith("playing"))
                    await ns.sleep(1)
                while (!(rouletteWindow.querySelector(":nth-child(6)") as HTMLElement).textContent?.startsWith("lost ") && !(rouletteWindow.querySelector(":nth-child(6)") as HTMLElement).textContent?.startsWith("won "))
                    await ns.sleep(1)
                const resultTile = rouletteWindow.querySelector(":nth-child(4)");
                if (resultTile) {
                    const tileNum = extractNumberFromString(resultTile.textContent as string);
                    const resultBurn = getTile(tileNum, rouletteBurn);
                    if (resultBurn)
                        resultBurn.click();
                }
            }
        }
    }
}
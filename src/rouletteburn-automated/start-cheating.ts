import ns from "@ns";
import { exploit } from "/rouletteburn-automated/game/get-game";

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
    tailWindows.forEach((window) => {
        const children = window.querySelectorAll(":scope > *");
        children.forEach((childElement) => {
            if (childElement.textContent?.trim().includes("rouletteburn.js")) {
                ns.tprint(childElement.textContent)
                targetElement = window as HTMLElement;
                return;
            }
        });
    });

    const divsWithRoleButton = doc.querySelectorAll('div[role="button"]');

    divsWithRoleButton.forEach(div => {
        if (Array.from(div.querySelectorAll('*')).some(element => element.textContent?.includes('City'))) {
            (div as HTMLElement).click();
        }
    });

    await ns.sleep(1000);

    const casino = doc.querySelector('span[aria-label="Iker Molina Casino"]') as HTMLElement;

    casino.click();

    await ns.sleep(1000);

    const playRoulette = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.jss1.MuiBox-root.css-0 > div > button:nth-child(3)") as HTMLElement;

    playRoulette.click();

    await ns.sleep(1000);

    if (targetElement) {
        while (true) {
            const game = await exploit();
            if (game.moneySourceA.casino > 10e9) {
                ns.kill(pid);
                const terminal = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.MuiDrawer-root.MuiDrawer-docked.css-v3syqg > div > ul > div:nth-child(2) > div > div > div:nth-child(1)");
                (terminal as HTMLElement).click();
                break;
            }
            await ns.sleep(1);
            const rouletteBurn = targetElement.querySelector('span.MuiTypography-root.MuiTypography-body1.css-1csw0x8')?.querySelector("table") as HTMLTableElement;
            const rouletteWindow = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.jss1.MuiBox-root.css-0") as HTMLDivElement;
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
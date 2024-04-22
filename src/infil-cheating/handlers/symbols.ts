import { NS } from "@ns";
import { getReactKey } from "/react-handlers/get_react_key";

enum sizes {
    Smallest = 3*3,
    Small = 4*4,
    Medium = 5*5,
    Large = 6*6
}

function turnIntoGrid<T>(items: T[]) {
    const size = getSize(items);
    if (size != undefined) {
        return createGrid(items, size)
    }
    throw new Error(`Could not turn array of length ${items.length} into grid.`);
}

function createGrid<T>(items: T[], size: sizes): T[][] {
    const grid: T[][] = [];
    const limit = size == sizes.Smallest ? 3 : size == sizes.Small ? 4 : size == sizes.Medium ? 5 : 6
    console.log(limit);
    let index = 0;
    for (let i = 0; i < limit; i++) {
        grid.push([]);
        for (let j = 0; j < limit; j++) {
            grid[i].push(items[index]);
            index++;
        }
    }
    return grid;
}
function generateInstructions(currentPosition: [number, number], targetPosition: [number, number]): string[] {
    const instructions: string[] = [];
    let [currentRow, currentColumn] = currentPosition;
    const [targetRow, targetColumn] = targetPosition;

    while (currentRow !== targetRow || currentColumn !== targetColumn) {
        if (currentRow < targetRow) {
            instructions.push("ArrowDown");
            currentRow++;
        } else if (currentRow > targetRow) {
            instructions.push("ArrowUp");
            currentRow--;
        }

        if (currentColumn < targetColumn) {
            instructions.push("ArrowRight");
            currentColumn++;
        } else if (currentColumn > targetColumn) {
            instructions.push("ArrowLeft");
            currentColumn--;
        }
    }

    instructions.push(" ");

    return instructions;
}

function getSize(items: any[]) {
    if (items.length == 6*6)
        return sizes.Large;
    if (items.length == 5*5)
        return sizes.Medium;
    if (items.length == 4*4)
        return sizes.Small;
    if (items.length == 3*3)
        return sizes.Smallest;
    return;
}

function findTarget<T extends HTMLElement>(grid: T[][], target: string): [number, number] | null {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].textContent === target) {
                return [i, j];
            }
        }
    }
    return null;
}

export async function SolveSymbols(ns: NS) {
    const doc = eval("document") as Document;
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)") as HTMLElement;
    const targetElement = answerElement.querySelector("h5") as HTMLElement;
    const targets = targetElement.querySelectorAll("span");
    const symbolContainer = answerElement.querySelector("div") as HTMLElement;
    const symbols = symbolContainer.querySelectorAll("p");
    const grid = turnIntoGrid(Array.from(symbols));
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[4].props.onKeyDown;

    let currentRow = 0;
    let currentColumn = 0;

    for (const target of targets) {
        await ns.sleep(200)
        const targetString = (target.textContent as string).trim();
        const targetCoords = findTarget(grid, targetString);
        console.log(targetString);
        console.log(targetCoords);
        if (targetCoords) {
            const instructions = generateInstructions([currentRow, currentColumn], targetCoords);
            console.log([currentColumn, currentRow], targetCoords, instructions);
            currentRow = targetCoords[1];
            currentColumn = targetCoords[0];
            for (const instruction of instructions) {
                await ns.sleep(150);
                const event = {
                    preventDefault: () => {},
                    key: instruction,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                }
                keyDown(event);
            }
        }
    }
}
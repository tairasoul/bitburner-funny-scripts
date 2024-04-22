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
    console.log(size);
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

function findPositions<T extends HTMLElement>(grid: T[][], criteria: (element: T) => boolean): [number, number][] {
    const positions: [number, number][] = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (criteria(grid[i][j])) {
                positions.push([i, j]);
            }
        }
    }
    return positions;
}

export async function SolveMinefield(ns: NS) {
    const doc = eval("document") as Document;
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)") as HTMLElement;
    const minefield = answerElement.querySelector("div") as HTMLElement;
    const mines = minefield.querySelectorAll("p");
    const grid = turnIntoGrid(Array.from(mines));
    console.log(grid);
    const positions = findPositions(grid, (elem) => elem.querySelector("svg") != null);
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[2].props.onKeyDown;
    while (true) {
        await ns.sleep(1)
        if ((answerElement.querySelector('h4') as HTMLElement).textContent?.trim() == "Mark all the mines!")
            break;
    }
    
    await ns.sleep(50);

    let current: [number, number] = [0, 0];
    for (const position of positions) {
        await ns.sleep(50);
        const instructions = generateInstructions(current, position);
        console.log(current, position, instructions)
        current = position;
        for (const instruction of instructions) {
            await ns.sleep(50);
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
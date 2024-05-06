import { SolveBackwards } from "/infil-cheating/handlers/backwards";
import { SolveBracket } from "/infil-cheating/handlers/bracket";
import { SolveBribe } from "/infil-cheating/handlers/bribe";
import { SolveCode } from "/infil-cheating/handlers/code";
import { SolveMinefield } from "/infil-cheating/handlers/minefield";
import { SolveSlash } from "/infil-cheating/handlers/slash";
import { SolveSymbols } from "/infil-cheating/handlers/symbols";
import { SolveWires } from "/infil-cheating/handlers/wire";
import { NS } from "@ns";

const associations = {
    "Close the brackets": SolveBracket,
    "Attack when his guard is down!": SolveSlash,
    "Type it": SolveBackwards,
    "Remember all the mines!": SolveMinefield,
    "Say something nice about the guard": SolveBribe,
    "Enter the Code!": SolveCode,
    "Cut the wires": SolveWires,
    "Match the symbols!": SolveSymbols
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

function extractNumberFromString(str: string) {
    const numericStr = str.replace(/\D/g, '');
    const number = parseInt(numericStr);
    return number;
}

export async function main(ns: NS) {
    const company = ns.args.join(" ") as string;
    const doc = eval("document") as Document;
    const divsWithRoleButton = doc.querySelectorAll('div[role="button"]');

    divsWithRoleButton.forEach(div => {
        if (Array.from(div.querySelectorAll('*')).some(element => element.textContent?.includes('City'))) {
            (div as HTMLElement).click();
        }
    });

    await ns.sleep(1000)

    const cityWindow = doc.querySelector("#root > div.MuiBox-root > div:nth-child(2)") as HTMLElement;
    const companyElement = Array.from(cityWindow.querySelectorAll(`span`)).find((elem) => elem.ariaLabel == company);
    companyElement?.click();
    await ns.sleep(1000)

    const companyWindow = doc.querySelector("#root > div.MuiBox-root > div:nth-child(2)") as HTMLElement;
    const button = companyWindow.querySelector(":nth-child(3) > button") as HTMLElement;
    clickBypassed(button);
    await ns.sleep(1000)
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(2)") as HTMLElement;
    const start = answerElement.querySelector("div > button:nth-child(1)") as HTMLElement;
    start.click();
    while ((doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(2) > h4") as HTMLElement) != null)
        await ns.sleep(1);
    while (true) {
        const InfiltrationType = (doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3) > h4") as HTMLElement).textContent?.trim() as string;
        console.log(InfiltrationType);
        const associatedName = Object.keys(associations).find((v) => InfiltrationType.startsWith(v)) as string;
        console.log(associatedName)
        // @ts-ignore
        const associatedFunction = associations[associatedName]
        await associatedFunction(ns);
        const text = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(1) > h5")?.textContent as string;
        if (text){
            const split = text.split(" / ");
            const split1 = split[0];
            const split2 = split[1];
            const num1 = extractNumberFromString(split1);
            const num2 = extractNumberFromString(split2);
            if (num1 == num2)
                break;
        }
        else
            break;
    }
}
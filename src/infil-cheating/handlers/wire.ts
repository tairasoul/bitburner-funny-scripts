import { getReactKey } from "/react-handlers/get_react_key";

function extractNumberFromString(str: string) {
    const numericStr = str.replace(/\D/g, '');
    const number = parseInt(numericStr);
    return number;
}

export async function SolveWires() {
    const doc = eval("document") as Document;
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)") as HTMLElement;
    const wireContainer = answerElement.querySelector("div") as HTMLElement;
    const params = answerElement.querySelectorAll("p");
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[3].props.onKeyDown;
    const wireElements: {[num: string]: HTMLElement[]} = {};
    const wires = wireContainer.querySelectorAll("p");
    let wireMax = 0;
    for (const wire of wires) {
        const textContent = wire.textContent as string;
        if (textContent && !isNaN(parseInt(textContent))) {
            wireMax++;
        }
    }
    let wireNum = 0;
    let pastFirstRow = false;
    for (const wire of wires) {
        wireNum++;
        if (!pastFirstRow) {
            if (wireNum > wireMax) {
                pastFirstRow = true;
                wireNum = 0;
            }
            wireElements[wireNum.toString()] = [];
        }
        if (wireNum > wireMax) {
            pastFirstRow = true;
            wireNum = 0;
        }
        if (wireElements[wireNum.toString()] == undefined) wireElements[wireNum.toString()] = [];
        wireElements[wireNum.toString()].push(wire);
    }
    console.log(params);
    for (const param of params) {
        const text = param.textContent as string;
        if (text.includes("number")) {
            const num = extractNumberFromString(text);
            const input = {
                preventDefault: () => {},
                key: num.toString(),
                isTrusted: true,
                target: answerElement,
                currentTarget: answerElement,
                bubbles: true,
                cancelable: true
            }
            keyDown(input);
            continue;
        }
        if (text.includes("colored")) {
            const split = text.split(" ");
            const colorName = split[-1].replace(".", "");
            const color = colorName == "red" ? "red" : colorName == "yellow" ? "rgb(255, 193, 7)" : colorName == "blue" ? "blue" : "white"
            for (const wireNum of Object.keys(wireElements)) {
                for (const wire of wireElements[wireNum]) {
                    if (wire.style.color == color) {
                        const input = {
                            preventDefault: () => {},
                            key: wireNum,
                            isTrusted: true,
                            target: answerElement,
                            currentTarget: answerElement,
                            bubbles: true,
                            cancelable: true
                        }
                        keyDown(input);
                        continue;
                    }
                }
            }
            continue;
        }
    }
}
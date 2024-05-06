import { getReactKey } from "/react-handlers/get_react_key";
import { NS } from "@ns";

export async function SolveBribe(ns: NS) {
    const positive = [
        "affectionate",
        "agreeable",
        "bright",
        "charming",
        "creative",
        "determined",
        "energetic",
        "friendly",
        "funny",
        "generous",
        "polite",
        "likable",
        "diplomatic",
        "helpful",
        "giving",
        "kind",
        "hardworking",
        "patient",
        "dynamic",
        "loyal",
        "straightforward",
    ];
    const doc = eval("document") as Document;
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)") as HTMLElement;
    const reactKey = getReactKey(answerElement, "Props$")
    // @ts-ignore
    const oldFailure = answerElement[reactKey].children[1].props.onFailure;
    // @ts-ignore
    answerElement[reactKey].children[1].props.onFailure = () => {
        oldFailure({automated: false});
    };
    while (true) {
        await ns.sleep(300);
        // @ts-ignore
        const keyDown = answerElement[reactKey].children[1].props.onKeyDown;
        const text = answerElement.querySelector(":nth-child(3)")?.textContent as string;
        console.log(text);
        if (positive.includes(text)) {
            const event = {
                preventDefault: () => {},
                key: " ",
                isTrusted: true,
                target: answerElement,
                currentTarget: answerElement,
                bubbles: true,
                cancelable: true
            }
            keyDown(event);
            break;
        }
        await ns.sleep(300);
        const event = {
            preventDefault: () => {},
            key: "w",
            isTrusted: true,
            target: answerElement,
            currentTarget: answerElement,
            bubbles: true,
            cancelable: true
        }
        console.log(event);
        keyDown(event);
    }
}
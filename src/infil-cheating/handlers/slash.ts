import { NS } from "@ns";
import { getReactKey } from "/react-handlers/get_react_key";

export async function SolveSlash(ns: NS) {
    const doc = eval("document") as Document;
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)") as HTMLElement;
    const reactKey = getReactKey(answerElement, "Props$");
    while (true) {
        await ns.sleep(1);
        if (answerElement.querySelector(":nth-child(2)")?.textContent?.includes("Preparing"))
            break;
    }
    console.log("attacking!!");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[5].props.onKeyDown;
    const event = {
        preventDefault: () => {},
        key: " ",
        isTrusted: true,
        target: answerElement,
        currentTarget: answerElement,
        bubbles: true,
        cancelable: true
    }
    await ns.sleep(200);
    keyDown(event);
}
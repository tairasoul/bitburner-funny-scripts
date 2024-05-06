import { NS } from "@ns";
import { getReactKey } from "/react-handlers/get_react_key";

export async function SolveBracket(ns: NS) {
    const doc = eval("document") as Document;
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)") as HTMLElement;
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const children = answerElement[reactKey].children;
    const text = children[1].props.children[0] as string;
    console.log(text);
    const keyDown = children[2].props.onKeyDown;
    // @ts-ignore
    const oldFailure = children[2].props.onFailure;
    // @ts-ignore
    children[2].props.onFailure = () => {
        oldFailure({automated: false});
    };
    const brackets = text.split("").reverse() as ("<" | "[" | "{" | "(")[];
    const associations = {
        "<": ">",
        "[": "]",
        "{": "}",
        "(": ")"
    }
    for (const bracket of brackets) {
        await ns.sleep(400)
        const associated = associations[bracket];
        const event = {
            preventDefault: () => {},
            key: associated,
            isTrusted: true,
            target: answerElement,
            currentTarget: answerElement,
            bubbles: true,
            cancelable: true,
        };
        console.log(event);
        keyDown(event);
        /*answerElement.dispatchEvent(
            new KeyboardEvent("keypress", {
                key: associated
            })
        )*/
    }
}
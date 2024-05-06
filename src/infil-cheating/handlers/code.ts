import { NS } from "@ns";
import { getReactKey } from "/react-handlers/get_react_key";

const arrows = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→"
}

enum arrowKeys {
    Up = "w",
    Down = "s",
    Left = "a",
    Right = "d"
}

export async function SolveCode(ns: NS) {
    const doc = eval("document") as Document;
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)") as HTMLElement;
    const arrowContainer = answerElement.querySelector("div") as HTMLElement;
    const arrowSpans = arrowContainer.querySelectorAll("span");
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[2].props.onKeyDown;
    // @ts-ignore
    const oldFailure = answerElement[reactKey].children[2].props.onFailure;
    // @ts-ignore
    answerElement[reactKey].children[2].props.onFailure = () => {
        oldFailure({automated: false});
    };
    for (let i = 1; i <= arrowSpans.length; i++) {
        const selector = `:nth-child(${i})`;
        console.log(selector);
        const arrowElement = arrowContainer.querySelector(selector) as HTMLElement;
        const text = arrowElement.textContent as string;
        await ns.sleep(200);
        console.log(text.trim());
        switch (text.trim()) {
            case arrows.up:
                const upEvent = {
                    preventDefault: () => {},
                    key: arrowKeys.Up,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                }
                keyDown(upEvent);
                break;
            case arrows.down:
                const downEvent = {
                    preventDefault: () => {},
                    key: arrowKeys.Down,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                }
                keyDown(downEvent)
                break;
            case arrows.left:
                const leftEvent = {
                    preventDefault: () => {},
                    key: arrowKeys.Left,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                }
                keyDown(leftEvent)
                break;
            case arrows.right:
                const rightEvent = {
                    preventDefault: () => {},
                    key: arrowKeys.Right,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                }
                keyDown(rightEvent)
                break;
        }
    }
}
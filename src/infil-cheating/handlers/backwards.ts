import { getReactKey } from "/react-handlers/get_react_key";

export async function SolveBackwards() {
    const doc = eval("document") as Document;
    const mainWindow = doc.querySelector("#root > div.MuiBox-root > div > div:nth-child(3)")?.parentNode?.querySelector("div:nth-child(3)") as HTMLDivElement;
    const textElement = mainWindow.querySelector(":nth-child(2)") as HTMLElement;
    console.log(textElement);
    const inputHandler = mainWindow.querySelector(":nth-child(3)") as HTMLElement;
    const text = (textElement.textContent as string).replace(/\s+/g, "").split("");
    console.log(text);
    const keyboardInputs: {key: string;shiftKey: boolean;ctrlKey: boolean;altKey: boolean;}[] = [];
    for (const char of text) {
        keyboardInputs.push(
            {
                key: char,
                shiftKey: false,
                ctrlKey: false,
                altKey: false
            }
        )
    }
    console.log(keyboardInputs)
    const props = getReactKey(inputHandler, "Props$");
    // @ts-ignore
    const elem = inputHandler[props];
    const child = elem.children[1].props;
    const keyDown = child.onKeyDown;
    for (const input of keyboardInputs) {
        keyDown({
            preventDefault: () => {},
            key: input.key,
            isTrusted: true,
            target: inputHandler,
            currentTarget: inputHandler,
            bubbles: true,
            cancelable: true
        })
    }
}
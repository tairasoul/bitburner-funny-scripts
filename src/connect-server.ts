import ns from "@ns";
import { getReactKey } from "/react-handlers/get_react_key"

function recursiveScan(ns: ns.NS, parent: string, server: string, target: string, route: string[]) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        if (child == target) {
            route.unshift(child);
            route.unshift(server);
            return true;
        }

        if (recursiveScan(ns, server, child, target, route)) {
            route.unshift(server);
            return true;
        }
    }
    return false;
}

export async function main(ns: ns.NS) {
    const server = ns.args[0] as string;
    const doc = eval("document")
    const terminal = doc.querySelector("#terminal-input") as HTMLInputElement;
    const route: string[] = [];
    recursiveScan(ns, '', 'home', server, route);
    const props = getReactKey(terminal, "Props$");
    // @ts-ignore
    const onChange = terminal[props].onChange;
    let str = "";
    for (const path of route) {
        str += `connect ${path};`
    }
    onChange({target: {value: str}})
    await ns.sleep(20);
    const event = {
        preventDefault: () => {},
        key: "Enter",
        isTrusted: true
    }
    // @ts-ignore
    const keyDown = terminal[props].onKeyDown;
    await keyDown(event);
}
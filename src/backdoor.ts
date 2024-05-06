import ns from "@ns";
import { getReactKey } from "/react-handlers/get_react_key"
import { gainAccess, list_servers } from "./general/utils";

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
    //await connectServer(ns, server);
    //await backdoor(ns);
    const servers = list_servers(ns);
    ns.disableLog("sleep");
    ns.tail();
    for (const server of servers) {
        if (ns.getPlayer().skills.hacking >= ns.getServerRequiredHackingLevel(server))
            if (ns.hasRootAccess(server)) {
                await connectServer(ns, server);
                await backdoor(ns);
            }
            else {
                await gainAccess(ns, server);
                if (ns.hasRootAccess(server)) {
                    await connectServer(ns, server);
                    await backdoor(ns);
                }
            }
    }
}

async function connectServer(ns: ns.NS, server: string) {
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

async function backdoor(ns: ns.NS) {
    const doc = eval("document")
    const terminal = doc.querySelector("#terminal-input") as HTMLInputElement;
    const props = getReactKey(terminal, "Props$");
    // @ts-ignore
    const onChange = terminal[props].onChange;
    onChange({target: {value: "backdoor"}});
    await ns.sleep(20);
    const event = {
        preventDefault: () => {},
        key: "Enter",
        isTrusted: true
    }
    // @ts-ignore
    const keyDown = terminal[props].onKeyDown;
    await keyDown(event);
    while (terminal.disabled) {
        await ns.sleep(1);
    }
}
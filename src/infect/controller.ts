import ns from "@ns";
import Communicator from "/port-registry/classes/communicator";

export async function main(ns: ns.NS) {
    //ns.disableLog("ALL")
    const targetServer = ns.args[0] as string;
    const commsPort = ns.args[1] as number;
    const comms = ns.getPortHandle(commsPort);
    await comms.nextWrite();
    const controllerAmount = comms.peek() as number;
    const portComms = new Communicator(ns);
    const ports = (await portComms.assignFirstAvailable(2));
    const serverData = ports.assignedPorts[0];
    const returnData = ports.assignedPorts[1];
    ns.atExit(() => {
        portComms.unassignPorts(ports.assignedPorts)
        ns.rm(`/lock/controllers/${targetServer}.txt`, "home");
    });
    const port = ns.getPortHandle(serverData);
    port.clear();
    port.write(targetServer)
    await ns.sleep(50);
    const returnPort = ns.getPortHandle(returnData);
    const grow = "/infect/worms/grow.js";
    const hack = "/infect/worms/hack.js";
    const weaken = "/infect/worms/weaken.js";
    const ram = ns.getServerMaxRam("Controller-Worms") / controllerAmount;
    ns.scp([grow, hack, weaken], "Controller-Worms", "home")
    const minMoney = ns.getServerMoneyAvailable(targetServer);
    while (true) {
        await ns.sleep(1);
        if (ns.getServerMoneyAvailable(targetServer) < minMoney) {
            while (true) {
                await deployScript(ns, grow, "Controller-Worms", ram, serverData, returnData);
                await returnPort.nextWrite();
                returnPort.clear();
                if (ns.getServerMoneyAvailable(targetServer) > minMoney * 2)
                    break;
            }
        }
        if (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer) * 1.5) {
            while (true) {
                await deployScript(ns, weaken, "Controller-Worms", ram, serverData, returnData);
                await returnPort.nextWrite();
                returnPort.clear();
                if (ns.getServerSecurityLevel(targetServer) <= ns.getServerMinSecurityLevel(targetServer))
                    break;
            }
        }
        while (true) {
            await deployScript(ns, hack, "Controller-Worms", ram, serverData, returnData);
            await returnPort.nextWrite();
            returnPort.clear();
            if (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer) * 1.5)
                break;
            if (ns.getServerMoneyAvailable(targetServer) < minMoney * 2)
                break;
        }
    }
}

async function deployScript(ns: ns.NS, script: string, server: string, maxRam: number, ...args: any[]) {
    const scriptRam = ns.getScriptRam(script, "home");
    const threads = Math.floor(maxRam / scriptRam);
    ns.exec(script, server, threads, ...args);
}
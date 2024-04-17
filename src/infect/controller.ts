import ns from "@ns";
import Communicator from "/port-registry/classes/communicator";

export async function main(ns: ns.NS) {
    ns.disableLog("ALL")
    const targetServer = ns.args[0] as string;
    const portComms = new Communicator(ns);
    const portUsed = (await portComms.assignFirstAvailable(1)).assignedPorts[0];
    ns.atExit(() => {
        portComms.unassignPorts([portUsed])
        ns.rm(`/lock/controllers/${targetServer}.txt`, "home");
    });
    const port = ns.getPortHandle(portUsed);
    port.clear();
    const grow = "/infect/worms/grow.js";
    const hack = "/infect/worms/hack.js";
    const weaken = "/infect/worms/weaken.js";
    const minMoney = ns.getServerMoneyAvailable(targetServer);
    while (true) {
        await ns.sleep(1);
        if (ns.getServerMoneyAvailable(targetServer) < minMoney) {
            ns.print(`Growing ${targetServer}'s money.`);
            while (true) {
                await port.write(targetServer)
                await ns.sleep(1);
                await deployScript(ns, grow, targetServer, portUsed);
                await port.nextWrite();
                port.clear();
                if (ns.getServerMoneyAvailable(targetServer) > minMoney * 2)
                    break;
            }
        }
        if (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer) * 1.5) {
            ns.print(`Weakening ${targetServer}.`);
            while (true) {
                await port.write(targetServer)
                await ns.sleep(1);
                await deployScript(ns, weaken, targetServer, portUsed);
                await port.nextWrite();
                port.clear();
                if (ns.getServerSecurityLevel(targetServer) <= ns.getServerMinSecurityLevel(targetServer))
                    break;
            }
        }
        ns.print(`Hacking ${targetServer}.`);
        while (true) {
            await port.write(targetServer)
            await ns.sleep(1);
            await deployScript(ns, hack, targetServer, portUsed);
            await port.nextWrite();
            port.clear();
            if (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer) * 1.5)
                break;
            if (ns.getServerMoneyAvailable(targetServer) < minMoney * 2)
                break;
        }
    }
}

async function deployScript(ns: ns.NS, script: string, server: string, ...args: any[]) {
    const scriptRam = ns.getScriptRam(script, "home");
    const available = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const threads = Math.floor(available / scriptRam);
    if (!ns.fileExists(script, server))
        ns.scp(script, server, "home");
    ns.exec(script, server, threads, ...args);
}
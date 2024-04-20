import ns from "@ns";
import { WormData } from "/infect/worms/types";
import Multiport from "/general/multiport";

export async function main(ns: ns.NS) {
    const returnComms = new Multiport(ns, {ports: JSON.parse(ns.args[0] as string)})
    const data = JSON.parse(ns.args[1] as string) as WormData;
    const port = ns.getPortHandle(data.startPort);
    await port.nextWrite();
    await ns.hack(data.server);
    returnComms.write(JSON.stringify(data));
}
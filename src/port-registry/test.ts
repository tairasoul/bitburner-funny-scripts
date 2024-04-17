import ns from "@ns";
import Communicator from "/port-registry/classes/communicator";

// requests: 1 - 100
// responses: 101 - 200

export async function main(ns: ns.NS) {
    ns.disableLog("ALL");
    const comms = new Communicator(ns);
    const assigned = await comms.assignFirstAvailable(20);
    ns.tprint(assigned);
    comms.unassignPorts(assigned.assignedPorts);
}
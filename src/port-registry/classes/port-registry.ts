import ns from "@ns";
import Multiport from "/port-registry/classes/multiport";

// Types

type Assigned = {
    pid: number;
    ports: number[];
}

export type ResponseMessage = {
    pid: number;
    result: "assigned"
} | {
    pid: number;
    result: "couldnt assign";
    owned_by: number[];
} | {
    pid: number;
    result: "assignedAvailable";
    assignedPorts: number[];
}


export type HandlerMessage = {
    request: "assign";
    ports: number[];
    pid: number;
} | {
    request: "unassign";
    ports: number[];
    pid: number;
} | {
    request: "assignAvailable";
    portAmount: number;
    pid: number;
}

// Classes

class MessageQueue {
    port: Multiport;
    constructor(ns: ns.NS, start: number, end: number) {
        this.port = new Multiport(ns, start, end);
    }

    get requestAvailable() {
        return this.port.peek() != null
    }

    async processRequest(reqProcessor: (message: HandlerMessage) => Promise<any>) {
        const data = this.port.read();
        const parsed = JSON.parse(data) as HandlerMessage;
        await reqProcessor(parsed);
    }
}

class PortHandler {
    private ns: ns.NS;
    private requests: MessageQueue;
    private responses: Multiport;
    private assigned: Assigned[] = [];
    constructor(ns: ns.NS) {
        this.ns = ns;
        this.requests = new MessageQueue(ns, 1, 100);
        this.responses = new Multiport(ns, 101, 200);
    }

    async startHandling() {
        while (true) {
            await this.ns.sleep(1);
            if (this.requests.requestAvailable) {
                await this.requests.processRequest(async (message) => await this.handleRequest(message));
            }
        }
    }

    async handleRequest(message: HandlerMessage) {
        switch (message.request) {
            case "assign":
                if (this.arePortsUnassigned(message.ports)) {
                    this.assigned.push(
                        {
                            pid: message.pid,
                            ports: message.ports
                        }
                    )
                    this.sendResponse(
                        {
                            pid: message.pid,
                            result: "assigned"
                        }
                    )
                }
                else {
                    const owners: number[] = [];
                    for (const port of message.ports) {
                        const owner = this.getOwnerOf(port);
                        if (owner) {
                            owners.push(owner);
                        }
                    }
                    this.sendResponse(
                        {
                            pid: message.pid,
                            result: "couldnt assign",
                            owned_by: owners
                        }
                    )
                }
                break;
            case "unassign":
                const found = this.assigned.find((v) => {
                    let portsMatch = true;
                    message.ports.forEach((val) => {
                        if (!v.ports.includes(val)) {
                            portsMatch = false;
                        }
                    })
                    return portsMatch;
                })
                if (found) {
                    this.assigned = this.assigned.filter((v) => v != found);
                }
                break;
            case "assignAvailable":
                const availablePorts: number[] = [];
                let availableFound = 0;
                for (let i = 10001; i < 200000; i++) {
                    if (this.isPortUnassigned(i)) {
                        availablePorts.push(i)
                        availableFound++;
                    }
                    if (availableFound >= message.portAmount)
                        break;
                }
                this.assigned.push(
                    {
                        pid: message.pid,
                        ports: availablePorts
                    }
                )
                this.sendResponse(
                    {
                        result: "assignedAvailable",
                        pid: message.pid,
                        assignedPorts: availablePorts
                    }
                )
        }
    }

    getOwnerOf(port: number) {
        for (const assigned of this.assigned) {
            if (assigned.ports.includes(port))
                return assigned.pid;
        }
        return;
    }

    isPortUnassigned(port: number) {
        for (const assigned of this.assigned) {
            if (assigned.ports.includes(port)) {
                return false;
            }
        }
        return true;
    }

    getUnassignedPortsFromList(ports: number[]) {
        const unassigned: number[] = [];
        for (const port of ports) {
            if (this.isPortUnassigned(port))
                unassigned.push(port);
        }
        return unassigned;
    }

    arePortsUnassigned(ports: number[]) {
        for (const port of ports) {
            if (!this.isPortUnassigned(port))
                return false;
        }
        return true;
    }

    sendResponse(response: ResponseMessage) {
        this.responses.write(JSON.stringify(response), (_, port) => port.empty());
    }
}

// Main code

export async function main(ns: ns.NS) {
    ns.disableLog("ALL")
    const handler = new PortHandler(ns);
    await handler.startHandling();
}
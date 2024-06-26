import ns from "@ns";
import Multiport from "/general/multiport";
import { HandlerMessage } from "/services/port-registry";

type ResponseMessage = {
    pid: number;
    result: "assigned"
} | {
    pid: number;
    result: "couldnt assign";
    owned_by: number[];
}

type AssignedAvailable = {
    pid: number;
    result: "assignedAvailable";
    assignedPorts: number[];
}

export default class PortCommunicator {
    private ns: ns.NS;
    private requests: Multiport;
    private responses: Multiport;
    constructor(ns: ns.NS) {
        this.ns = ns;
        this.requests = new Multiport(ns, {start: 1, end: 100});
        this.responses = new Multiport(ns, {start: 101, end: 200});
    }

    async assignPorts(ports: number[]) {
        const message: HandlerMessage = {
            pid: this.ns.pid,
            ports,
            request: "assign"
        }
        this.requests.writeEmpty(message);
        return await this.AwaitResponse();
    }

    unassignPorts(ports: number[]) {
        const message: HandlerMessage = {
            pid: this.ns.pid,
            ports,
            request: "unassign"
        }
        this.requests.writeEmpty(message);
    }

    async assignFirstAvailable(amount: number) {
        const message: HandlerMessage = {
            pid: this.ns.pid,
            request: "assignAvailable",
            portAmount: amount
        }
        this.requests.writeEmpty(message);
        return await this.AwaitResponse() as unknown as AssignedAvailable;
    }

    private async AwaitResponse() {
        while (true) {
            await this.responses.nextWrite();
            if (this.responses.peek((data) => this.isForThisPID(data))) {
                return JSON.parse(this.responses.read((data) => this.isForThisPID(data))) as ResponseMessage;
            }
        }
    }

    private isForThisPID(data: string) {
        const parsed: ResponseMessage = JSON.parse(data);
        return parsed.pid == this.ns.pid;
    }
}
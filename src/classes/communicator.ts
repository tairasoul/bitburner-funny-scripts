import ns from "@ns";
import Multiport from "/classes/multiport";
import { HandlerMessage } from "/classes/port-registry";

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

export default class Communicator {
    private ns: ns.NS;
    private requests: Multiport;
    private responses: Multiport;
    constructor(ns: ns.NS) {
        this.ns = ns;
        this.requests = new Multiport(ns, 1, 100);
        this.responses = new Multiport(ns, 101, 10000);
    }

    async assignPorts(ports: number[]) {
        const message: HandlerMessage = {
            pid: this.ns.pid,
            ports,
            request: "assign"
        }
        this.requests.write(message);
        return await this.AwaitResponse();
    }

    unassignPorts(ports: number[]) {
        const message: HandlerMessage = {
            pid: this.ns.pid,
            ports,
            request: "unassign"
        }
        this.requests.write(message);
    }

    async assignFirstAvailable(amount: number) {
        const message: HandlerMessage = {
            pid: this.ns.pid,
            request: "assignAvailable",
            portAmount: amount
        }
        this.requests.write(message);
        return await this.AwaitResponse() as unknown as AssignedAvailable;
    }

    private async AwaitResponse() {
        while (true) {
            await this.ns.sleep(1);
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
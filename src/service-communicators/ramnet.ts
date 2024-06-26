import ns from "@ns";
import Multiport from "/general/multiport";
import * as RamnetResponses from "/services/ramnet-service";
import { Job } from "/general/ramnet";

export default class RamnetComms {
    private ns: ns.NS;
    private requests: Multiport;
    private responses: Multiport;
    constructor(ns: ns.NS) {
        this.ns = ns;
        this.requests = new Multiport(ns, {start: 201, end: 300});
        this.responses = new Multiport(ns, {start: 301, end: 400});
    }

    async assignJob(job: Job) {
        this.requests.writeEmpty(
            {
                pid: this.ns.pid,
                message: "assign",
                job
            }
        )
        const ret = await this.AwaitResponse();
        return ret as RamnetResponses.assignJobResult;
    }

    async finishJob(job: Job) {
        this.requests.writeEmpty(
            {
                pid: this.ns.pid,
                message: "finish",
                job
            }
        )
        const ret = await this.AwaitResponse();
        return ret as RamnetResponses.finishJobResult;
    }

    async getBlock(server: string) {
        this.requests.writeEmpty(
            {
                pid: this.ns.pid,
                message: "getBlock",
                block: server
            }
        )
        const ret = await this.AwaitResponse();
        return ret as RamnetResponses.getBlockResult;
    }

    async hasBlock(server: string) {
        this.requests.writeEmpty(
            {
                pid: this.ns.pid,
                message: "hasBlock",
                block: server
            }
        )
        const ret = await this.AwaitResponse() as RamnetResponses.hasBlockResult;
        return ret.result;
    }

    async getTotalRam() {
        return await this.get("totalRam") as RamnetResponses.totalRamResult;
    }

    async getMaxRam() {
        return await this.get("maxRam") as RamnetResponses.maxRamResult;
    }

    async getMaxBlockSize() {
        return await this.get("maxBlockSize") as RamnetResponses.maxBlockSizeResult;
    }

    async getClone() {
        return await this.get("clone") as RamnetResponses.cloneResult;
    }

    private async get(property: "totalRam" | "maxRam" | "maxBlockSize" | "clone") {
        this.requests.writeEmpty(
            {
                pid: this.ns.pid,
                message: "get",
                value: property
            }
        )
        const ret = await this.AwaitResponse();
        return ret;
    }

    update() {
        this.requests.writeEmpty(
            {
                message: "updateRamnet"
            }
        )
    }

    private async AwaitResponse() {
        while (true) {
            await this.responses.nextWrite()
            if (this.responses.peek((data) => this.isForThisPID(data))) {
                return JSON.parse(this.responses.read((data) => this.isForThisPID(data)));
            }
        }
    }

    private isForThisPID(data: string) {
        const parsed: RamnetResponses.RamnetResponse = JSON.parse(data);
        return parsed.pid == this.ns.pid;
    }
}
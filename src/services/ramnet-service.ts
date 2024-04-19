import ns from "@ns";
import RamNet, { Block, Job } from "/general/ramnet";
import Multiport from "/general/multiport";
import Logs from "/general/logs";
import Lockfile from "/general/locks";

export type RamnetMessage = {
    pid: number;
    message: "get",
    value: "totalRam" | "maxRam" | "maxBlockSize" | "clone";
} | {
    pid: number;
    message: "assign";
    job: Job;
} | {
    pid: number;
    message: "finish";
    job: Job;
} | {
    pid: number;
    message: "getBlock";
    block: string;
} | {
    pid: number;
    message: "hasBlock";
    block: string;
} | {
    message: "updateRamnet";
}

export type RamnetResponse = totalRamResult
    | maxRamResult
    | maxBlockSizeResult
    | cloneResult
    | assignJobResult
    | finishJobResult
    | getBlockResult
    | hasBlockResult;

export type totalRamResult = {
    pid: number;
    totalRam: number;
}

export type maxRamResult = {
    pid: number;
    maxRam: number;
}

export type maxBlockSizeResult = {
    pid: number;
    maxBlockSize: number;
}

export type cloneResult = {
    pid: number;
    clone: Block[];
}

export type assignJobResult = {
    pid: number;
    result: "assignedJob";
    jobAssigned: Job;
} 

export type finishJobResult = {
    pid: number;
    result: "finishedJob";
    jobFinished: Job;
}

export type getBlockResult = {
    pid: number;
    block: Block;
}

export type hasBlockResult = {
    pid: number;
    result: boolean;
}

class RamnetService {
    #ns: ns.NS
    #requests: Multiport;
    #responses: Multiport;
    ramnet: RamNet;
    #logs: Logs;
    constructor(ns: ns.NS, requests: Multiport, responses: Multiport) {
        this.#ns = ns;
        this.#requests = requests;
        this.#responses = responses;
        this.ramnet = new RamNet(ns);
        this.#logs = new Logs(ns, "Ramnet-Service");
    }

    async handleRequests() {
        while (true) {
            await this.#ns.sleep(1);
            if (!this.#requests.empty()) {
                await this.handleMessage(JSON.parse(this.#requests.read()));
            }
        }
    }

    async handleMessage(message: RamnetMessage) {
        await this.#logs.Log(`Handling message of type ${message.message}.`);
        switch(message.message) {
            case "get":
                switch(message.value) {
                    case "totalRam":
                        this.#responses.writeEmpty(
                            {
                                pid: message.pid,
                                totalRam: this.ramnet.totalRam
                            }
                        )
                        break;
                    case "maxRam":
                        this.#responses.writeEmpty(
                            {
                                pid: message.pid,
                                maxRam: this.ramnet.maxRam
                            }
                        )
                        break;
                    case "maxBlockSize":
                        this.#responses.writeEmpty(
                            {
                                pid: message.pid,
                                maxBlockSize: this.ramnet.maxBlockSize
                            }
                        )
                        break;
                    case "clone":
                        this.#responses.writeEmpty(
                            {
                                pid: message.pid,
                                clone: this.ramnet.clone
                            }
                        )
                        break;
                }
                break;
            case "assign":
                this.ramnet.assign(message.job);
                this.#responses.writeEmpty(
                    {
                        pid: message.pid,
                        result: "assignedJob",
                        jobAssigned: message.job
                    }
                )
                break;
            case "finish":
                this.ramnet.finish(message.job);
                this.#responses.writeEmpty(
                    {
                        pid: message.pid,
                        result: "finishedJob",
                        jobFinished: message.job
                    }
                )
                break;
            case "getBlock":
                this.#responses.writeEmpty(
                    {
                        pid: message.pid,
                        block: this.ramnet.getBlock(message.block)
                    }
                )
                break;
            case "hasBlock":
                this.#responses.writeEmpty(
                    {
                        pid: message.pid,
                        result: this.ramnet.hasBlock(message.block)
                    }
                )
                break;
            case "updateRamnet":
                await this.ramnet.update();
                break;
        }
    }
}

export async function main(ns: ns.NS) {
    ns.disableLog("ALL");
    const lockfile = new Lockfile(ns)
    if (!lockfile.isLocked("ramnet-service")) {
        await lockfile.lock('ramnet-service');
        ns.atExit(() => {
            lockfile.unlock("ramnet-service");
        })
        const requests = new Multiport(ns, {start: 201, end: 300});
        const responses = new Multiport(ns, {start: 301, end: 400});
        const service = new RamnetService(ns, requests, responses);
        await service.ramnet.init();
        await service.handleRequests();
    }
}
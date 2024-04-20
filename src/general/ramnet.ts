import ns from "@ns";
import { list_servers, gainAccess } from "/general/utils";

export type Block = {
    server: string;
    ram: number;
}

export type Job = {
    server: string;
    ram: number;
}

export default class RamNet {
    #blocks: Block[] = [];
    #minBlockSize = Infinity;
    #maxBlockSize = 0;
    #totalRam = 0;
    #maxRam = 0;
    #index: Map<string, number> = new Map();
    #ns: ns.NS
    
    constructor(ns: ns.NS) {
        this.#ns = ns;
    }

    async init() {
        for (const server of list_servers(this.#ns)) {
            if (server != "Controller-Central") {
                if (!this.#ns.hasRootAccess(server)) {
                    await gainAccess(this.#ns, server);
                }
                if (this.#ns.hasRootAccess(server)) {
                    const maxRam = this.#ns.getServerMaxRam(server);
                    const ram = maxRam - this.#ns.getServerUsedRam(server);
                    if (ram >= 1.60) {
                        const block = { server: server, ram: ram };
                        this.#blocks.push(block);
                        if (ram < this.#minBlockSize) this.#minBlockSize = ram;
                        if (ram > this.#maxBlockSize) this.#maxBlockSize = ram;
                        this.#totalRam += ram;
                        this.#maxRam += maxRam;
                    }
                }
            }
        }
		this.#sort();

		this.#blocks.forEach((block, index) => this.#index.set(block.server, index));
    }

    async update() {
        this.#blocks = [];
        this.#totalRam += 0;
        this.#maxRam += 0;
        for (const server of list_servers(this.#ns)) {
            if (server != "Controller-Central") {
                if (!this.#ns.hasRootAccess(server)) {
                    await gainAccess(this.#ns, server);
                }
                if (this.#ns.hasRootAccess(server)) {
                    const maxRam = this.#ns.getServerMaxRam(server);
                    const ram = maxRam - this.#ns.getServerUsedRam(server);
                    if (ram >= 1.60) {
                        const block = { server: server, ram: ram };
                        this.#blocks.push(block);
                        if (ram < this.#minBlockSize) this.#minBlockSize = ram;
                        if (ram > this.#maxBlockSize) this.#maxBlockSize = ram;
                        this.#totalRam += ram;
                        this.#maxRam += maxRam;
                    }
                }
            }
        }
		this.#sort();

		this.#blocks.forEach((block, index) => this.#index.set(block.server, index));
    }
    
	#sort() {
		this.#blocks.sort((x, y) => {
			// Prefer assigning to home last so that we have more room to play the game while batching.
			if (x.server === "home") return 1;
			if (y.server === "home") return -1;

			return x.ram - y.ram;
		});
	}

	getBlock(server: string) {
		if (this.#index.has(server)) {
			return this.#blocks[this.#index.get(server) as number];
		} else {
			throw new Error(`Server ${server} not found in RamNet.`);
		}
	}

    hasBlock(server: string) {
        return this.#index.has(server);
    }
	get totalRam() {
		return this.#totalRam;
	}

	get maxRam() {
		return this.#maxRam;
	}

	get maxBlockSize() {
		return this.#maxBlockSize;
	}

	get clone() {
		return this.#blocks.map(block => ({ ...block }));
	}

    assign(job: Job) {
        const block = this.#blocks.find(block => block.ram >= job.ram);
        if (!block) return false;
        job.server = block.server;
        block.ram -= job.ram;
        this.#totalRam -= job.ram;
        return true;
    }

    finish(job: Job) {
        const block = this.getBlock(job.server);
        block.ram += job.ram;
        this.#totalRam += job.ram;
    }
}
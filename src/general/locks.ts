import ns from "@ns";
import { RemoteFiles } from "/general/remote-file";

export default class Lockfile {
    #ns: ns.NS;
    #remote_files: RemoteFiles;
    constructor(ns: ns.NS) {
        this.#ns = ns;
        this.#remote_files = new RemoteFiles(ns);
    }

    isLocked(name: string) {
        return this.#ns.fileExists(`/lockfiles/${name}.txt`, "home");
    }

    async getLockData(name: string) {
        if (!this.isLocked(name))
            throw `${name} is not locked!`;
        return await this.#remote_files.read(`/lockfiles/${name}.txt`, "home");
    }

    async lock(name: string, data: string = "locked.") {
        if (this.isLocked(name))
            throw `${name} is already locked!`;
        await this.#remote_files.write(`/lockfiles/${name}.txt`, data, "home");
    }

    unlock(name: string) {
        this.#ns.rm(`/lockfiles/${name}.txt`, "home");
    }
}
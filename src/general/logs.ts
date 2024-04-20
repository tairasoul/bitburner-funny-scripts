import ns from "@ns";
import { RemoteFiles } from "/general/remote-file";

export default class Logs {
    #ns: ns.NS;
    #files: RemoteFiles;
    #name: string;
    constructor(ns: ns.NS, name?: string) {
        this.#ns = ns;
        this.#files = new RemoteFiles(this.#ns);
        if (name) {
            this.#name = name;
        }
        else {
            this.#name = ns.pid.toString();
        }
        ns.print(`Logs for this script can be found at /logs/${this.#name}-log.txt on the "home" server.`)
    }

    async Log(text: string) {
        const time = new Date(Date.now());
        const date = time.toLocaleTimeString()
        if (this.#ns.fileExists(`/logs/${this.#name}-log.txt`, "home")) await this.#files.write(`/logs/${this.#name}-log.txt`, "\n", "home", "a");
        await this.#files.write(`/logs/${this.#name}-log.txt`, `[${date}] ${text}`, "home", "a");
    }
}
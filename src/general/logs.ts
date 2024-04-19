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
            this.#name = `${ns.pid}-${name}`;
        }
        else {
            this.#name = ns.pid.toString();
        }
        ns.print(`Logs for this script can be found at /logs/${this.#name}-log.txt on the "home" server.`)
    }

    async Log(text: string) {
        await this.#files.write(`/logs/${this.#name}-log.txt`, "\n", "home", "a");
        await this.#files.write(`/logs/${this.#name}-log.txt`, text, "home", "a");
    }
}
import ns from "@ns";
import { OperationData } from "/general/remote-file/perform-operation";
import Communicator from "/port-registry/classes/communicator";

const perform_path = "/general/remote-file/perform-operation.js";

export class RemoteFiles {
    #ns: ns.NS;
    #comms: Communicator;
    constructor(ns: ns.NS) {
        this.#ns = ns;
        this.#comms = new Communicator(ns);
    }

    exists(path: string, host: string) {
        return this.#ns.fileExists(path, host);
    }

    async read(path: string, host: string) {
        const port = (await this.#comms.assignFirstAvailable(1)).assignedPorts[0];
        const data: OperationData = {
            op: "read",
            path
        }
        const handle = this.#ns.getPortHandle(port);
        handle.write(JSON.stringify(data));
        this.#ns.scp(perform_path, host, "home");
        this.#ns.exec(perform_path, host, undefined, port);
        await handle.nextWrite();
        const ret_data = handle.read() as string;
        this.#comms.unassignPorts([port]);
        return ret_data;
    }

    async write(path: string, fileData: string, host: string) {
        const port = (await this.#comms.assignFirstAvailable(1)).assignedPorts[0];
        const data: OperationData = {
            op: "write",
            path,
            data: fileData
        }
        const handle = this.#ns.getPortHandle(port);
        handle.write(JSON.stringify(data));
        this.#ns.scp(perform_path, host, "home");
        this.#ns.exec(perform_path, host, undefined, port);
        await handle.nextWrite();
        handle.clear();
        this.#comms.unassignPorts([port]);
    }
}
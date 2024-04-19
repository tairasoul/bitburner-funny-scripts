import ns from "@ns"

type CreationData = {
    start: number;
    end: number;
} | {
    ports: number[];
}

export default class Multiport {
    private ports: ns.NetscriptPort[] = [];
    constructor(ns: ns.NS, data: CreationData) {
        if ("ports" in data) {
            for (const port of data.ports) {
                this.ports.push(ns.getPortHandle(port));
            }
        }
        else {
            for (let i = data.start; i <= data.end; i++) {
                this.ports.push(ns.getPortHandle(i));
            }
        }
    }

    write(data: any, portPredicate: (portNum: number, port: ns.NetscriptPort) => boolean = (_, __) => true) {
        const parsed = typeof data == "string" ? data : JSON.stringify(data);
        for (let i = 0; this.ports[i] != undefined; i++) {
            if (!this.ports[i].full() && portPredicate(i, this.ports[i])) {
                this.ports[i].write(parsed);
                break;
            }
        }
    }

    writeEmpty(data: any) {
        this.write(data, (_, port) => port.empty());
    }

    nextWrite() {
        const promises: Promise<void>[] = [];
        for (const port of this.ports) {
            promises.push(port.nextWrite());
        }
        return Promise.any(promises);
    }

    clear() {
        for (const port of this.ports)
            port.clear();
    }

    empty() {
        for (const port of this.ports) 
            if (!port.empty())
                return false;
        return true;
    }

    full() {
        for (const port of this.ports)
            if (!port.full())
                return false;
        return true;
    }

    peek(predicate: (data: any) => boolean = () => true) {
        for (const port of this.ports) {
            if (port.peek() != "NULL PORT DATA" && predicate(port.peek()))
                return port.peek();
        }
        return null;
    }

    read(predicate: (data: any) => boolean = () => true) {
        for (const port of this.ports) {
            if (port.peek() != "NULL PORT DATA" && predicate(port.peek()))
                return port.read();
        }
        return null;
    }
}
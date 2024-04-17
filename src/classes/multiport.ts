import ns from "@ns"

export default class Multiport {
    ports: ns.NetscriptPort[] = [];
    constructor(ns: ns.NS, start: number, end: number) {
        for (let i = start; i <= end; i++) {
            this.ports.push(ns.getPortHandle(i));
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

    hasItems() {
        for (const port of this.ports) 
            if (port.empty())
                return false;
        return false;
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
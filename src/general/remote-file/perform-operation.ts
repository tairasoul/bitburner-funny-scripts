import ns from "@ns";

export type OperationData = {
    op: "read";
    path: string;
} | {
    op: "write";
    path: string;
    data: string;
    mode?: "w" | "a"
}

export async function main(ns: ns.NS) {
    const port = ns.args[0] as number;
    const handle = ns.getPortHandle(port);
    const operation = JSON.parse(handle.read()) as OperationData;
    switch (operation.op) {
        case "read":
            handle.write(ns.read(operation.path));
            break;
        case "write":
            ns.write(operation.path, operation.data, operation.mode);
            handle.write(`wrote data to ${operation.path}`);
            break;
    }
}
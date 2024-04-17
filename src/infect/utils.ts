import ns from "@ns";

export type ServerInfo = {
    name: string;
    sub_servers: ServerInfo[];
}

export async function mapServers(ns: ns.NS) {
    const initialServers = ns.scan().filter((v) => !ns.getServer(v).purchasedByPlayer);
    const tree: ServerInfo[] = [];
    const visited: Set<string> = new Set();
    visited.add("home");

    for (const server of initialServers) {
        if (!visited.has(server)) {
            tree.push(await bfs(ns, server, visited));
        }
    }

    return tree;
}

type queuedItem = {
    name: string;
    parent: string | null;
}

async function bfs(ns: ns.NS, rootServer: string, visited: Set<string>) {
    const queue: queuedItem[] = [{ name: rootServer, parent: null }];
    const tree: ServerInfo = { name: rootServer, sub_servers: [] };

    // Perform BFS
    while (queue.length > 0) {
        const current = queue.shift();
        // @ts-ignore
        const scanned = await scan(ns, current.name, visited);

        for (const sub_server of scanned.sub_servers) {
            if (!visited.has(sub_server.name)) {
                // @ts-ignore
                queue.push({ name: sub_server.name, parent: current.name });
                visited.add(sub_server.name);
            }
        }

        // @ts-ignore
        const parentNode = findNode(tree, current.parent);
        if (parentNode) {
            parentNode.sub_servers.push(...scanned.sub_servers);
        } else {
            tree.sub_servers.push(...scanned.sub_servers);
        }
    }

    return tree;
}

async function scan(ns: ns.NS, server: string, visited: Set<string>) {
    const data: ServerInfo = {
        name: server,
        sub_servers: []
    };

    const sub = ns.scan(server).filter((v) => !ns.getServer(v).purchasedByPlayer);
    visited.add(server);
    for (const sub_server of sub) {
        if (!visited.has(sub_server))
            data.sub_servers.push({ name: sub_server, sub_servers: [] });
    }

    return data;
}

function findNode(tree: ServerInfo, name: string) {
    for (const node of tree.sub_servers) {
        if (node.name === name) {
            return node;
        }
    }
    return null;
}

export async function gainAccess(ns: ns.NS, server: string) {
    const brute = await tryRun(() => ns.brutessh(server));
    const ftp = await tryRun(() => ns.ftpcrack(server));
    const http = await tryRun(() => ns.httpworm(server));
    const smtp = await tryRun(() => ns.relaysmtp(server));
    const sql = await tryRun(() => ns.sqlinject(server));
    const nuke = await tryRun(() => ns.nuke(server));
    return {
        brute,
        ftp,
        http,
        smtp,
        sql,
        nuke
    }
}

async function tryRun(func: () => any) {
    try {
        await func();
        return true;
    }
    catch {
        return false;
    }
}
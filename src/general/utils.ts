import ns from "@ns";

function scan(ns: ns.NS, parent: string, server: string, list: string[]) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        list.push(child);
        
        scan(ns, server, child, list);
    }
}

export function list_servers(ns: ns.NS) {
    const list: string[] = [];
    scan(ns, '', 'home', list);
    return list;
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
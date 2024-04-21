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
    const list: string[] = ['home'];
    scan(ns, '', 'home', list);
    return list;
}

export async function gainAccess(ns: ns.NS, server: string) {
    const brute = await tryRun(() => ns.brutessh(server));
    await ns.sleep(10);
    const ftp = await tryRun(() => ns.ftpcrack(server));
    await ns.sleep(10);
    const http = await tryRun(() => ns.httpworm(server));
    await ns.sleep(10);
    const smtp = await tryRun(() => ns.relaysmtp(server));
    await ns.sleep(10);
    const sql = await tryRun(() => ns.sqlinject(server));
    await ns.sleep(10);
    const nuke = await tryRun(() => ns.nuke(server));
    await ns.sleep(10);
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
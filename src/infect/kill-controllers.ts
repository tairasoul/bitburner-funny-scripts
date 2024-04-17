import ns from "@ns";

export async function main(ns: ns.NS) {
    const locks = ns.ls("home", "/lock/controllers");
    for (const lock of locks) {
        const { server, pid } = JSON.parse(ns.read(lock)) as {server: string, pid: number};
        ns.tprint(`${server}'s controller pid: ${pid}, killing.`);
        ns.kill(pid);
        ns.killall(server);
    }
}
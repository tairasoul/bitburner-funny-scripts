function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        list.push(child);
        scan(ns, server, child, list);
    }
}
export function list_servers(ns) {
    const list = [];
    scan(ns, '', 'home', list);
    return list;
}
export async function gainAccess(ns, server) {
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
    };
}
async function tryRun(func) {
    try {
        await func();
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2VuZXJhbC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxTQUFTLElBQUksQ0FBQyxFQUFTLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFBRSxJQUFjO0lBQ25FLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsS0FBSyxJQUFJLEtBQUssSUFBSSxRQUFRLEVBQUU7UUFDeEIsSUFBSSxNQUFNLElBQUksS0FBSyxFQUFFO1lBQ2pCLFNBQVM7U0FDWjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pDO0FBQ0wsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsRUFBUztJQUNsQyxNQUFNLElBQUksR0FBYSxFQUFFLENBQUM7SUFDMUIsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNCLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLFVBQVUsQ0FBQyxFQUFTLEVBQUUsTUFBYztJQUN0RCxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNyRCxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNqRCxPQUFPO1FBQ0gsS0FBSztRQUNMLEdBQUc7UUFDSCxJQUFJO1FBQ0osSUFBSTtRQUNKLEdBQUc7UUFDSCxJQUFJO0tBQ1AsQ0FBQTtBQUNMLENBQUM7QUFFRCxLQUFLLFVBQVUsTUFBTSxDQUFDLElBQWU7SUFDakMsSUFBSTtRQUNBLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDYixPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsTUFBTTtRQUNGLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5cbmZ1bmN0aW9uIHNjYW4obnM6IG5zLk5TLCBwYXJlbnQ6IHN0cmluZywgc2VydmVyOiBzdHJpbmcsIGxpc3Q6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBucy5zY2FuKHNlcnZlcik7XG4gICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhcmVudCA9PSBjaGlsZCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgXG4gICAgICAgIHNjYW4obnMsIHNlcnZlciwgY2hpbGQsIGxpc3QpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3Rfc2VydmVycyhuczogbnMuTlMpIHtcbiAgICBjb25zdCBsaXN0OiBzdHJpbmdbXSA9IFtdO1xuICAgIHNjYW4obnMsICcnLCAnaG9tZScsIGxpc3QpO1xuICAgIHJldHVybiBsaXN0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2FpbkFjY2VzcyhuczogbnMuTlMsIHNlcnZlcjogc3RyaW5nKSB7XG4gICAgY29uc3QgYnJ1dGUgPSBhd2FpdCB0cnlSdW4oKCkgPT4gbnMuYnJ1dGVzc2goc2VydmVyKSk7XG4gICAgY29uc3QgZnRwID0gYXdhaXQgdHJ5UnVuKCgpID0+IG5zLmZ0cGNyYWNrKHNlcnZlcikpO1xuICAgIGNvbnN0IGh0dHAgPSBhd2FpdCB0cnlSdW4oKCkgPT4gbnMuaHR0cHdvcm0oc2VydmVyKSk7XG4gICAgY29uc3Qgc210cCA9IGF3YWl0IHRyeVJ1bigoKSA9PiBucy5yZWxheXNtdHAoc2VydmVyKSk7XG4gICAgY29uc3Qgc3FsID0gYXdhaXQgdHJ5UnVuKCgpID0+IG5zLnNxbGluamVjdChzZXJ2ZXIpKTtcbiAgICBjb25zdCBudWtlID0gYXdhaXQgdHJ5UnVuKCgpID0+IG5zLm51a2Uoc2VydmVyKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnJ1dGUsXG4gICAgICAgIGZ0cCxcbiAgICAgICAgaHR0cCxcbiAgICAgICAgc210cCxcbiAgICAgICAgc3FsLFxuICAgICAgICBudWtlXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiB0cnlSdW4oZnVuYzogKCkgPT4gYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZnVuYygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSJdfQ==
export async function mapServers(ns) {
    const initialServers = ns.scan().filter((v) => !ns.getServer(v).purchasedByPlayer);
    const tree = [];
    const visited = new Set();
    visited.add("home");
    for (const server of initialServers) {
        if (!visited.has(server)) {
            tree.push(await bfs(ns, server, visited));
        }
    }
    return tree;
}
async function bfs(ns, rootServer, visited) {
    const queue = [{ name: rootServer, parent: null }];
    const tree = { name: rootServer, sub_servers: [] };
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
        }
        else {
            tree.sub_servers.push(...scanned.sub_servers);
        }
    }
    return tree;
}
async function scan(ns, server, visited) {
    const data = {
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
function findNode(tree, name) {
    for (const node of tree.sub_servers) {
        if (node.name === name) {
            return node;
        }
    }
    return null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5mZWN0L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE1BQU0sQ0FBQyxLQUFLLFVBQVUsVUFBVSxDQUFDLEVBQVM7SUFDdEMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbkYsTUFBTSxJQUFJLEdBQWlCLEVBQUUsQ0FBQztJQUM5QixNQUFNLE9BQU8sR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXBCLEtBQUssTUFBTSxNQUFNLElBQUksY0FBYyxFQUFFO1FBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQzdDO0tBQ0o7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBT0QsS0FBSyxVQUFVLEdBQUcsQ0FBQyxFQUFTLEVBQUUsVUFBa0IsRUFBRSxPQUFvQjtJQUNsRSxNQUFNLEtBQUssR0FBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDakUsTUFBTSxJQUFJLEdBQWUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUUvRCxjQUFjO0lBQ2QsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNyQixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMs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R0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNyRCxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDakQsT0FBTztRQUNILEtBQUs7UUFDTCxHQUFHO1FBQ0gsSUFBSTtRQUNKLElBQUk7UUFDSixHQUFHO1FBQ0gsSUFBSTtLQUNQLENBQUE7QUFDTCxDQUFDO0FBRUQsS0FBSyxVQUFVLE1BQU0sQ0FBQyxJQUFlO0lBQ2pDLElBQUk7UUFDQSxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ2IsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE1BQU07UUFDRixPQUFPLEtBQUssQ0FBQztLQUNoQjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSBcIkBuc1wiO1xuXG5leHBvcnQgdHlwZSBTZXJ2ZXJJbmZvID0ge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBzdWJfc2VydmVyczogU2VydmVySW5mb1tdO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFwU2VydmVycyhuczogbnMuTlMpIHtcbiAgICBjb25zdCBpbml0aWFsU2VydmVycyA9IG5zLnNjYW4oKS5maWx0ZXIoKHYpID0+ICFucy5nZXRTZXJ2ZXIodikucHVyY2hhc2VkQnlQbGF5ZXIpO1xuICAgIGNvbnN0IHRyZWU6IFNlcnZlckluZm9bXSA9IFtdO1xuICAgIGNvbnN0IHZpc2l0ZWQ6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuICAgIHZpc2l0ZWQuYWRkKFwiaG9tZVwiKTtcblxuICAgIGZvciAoY29uc3Qgc2VydmVyIG9mIGluaXRpYWxTZXJ2ZXJzKSB7XG4gICAgICAgIGlmICghdmlzaXRlZC5oYXMoc2VydmVyKSkge1xuICAgICAgICAgICAgdHJlZS5wdXNoKGF3YWl0IGJmcyhucywgc2VydmVyLCB2aXNpdGVkKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJlZTtcbn1cblxudHlwZSBxdWV1ZWRJdGVtID0ge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBwYXJlbnQ6IHN0cmluZyB8IG51bGw7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJmcyhuczogbnMuTlMsIHJvb3RTZXJ2ZXI6IHN0cmluZywgdmlzaXRlZDogU2V0PHN0cmluZz4pIHtcbiAgICBjb25zdCBxdWV1ZTogcXVldWVkSXRlbVtdID0gW3sgbmFtZTogcm9vdFNlcnZlciwgcGFyZW50OiBudWxsIH1dO1xuICAgIGNvbnN0IHRyZWU6IFNlcnZlckluZm8gPSB7IG5hbWU6IHJvb3RTZXJ2ZXIsIHN1Yl9zZXJ2ZXJzOiBbXSB9O1xuXG4gICAgLy8gUGVyZm9ybSBCRlNcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBzY2FubmVkID0gYXdhaXQgc2NhbihucywgY3VycmVudC5uYW1lLCB2aXNpdGVkKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHN1Yl9zZXJ2ZXIgb2Ygc2Nhbm5lZC5zdWJfc2VydmVycykge1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkLmhhcyhzdWJfc2VydmVyLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goeyBuYW1lOiBzdWJfc2VydmVyLm5hbWUsIHBhcmVudDogY3VycmVudC5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHZpc2l0ZWQuYWRkKHN1Yl9zZXJ2ZXIubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBmaW5kTm9kZSh0cmVlLCBjdXJyZW50LnBhcmVudCk7XG4gICAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLnN1Yl9zZXJ2ZXJzLnB1c2goLi4uc2Nhbm5lZC5zdWJfc2VydmVycyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmVlLnN1Yl9zZXJ2ZXJzLnB1c2goLi4uc2Nhbm5lZC5zdWJfc2VydmVycyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJlZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2NhbihuczogbnMuTlMsIHNlcnZlcjogc3RyaW5nLCB2aXNpdGVkOiBTZXQ8c3RyaW5nPikge1xuICAgIGNvbnN0IGRhdGE6IFNlcnZlckluZm8gPSB7XG4gICAgICAgIG5hbWU6IHNlcnZlcixcbiAgICAgICAgc3ViX3NlcnZlcnM6IFtdXG4gICAgfTtcblxuICAgIGNvbnN0IHN1YiA9IG5zLnNjYW4oc2VydmVyKS5maWx0ZXIoKHYpID0+ICFucy5nZXRTZXJ2ZXIodikucHVyY2hhc2VkQnlQbGF5ZXIpO1xuICAgIHZpc2l0ZWQuYWRkKHNlcnZlcik7XG4gICAgZm9yIChjb25zdCBzdWJfc2VydmVyIG9mIHN1Yikge1xuICAgICAgICBpZiAoIXZpc2l0ZWQuaGFzKHN1Yl9zZXJ2ZXIpKVxuICAgICAgICAgICAgZGF0YS5zdWJfc2VydmVycy5wdXNoKHsgbmFtZTogc3ViX3NlcnZlciwgc3ViX3NlcnZlcnM6IFtdIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBmaW5kTm9kZSh0cmVlOiBTZXJ2ZXJJbmZvLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdHJlZS5zdWJfc2VydmVycykge1xuICAgICAgICBpZiAobm9kZS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdhaW5BY2Nlc3MobnM6IG5zLk5TLCBzZXJ2ZXI6IHN0cmluZykge1xuICAgIGNvbnN0IGJydXRlID0gYXdhaXQgdHJ5UnVuKCgpID0+IG5zLmJydXRlc3NoKHNlcnZlcikpO1xuICAgIGNvbnN0IGZ0cCA9IGF3YWl0IHRyeVJ1bigoKSA9PiBucy5mdHBjcmFjayhzZXJ2ZXIpKTtcbiAgICBjb25zdCBodHRwID0gYXdhaXQgdHJ5UnVuKCgpID0+IG5zLmh0dHB3b3JtKHNlcnZlcikpO1xuICAgIGNvbnN0IHNtdHAgPSBhd2FpdCB0cnlSdW4oKCkgPT4gbnMucmVsYXlzbXRwKHNlcnZlcikpO1xuICAgIGNvbnN0IHNxbCA9IGF3YWl0IHRyeVJ1bigoKSA9PiBucy5zcWxpbmplY3Qoc2VydmVyKSk7XG4gICAgY29uc3QgbnVrZSA9IGF3YWl0IHRyeVJ1bigoKSA9PiBucy5udWtlKHNlcnZlcikpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJydXRlLFxuICAgICAgICBmdHAsXG4gICAgICAgIGh0dHAsXG4gICAgICAgIHNtdHAsXG4gICAgICAgIHNxbCxcbiAgICAgICAgbnVrZVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gdHJ5UnVuKGZ1bmM6ICgpID0+IGFueSkge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGZ1bmMoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0iXX0=
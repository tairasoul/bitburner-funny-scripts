import Communicator from "/classes/communicator";
// requests: 1 - 100
// responses: 101 - 10000
export async function main(ns) {
    ns.disableLog("ALL");
    const comms = new Communicator(ns);
    const assigned = await comms.assignFirstAvailable(20);
    ns.tprint(assigned);
    comms.unassignPorts(assigned.assignedPorts);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sWUFBWSxNQUFNLHVCQUF1QixDQUFDO0FBRWpELG9CQUFvQjtBQUNwQix5QkFBeUI7QUFFekIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBUztJQUNoQyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5pbXBvcnQgQ29tbXVuaWNhdG9yIGZyb20gXCIvY2xhc3Nlcy9jb21tdW5pY2F0b3JcIjtcblxuLy8gcmVxdWVzdHM6IDEgLSAxMDBcbi8vIHJlc3BvbnNlczogMTAxIC0gMTAwMDBcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IG5zLk5TKSB7XG4gICAgbnMuZGlzYWJsZUxvZyhcIkFMTFwiKTtcbiAgICBjb25zdCBjb21tcyA9IG5ldyBDb21tdW5pY2F0b3IobnMpO1xuICAgIGNvbnN0IGFzc2lnbmVkID0gYXdhaXQgY29tbXMuYXNzaWduRmlyc3RBdmFpbGFibGUoMjApO1xuICAgIG5zLnRwcmludChhc3NpZ25lZCk7XG4gICAgY29tbXMudW5hc3NpZ25Qb3J0cyhhc3NpZ25lZC5hc3NpZ25lZFBvcnRzKTtcbn0iXX0=
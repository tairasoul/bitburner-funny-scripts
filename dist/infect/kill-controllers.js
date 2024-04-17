export async function main(ns) {
    const locks = ns.ls("home", "/lock/controllers");
    for (const lock of locks) {
        const { server, pid } = JSON.parse(ns.read(lock));
        ns.tprint(`${server}'s controller pid: ${pid}, killing.`);
        ns.kill(pid);
        ns.killall(server);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lsbC1jb250cm9sbGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmZlY3Qva2lsbC1jb250cm9sbGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFTO0lBQ2hDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDakQsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDdEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQWtDLENBQUM7UUFDbkYsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sc0JBQXNCLEdBQUcsWUFBWSxDQUFDLENBQUM7UUFDMUQsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdEI7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gXCJAbnNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IG5zLk5TKSB7XG4gICAgY29uc3QgbG9ja3MgPSBucy5scyhcImhvbWVcIiwgXCIvbG9jay9jb250cm9sbGVyc1wiKTtcbiAgICBmb3IgKGNvbnN0IGxvY2sgb2YgbG9ja3MpIHtcbiAgICAgICAgY29uc3QgeyBzZXJ2ZXIsIHBpZCB9ID0gSlNPTi5wYXJzZShucy5yZWFkKGxvY2spKSBhcyB7c2VydmVyOiBzdHJpbmcsIHBpZDogbnVtYmVyfTtcbiAgICAgICAgbnMudHByaW50KGAke3NlcnZlcn0ncyBjb250cm9sbGVyIHBpZDogJHtwaWR9LCBraWxsaW5nLmApO1xuICAgICAgICBucy5raWxsKHBpZCk7XG4gICAgICAgIG5zLmtpbGxhbGwoc2VydmVyKTtcbiAgICB9XG59Il19
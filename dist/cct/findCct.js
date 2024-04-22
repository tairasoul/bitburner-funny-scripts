import { list_servers } from "/general/utils";
export function getCCT(ns) {
    let servers = list_servers(ns);
    const boughtServers = ns.getPurchasedServers();
    servers = servers.filter(s => !boughtServers.includes(s));
    const hostname = servers.find(s => ns.ls(s).find(f => f.endsWith(".cct")));
    if (!hostname) {
        return null;
    }
    const cct = ns.ls(hostname).find(f => f.endsWith(".cct"));
    return {
        hostname,
        cct
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZENjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jY3QvZmluZENjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsTUFBTSxVQUFVLE1BQU0sQ0FBQyxFQUFNO0lBQ3pCLElBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUMvQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzFFLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDWCxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFXLENBQUM7SUFFcEUsT0FBTztRQUNILFFBQVE7UUFDUixHQUFHO0tBQ04sQ0FBQTtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOUyB9IGZyb20gXCJAbnNcIjtcbmltcG9ydCB7IGxpc3Rfc2VydmVycyB9IGZyb20gXCIvZ2VuZXJhbC91dGlsc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q0NUKG5zOiBOUykge1xuICAgIGxldCBzZXJ2ZXJzID0gbGlzdF9zZXJ2ZXJzKG5zKTtcbiAgICBjb25zdCBib3VnaHRTZXJ2ZXJzID0gbnMuZ2V0UHVyY2hhc2VkU2VydmVycygpO1xuICAgIHNlcnZlcnMgPSBzZXJ2ZXJzLmZpbHRlcihzID0+ICFib3VnaHRTZXJ2ZXJzLmluY2x1ZGVzKHMpKTtcbiAgICBjb25zdCBob3N0bmFtZSA9IHNlcnZlcnMuZmluZChzID0+IG5zLmxzKHMpLmZpbmQoZiA9PiBmLmVuZHNXaXRoKFwiLmNjdFwiKSkpXG4gICAgaWYgKCFob3N0bmFtZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgY2N0ID0gbnMubHMoaG9zdG5hbWUpLmZpbmQoZiA9PiBmLmVuZHNXaXRoKFwiLmNjdFwiKSkgYXMgc3RyaW5nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaG9zdG5hbWUsXG4gICAgICAgIGNjdFxuICAgIH1cbn0iXX0=
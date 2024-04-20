import { mapServers, gainAccess } from "/infect/utils.js";
import Communicator from "/service-communicators/port-registry";
let pids = 0;
let minMoneyCap = 0;
export async function main(ns) {
    minMoneyCap = parseInt(ns.args[0] ?? "150000000");
    ns.rm("controller-data/controllers.txt", "Controller-Central");
    pids = 0;
    const comms = new Communicator(ns);
    const mapped = await mapServers(ns);
    const infectedServers = new Set();
    const portsAssigned = await comms.assignFirstAvailable(1);
    const start = portsAssigned.assignedPorts[0];
    for (const server of mapped) {
        await infectServer(ns, server.name, infectedServers, start);
        await processServers(ns, server, infectedServers, start);
    }
    const elements = [];
    for (const value of infectedServers.values())
        elements.push(value);
    ns.toast(`hacked ${pids} servers!`, "info", 3000);
    ns.toast("completed processing of server list", "success", 2000);
    const portComms = ns.getPortHandle(start);
    await ns.sleep(2500);
    portComms.write(pids);
    await ns.sleep(20000);
    comms.unassignPorts([start]);
}
async function processServers(ns, map, infectedSet, commsStart) {
    for (const mapped of map.sub_servers) {
        await infectServer(ns, mapped.name, infectedSet, commsStart);
        await processServers(ns, mapped, infectedSet, commsStart);
    }
}
async function infectServer(ns, server, infectedSet, commsStart) {
    const script = "/infect/controller.js";
    const canHack = ns.getPlayer().skills.hacking >= ns.getServerRequiredHackingLevel(server);
    if (canHack) {
        const result = await gainAccess(ns, server);
        if (result.nuke) {
            const maxMoney = ns.getServerMaxMoney(server);
            if (maxMoney >= minMoneyCap) {
                ns.scp([script, "/general/multiport.js", "/service-communicators/port-registry.js", "/general/remote-file.js", "/service-communicators/ramnet.js", "/general/logs.js"], "Controller-Central", "home");
                ns.exec(script, "Controller-Central", undefined, server, commsStart);
                pids += 1;
            }
            infectedSet.add(server);
        }
        else {
            ns.tprint(`could not gain access to ${server}`);
        }
    }
    else {
        ns.tprint(`cannot hack server ${server}, hacking skill ${ns.getPlayer().skills.hacking} is lower than required hacking skill ${ns.getServerRequiredHackingLevel(server)}!`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2luZmVjdC9pbmZlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQWMsTUFBTSxrQkFBa0IsQ0FBQztBQUV0RSxPQUFPLFlBQVksTUFBTSxzQ0FBc0MsQ0FBQztBQUVoRSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFYixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFFcEIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBUztJQUNoQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFXLElBQUksV0FBVyxDQUFDLENBQUM7SUFDNUQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0lBQzlELElBQUksR0FBRyxDQUFDLENBQUM7SUFDVCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQyxNQUFNLGVBQWUsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMvQyxNQUFNLGFBQWEsR0FBRyxNQUFNLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLEtBQUssTUFBTSxNQUFNLElBQUksTUFBTSxFQUFFO1FBQ3pCLE1BQU0sWUFBWSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxNQUFNLGNBQWMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1RDtJQUNELE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNwQixLQUFLLE1BQU0sS0FBSyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEVBQUU7UUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2pELEVBQUUsQ0FBQyxLQUFLLENBQUMscUNBQXFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDekMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxLQUFLLFVBQVUsY0FBYyxDQUFDLEVBQVMsRUFBRSxHQUFlLEVBQUUsV0FBd0IsRUFBRSxVQUFrQjtJQUNsRyxLQUFLLE1BQU0sTUFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUU7UUFDbEMsTUFBTSxZQUFZLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdELE1BQU0sY0FBYyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzdEO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxZQUFZLENBQUMsRUFBUyxFQUFFLE1BQWMsRUFBRSxXQUF3QixFQUFFLFVBQWtCO0lBQy9GLE1BQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFDO0lBQ3ZDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRixJQUFJLE9BQU8sRUFBRTtRQUNULE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDYixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDN0MsSUFBSSxRQUFRLElBQUksV0FBVyxFQUFFO2dCQUN6QixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLHVCQUF1QixFQUFFLHlDQUF5QyxFQUFFLHlCQUF5QixFQUFFLGtDQUFrQyxFQUFFLGtCQUFrQixDQUFDLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLENBQUE7Z0JBQ3JNLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3JFLElBQUksSUFBSSxDQUFDLENBQUM7YUFDYjtZQUNELFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0I7YUFDSTtZQUNELEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDbkQ7S0FDSjtTQUNJO1FBQ0QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsTUFBTSxtQkFBbUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLHlDQUF5QyxFQUFFLENBQUMsNkJBQTZCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQy9LO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1hcFNlcnZlcnMsIGdhaW5BY2Nlc3MsIFNlcnZlckluZm8gfSBmcm9tIFwiL2luZmVjdC91dGlscy5qc1wiO1xuaW1wb3J0IG5zIGZyb20gXCJAbnNcIjtcbmltcG9ydCBDb21tdW5pY2F0b3IgZnJvbSBcIi9zZXJ2aWNlLWNvbW11bmljYXRvcnMvcG9ydC1yZWdpc3RyeVwiO1xuXG5sZXQgcGlkcyA9IDA7XG5cbmxldCBtaW5Nb25leUNhcCA9IDA7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKG5zOiBucy5OUykge1xuICAgIG1pbk1vbmV5Q2FwID0gcGFyc2VJbnQobnMuYXJnc1swXSBhcyBzdHJpbmcgPz8gXCIxNTAwMDAwMDBcIik7XG4gICAgbnMucm0oXCJjb250cm9sbGVyLWRhdGEvY29udHJvbGxlcnMudHh0XCIsIFwiQ29udHJvbGxlci1DZW50cmFsXCIpXG4gICAgcGlkcyA9IDA7XG4gICAgY29uc3QgY29tbXMgPSBuZXcgQ29tbXVuaWNhdG9yKG5zKTtcbiAgICBjb25zdCBtYXBwZWQgPSBhd2FpdCBtYXBTZXJ2ZXJzKG5zKTtcbiAgICBjb25zdCBpbmZlY3RlZFNlcnZlcnM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IHBvcnRzQXNzaWduZWQgPSBhd2FpdCBjb21tcy5hc3NpZ25GaXJzdEF2YWlsYWJsZSgxKTtcbiAgICBjb25zdCBzdGFydCA9IHBvcnRzQXNzaWduZWQuYXNzaWduZWRQb3J0c1swXTtcbiAgICBmb3IgKGNvbnN0IHNlcnZlciBvZiBtYXBwZWQpIHtcbiAgICAgICAgYXdhaXQgaW5mZWN0U2VydmVyKG5zLCBzZXJ2ZXIubmFtZSwgaW5mZWN0ZWRTZXJ2ZXJzLCBzdGFydCk7XG4gICAgICAgIGF3YWl0IHByb2Nlc3NTZXJ2ZXJzKG5zLCBzZXJ2ZXIsIGluZmVjdGVkU2VydmVycywgc3RhcnQpO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50cyA9IFtdO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgaW5mZWN0ZWRTZXJ2ZXJzLnZhbHVlcygpKVxuICAgICAgICBlbGVtZW50cy5wdXNoKHZhbHVlKTtcbiAgICBucy50b2FzdChgaGFja2VkICR7cGlkc30gc2VydmVycyFgLCBcImluZm9cIiwgMzAwMClcbiAgICBucy50b2FzdChcImNvbXBsZXRlZCBwcm9jZXNzaW5nIG9mIHNlcnZlciBsaXN0XCIsIFwic3VjY2Vzc1wiLCAyMDAwKTtcbiAgICBjb25zdCBwb3J0Q29tbXMgPSBucy5nZXRQb3J0SGFuZGxlKHN0YXJ0KVxuICAgIGF3YWl0IG5zLnNsZWVwKDI1MDApO1xuICAgIHBvcnRDb21tcy53cml0ZShwaWRzKTtcbiAgICBhd2FpdCBucy5zbGVlcCgyMDAwMCk7XG4gICAgY29tbXMudW5hc3NpZ25Qb3J0cyhbc3RhcnRdKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc1NlcnZlcnMobnM6IG5zLk5TLCBtYXA6IFNlcnZlckluZm8sIGluZmVjdGVkU2V0OiBTZXQ8c3RyaW5nPiwgY29tbXNTdGFydDogbnVtYmVyKSB7XG4gICAgZm9yIChjb25zdCBtYXBwZWQgb2YgbWFwLnN1Yl9zZXJ2ZXJzKSB7XG4gICAgICAgIGF3YWl0IGluZmVjdFNlcnZlcihucywgbWFwcGVkLm5hbWUsIGluZmVjdGVkU2V0LCBjb21tc1N0YXJ0KTtcbiAgICAgICAgYXdhaXQgcHJvY2Vzc1NlcnZlcnMobnMsIG1hcHBlZCwgaW5mZWN0ZWRTZXQsIGNvbW1zU3RhcnQpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5mZWN0U2VydmVyKG5zOiBucy5OUywgc2VydmVyOiBzdHJpbmcsIGluZmVjdGVkU2V0OiBTZXQ8c3RyaW5nPiwgY29tbXNTdGFydDogbnVtYmVyKSB7XG4gICAgY29uc3Qgc2NyaXB0ID0gXCIvaW5mZWN0L2NvbnRyb2xsZXIuanNcIjtcbiAgICBjb25zdCBjYW5IYWNrID0gbnMuZ2V0UGxheWVyKCkuc2tpbGxzLmhhY2tpbmcgPj0gbnMuZ2V0U2VydmVyUmVxdWlyZWRIYWNraW5nTGV2ZWwoc2VydmVyKTtcbiAgICBpZiAoY2FuSGFjaykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnYWluQWNjZXNzKG5zLCBzZXJ2ZXIpO1xuICAgICAgICBpZiAocmVzdWx0Lm51a2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1heE1vbmV5ID0gbnMuZ2V0U2VydmVyTWF4TW9uZXkoc2VydmVyKVxuICAgICAgICAgICAgaWYgKG1heE1vbmV5ID49IG1pbk1vbmV5Q2FwKSB7XG4gICAgICAgICAgICAgICAgbnMuc2NwKFtzY3JpcHQsIFwiL2dlbmVyYWwvbXVsdGlwb3J0LmpzXCIsIFwiL3NlcnZpY2UtY29tbXVuaWNhdG9ycy9wb3J0LXJlZ2lzdHJ5LmpzXCIsIFwiL2dlbmVyYWwvcmVtb3RlLWZpbGUuanNcIiwgXCIvc2VydmljZS1jb21tdW5pY2F0b3JzL3JhbW5ldC5qc1wiLCBcIi9nZW5lcmFsL2xvZ3MuanNcIl0sIFwiQ29udHJvbGxlci1DZW50cmFsXCIsIFwiaG9tZVwiKVxuICAgICAgICAgICAgICAgIG5zLmV4ZWMoc2NyaXB0LCBcIkNvbnRyb2xsZXItQ2VudHJhbFwiLCB1bmRlZmluZWQsIHNlcnZlciwgY29tbXNTdGFydCk7XG4gICAgICAgICAgICAgICAgcGlkcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5mZWN0ZWRTZXQuYWRkKHNlcnZlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBucy50cHJpbnQoYGNvdWxkIG5vdCBnYWluIGFjY2VzcyB0byAke3NlcnZlcn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbnMudHByaW50KGBjYW5ub3QgaGFjayBzZXJ2ZXIgJHtzZXJ2ZXJ9LCBoYWNraW5nIHNraWxsICR7bnMuZ2V0UGxheWVyKCkuc2tpbGxzLmhhY2tpbmd9IGlzIGxvd2VyIHRoYW4gcmVxdWlyZWQgaGFja2luZyBza2lsbCAke25zLmdldFNlcnZlclJlcXVpcmVkSGFja2luZ0xldmVsKHNlcnZlcil9IWApO1xuICAgIH1cbn0iXX0=
import RamNet from "/general/ramnet";
import Multiport from "/general/multiport";
class RamnetService {
    #ns;
    #requests;
    #responses;
    ramnet;
    constructor(ns, requests, responses) {
        this.#ns = ns;
        this.#requests = requests;
        this.#responses = responses;
        this.ramnet = new RamNet(ns);
    }
    async handleRequests() {
        while (true) {
            await this.#ns.sleep(1);
            if (!this.#requests.empty()) {
                await this.handleMessage(JSON.parse(this.#requests.read()));
            }
        }
    }
    async handleMessage(message) {
        switch (message.message) {
            case "get":
                switch (message.value) {
                    case "totalRam":
                        this.#responses.writeEmpty({
                            pid: message.pid,
                            totalRam: this.ramnet.totalRam
                        });
                        break;
                    case "maxRam":
                        this.#responses.writeEmpty({
                            pid: message.pid,
                            maxRam: this.ramnet.maxRam
                        });
                        break;
                    case "maxBlockSize":
                        this.#responses.writeEmpty({
                            pid: message.pid,
                            maxBlockSize: this.ramnet.maxBlockSize
                        });
                        break;
                    case "clone":
                        this.#responses.writeEmpty({
                            pid: message.pid,
                            clone: this.ramnet.clone
                        });
                        break;
                }
                break;
            case "assign":
                this.ramnet.assign(message.job);
                this.#responses.writeEmpty({
                    pid: message.pid,
                    result: "assignedJob",
                    jobAssigned: message.job
                });
                break;
            case "finish":
                this.ramnet.finish(message.job);
                this.#responses.writeEmpty({
                    pid: message.pid,
                    result: "finishedJob",
                    jobFinished: message.job
                });
                break;
            case "getBlock":
                this.#responses.writeEmpty({
                    pid: message.pid,
                    block: this.ramnet.getBlock(message.block)
                });
                break;
            case "hasBlock":
                this.#responses.writeEmpty({
                    pid: message.pid,
                    result: this.ramnet.hasBlock(message.block)
                });
                break;
            case "updateRamnet":
                await this.ramnet.update();
                break;
        }
    }
}
export async function main(ns) {
    ns.disableLog("ALL");
    const requests = new Multiport(ns, { start: 201, end: 300 });
    const responses = new Multiport(ns, { start: 301, end: 400 });
    const service = new RamnetService(ns, requests, responses);
    await service.ramnet.init();
    await service.handleRequests();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFtbmV0LXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvcmFtbmV0LXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxNQUFzQixNQUFNLGlCQUFpQixDQUFDO0FBQ3JELE9BQU8sU0FBUyxNQUFNLG9CQUFvQixDQUFDO0FBNkUzQyxNQUFNLGFBQWE7SUFDZixHQUFHLENBQU87SUFDVixTQUFTLENBQVk7SUFDckIsVUFBVSxDQUFZO0lBQ3RCLE1BQU0sQ0FBUztJQUNmLFlBQVksRUFBUyxFQUFFLFFBQW1CLEVBQUUsU0FBb0I7UUFDNUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYztRQUNoQixPQUFPLElBQUksRUFBRTtZQUNULE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3pCLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQy9EO1NBQ0o7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFzQjtRQUN0QyxRQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDcEIsS0FBSyxLQUFLO2dCQUNOLFFBQU8sT0FBTyxDQUFDLEtBQUssRUFBRTtvQkFDbEIsS0FBSyxVQUFVO3dCQUNYLElBQUksQ0FBQyxVQUFVLENB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LElBQUksYUFBYSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0QsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLE1BQU0sT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnMgZnJvbSBcIkBuc1wiO1xuaW1wb3J0IFJhbU5ldCwgeyBCbG9jaywgSm9iIH0gZnJvbSBcIi9nZW5lcmFsL3JhbW5ldFwiO1xuaW1wb3J0IE11bHRpcG9ydCBmcm9tIFwiL2dlbmVyYWwvbXVsdGlwb3J0XCI7XG5cbmV4cG9ydCB0eXBlIFJhbW5ldE1lc3NhZ2UgPSB7XG4gICAgcGlkOiBudW1iZXI7XG4gICAgbWVzc2FnZTogXCJnZXRcIixcbiAgICB2YWx1ZTogXCJ0b3RhbFJhbVwiIHwgXCJtYXhSYW1cIiB8IFwibWF4QmxvY2tTaXplXCIgfCBcImNsb25lXCI7XG59IHwge1xuICAgIHBpZDogbnVtYmVyO1xuICAgIG1lc3NhZ2U6IFwiYXNzaWduXCI7XG4gICAgam9iOiBKb2I7XG59IHwge1xuICAgIHBpZDogbnVtYmVyO1xuICAgIG1lc3NhZ2U6IFwiZmluaXNoXCI7XG4gICAgam9iOiBKb2I7XG59IHwge1xuICAgIHBpZDogbnVtYmVyO1xuICAgIG1lc3NhZ2U6IFwiZ2V0QmxvY2tcIjtcbiAgICBibG9jazogc3RyaW5nO1xufSB8IHtcbiAgICBwaWQ6IG51bWJlcjtcbiAgICBtZXNzYWdlOiBcImhhc0Jsb2NrXCI7XG4gICAgYmxvY2s6IHN0cmluZztcbn0gfCB7XG4gICAgbWVzc2FnZTogXCJ1cGRhdGVSYW1uZXRcIjtcbn1cblxuZXhwb3J0IHR5cGUgUmFtbmV0UmVzcG9uc2UgPSB0b3RhbFJhbVJlc3VsdFxuICAgIHwgbWF4UmFtUmVzdWx0XG4gICAgfCBtYXhCbG9ja1NpemVSZXN1bHRcbiAgICB8IGNsb25lUmVzdWx0XG4gICAgfCBhc3NpZ25Kb2JSZXN1bHRcbiAgICB8IGZpbmlzaEpvYlJlc3VsdFxuICAgIHwgZ2V0QmxvY2tSZXN1bHRcbiAgICB8IGhhc0Jsb2NrUmVzdWx0O1xuXG5leHBvcnQgdHlwZSB0b3RhbFJhbVJlc3VsdCA9IHtcbiAgICBwaWQ6IG51bWJlcjtcbiAgICB0b3RhbFJhbTogbnVtYmVyO1xufVxuXG5leHBvcnQgdHlwZSBtYXhSYW1SZXN1bHQgPSB7XG4gICAgcGlkOiBudW1iZXI7XG4gICAgbWF4UmFtOiBudW1iZXI7XG59XG5cbmV4cG9ydCB0eXBlIG1heEJsb2NrU2l6ZVJlc3VsdCA9IHtcbiAgICBwaWQ6IG51bWJlcjtcbiAgICBtYXhCbG9ja1NpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgY2xvbmVSZXN1bHQgPSB7XG4gICAgcGlkOiBudW1iZXI7XG4gICAgY2xvbmU6IEJsb2NrW107XG59XG5cbmV4cG9ydCB0eXBlIGFzc2lnbkpvYlJlc3VsdCA9IHtcbiAgICBwaWQ6IG51bWJlcjtcbiAgICByZXN1bHQ6IFwiYXNzaWduZWRKb2JcIjtcbiAgICBqb2JBc3NpZ25lZDogSm9iO1xufSBcblxuZXhwb3J0IHR5cGUgZmluaXNoSm9iUmVzdWx0ID0ge1xuICAgIHBpZDogbnVtYmVyO1xuICAgIHJlc3VsdDogXCJmaW5pc2hlZEpvYlwiO1xuICAgIGpvYkZpbmlzaGVkOiBKb2I7XG59XG5cbmV4cG9ydCB0eXBlIGdldEJsb2NrUmVzdWx0ID0ge1xuICAgIHBpZDogbnVtYmVyO1xuICAgIGJsb2NrOiBCbG9jaztcbn1cblxuZXhwb3J0IHR5cGUgaGFzQmxvY2tSZXN1bHQgPSB7XG4gICAgcGlkOiBudW1iZXI7XG4gICAgcmVzdWx0OiBib29sZWFuO1xufVxuXG5jbGFzcyBSYW1uZXRTZXJ2aWNlIHtcbiAgICAjbnM6IG5zLk5TXG4gICAgI3JlcXVlc3RzOiBNdWx0aXBvcnQ7XG4gICAgI3Jlc3BvbnNlczogTXVsdGlwb3J0O1xuICAgIHJhbW5ldDogUmFtTmV0O1xuICAgIGNvbnN0cnVjdG9yKG5zOiBucy5OUywgcmVxdWVzdHM6IE11bHRpcG9ydCwgcmVzcG9uc2VzOiBNdWx0aXBvcnQpIHtcbiAgICAgICAgdGhpcy4jbnMgPSBucztcbiAgICAgICAgdGhpcy4jcmVxdWVzdHMgPSByZXF1ZXN0cztcbiAgICAgICAgdGhpcy4jcmVzcG9uc2VzID0gcmVzcG9uc2VzO1xuICAgICAgICB0aGlzLnJhbW5ldCA9IG5ldyBSYW1OZXQobnMpO1xuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZVJlcXVlc3RzKCkge1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4jbnMuc2xlZXAoMSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuI3JlcXVlc3RzLmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmhhbmRsZU1lc3NhZ2UoSlNPTi5wYXJzZSh0aGlzLiNyZXF1ZXN0cy5yZWFkKCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZU1lc3NhZ2UobWVzc2FnZTogUmFtbmV0TWVzc2FnZSkge1xuICAgICAgICBzd2l0Y2gobWVzc2FnZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICBjYXNlIFwiZ2V0XCI6XG4gICAgICAgICAgICAgICAgc3dpdGNoKG1lc3NhZ2UudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRvdGFsUmFtXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyZXNwb25zZXMud3JpdGVFbXB0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogbWVzc2FnZS5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUmFtOiB0aGlzLnJhbW5ldC50b3RhbFJhbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibWF4UmFtXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyZXNwb25zZXMud3JpdGVFbXB0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogbWVzc2FnZS5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFJhbTogdGhpcy5yYW1uZXQubWF4UmFtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtYXhCbG9ja1NpemVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3Jlc3BvbnNlcy53cml0ZUVtcHR5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBtZXNzYWdlLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4QmxvY2tTaXplOiB0aGlzLnJhbW5ldC5tYXhCbG9ja1NpemVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNsb25lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyZXNwb25zZXMud3JpdGVFbXB0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZDogbWVzc2FnZS5waWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lOiB0aGlzLnJhbW5ldC5jbG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhc3NpZ25cIjpcbiAgICAgICAgICAgICAgICB0aGlzLnJhbW5ldC5hc3NpZ24obWVzc2FnZS5qb2IpO1xuICAgICAgICAgICAgICAgIHRoaXMuI3Jlc3BvbnNlcy53cml0ZUVtcHR5KFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IG1lc3NhZ2UucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBcImFzc2lnbmVkSm9iXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JBc3NpZ25lZDogbWVzc2FnZS5qb2JcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnJhbW5ldC5maW5pc2gobWVzc2FnZS5qb2IpO1xuICAgICAgICAgICAgICAgIHRoaXMuI3Jlc3BvbnNlcy53cml0ZUVtcHR5KFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IG1lc3NhZ2UucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBcImZpbmlzaGVkSm9iXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBqb2JGaW5pc2hlZDogbWVzc2FnZS5qb2JcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJnZXRCbG9ja1wiOlxuICAgICAgICAgICAgICAgIHRoaXMuI3Jlc3BvbnNlcy53cml0ZUVtcHR5KFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IG1lc3NhZ2UucGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IHRoaXMucmFtbmV0LmdldEJsb2NrKG1lc3NhZ2UuYmxvY2spXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiaGFzQmxvY2tcIjpcbiAgICAgICAgICAgICAgICB0aGlzLiNyZXNwb25zZXMud3JpdGVFbXB0eShcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBtZXNzYWdlLnBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogdGhpcy5yYW1uZXQuaGFzQmxvY2sobWVzc2FnZS5ibG9jaylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ1cGRhdGVSYW1uZXRcIjpcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJhbW5ldC51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IG5zLk5TKSB7XG4gICAgbnMuZGlzYWJsZUxvZyhcIkFMTFwiKTtcbiAgICBjb25zdCByZXF1ZXN0cyA9IG5ldyBNdWx0aXBvcnQobnMsIHtzdGFydDogMjAxLCBlbmQ6IDMwMH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlcyA9IG5ldyBNdWx0aXBvcnQobnMsIHtzdGFydDogMzAxLCBlbmQ6IDQwMH0pO1xuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgUmFtbmV0U2VydmljZShucywgcmVxdWVzdHMsIHJlc3BvbnNlcyk7XG4gICAgYXdhaXQgc2VydmljZS5yYW1uZXQuaW5pdCgpO1xuICAgIGF3YWl0IHNlcnZpY2UuaGFuZGxlUmVxdWVzdHMoKTtcbn0iXX0=
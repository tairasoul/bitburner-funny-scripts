import Multiport from "/general/multiport";
export default class RamnetComms {
    ns;
    requests;
    responses;
    constructor(ns) {
        this.ns = ns;
        this.requests = new Multiport(ns, { start: 201, end: 300 });
        this.responses = new Multiport(ns, { start: 301, end: 400 });
    }
    async assignJob(job) {
        this.requests.writeEmpty({
            pid: this.ns.pid,
            message: "assign",
            job
        });
        const ret = await this.AwaitResponse();
        return ret;
    }
    async finishJob(job) {
        this.requests.writeEmpty({
            pid: this.ns.pid,
            message: "finish",
            job
        });
        const ret = await this.AwaitResponse();
        return ret;
    }
    async getBlock(server) {
        this.requests.writeEmpty({
            pid: this.ns.pid,
            message: "getBlock",
            block: server
        });
        const ret = await this.AwaitResponse();
        return ret;
    }
    async hasBlock(server) {
        this.requests.writeEmpty({
            pid: this.ns.pid,
            message: "hasBlock",
            block: server
        });
        const ret = await this.AwaitResponse();
        return ret.result;
    }
    async getTotalRam() {
        return await this.get("totalRam");
    }
    async getMaxRam() {
        return await this.get("maxRam");
    }
    async getMaxBlockSize() {
        return await this.get("maxBlockSize");
    }
    async getClone() {
        return await this.get("clone");
    }
    async get(property) {
        this.requests.writeEmpty({
            pid: this.ns.pid,
            message: "get",
            value: property
        });
        const ret = await this.AwaitResponse();
        return ret;
    }
    update() {
        this.requests.writeEmpty({
            message: "updateRamnet"
        });
    }
    async AwaitResponse() {
        while (true) {
            await this.responses.nextWrite();
            if (this.responses.peek((data) => this.isForThisPID(data))) {
                return JSON.parse(this.responses.read((data) => this.isForThisPID(data)));
            }
        }
    }
    isForThisPID(data) {
        const parsed = JSON.parse(data);
        return parsed.pid == this.ns.pid;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFtbmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2UtY29tbXVuaWNhdG9ycy9yYW1uZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxTQUFTLE1BQU0sb0JBQW9CLENBQUM7QUFJM0MsTUFBTSxDQUFDLE9BQU8sT0FBTyxXQUFXO0lBQ3BCLEVBQUUsQ0FBUTtJQUNWLFFBQVEsQ0FBWTtJQUNwQixTQUFTLENBQVk7SUFDN0IsWUFBWSxFQUFTO1FBQ2pCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFRO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUNwQjtZQUNJLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUc7WUFDaEIsT0FBTyxFQUFFLFFBQVE7WUFDakIsR0FBRztTQUNOLENBQ0osQ0FBQTtRQUNELE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sR0FBc0MsQ0FBQztJQUNsRCxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFRO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUNwQjtZQUNJLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUc7WUFDaEIsT0FBTyxFQUFFLFFBQVE7WUFDakIsR0FBRztTQUNOLENBQ0osQ0FBQTtRQUNELE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sR0FBc0MsQ0FBQztJQUNsRCxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFjO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUNwQjtZQUNJLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUc7WUFDaEIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsS0FBSyxFQUFFLE1BQU07U0FDaEIsQ0FDSixDQUFBO1FBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkMsT0FBTyxHQUFxQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQWM7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQ3BCO1lBQ0ksR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRztZQUNoQixPQUFPLEVBQUUsVUFBVTtZQUNuQixLQUFLLEVBQUUsTUFBTTtTQUNoQixDQUNKLENBQUE7UUFDRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQW9DLENBQUM7UUFDekUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVztRQUNiLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBbUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVM7UUFDWCxPQUFPLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQWlDLENBQUM7SUFDcEUsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlO1FBQ2pCLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBdUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVE7UUFDVixPQUFPLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQWdDLENBQUM7SUFDbEUsQ0FBQztJQUVPLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBMEQ7UUFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQ3BCO1lBQ0ksR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRztZQUNoQixPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSxRQUFRO1NBQ2xCLENBQ0osQ0FBQTtRQUNELE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FDcEI7WUFDSSxPQUFPLEVBQUUsY0FBYztTQUMxQixDQUNKLENBQUE7SUFDTCxDQUFDO0lBRU8sS0FBSyxDQUFDLGFBQWE7UUFDdkIsT0FBTyxJQUFJLEVBQUU7WUFDVCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDaEMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUN4RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdFO1NBQ0o7SUFDTCxDQUFDO0lBRU8sWUFBWSxDQUFDLElBQVk7UUFDN0IsTUFBTSxNQUFNLEdBQW1DLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsT0FBTyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3JDLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5pbXBvcnQgTXVsdGlwb3J0IGZyb20gXCIvZ2VuZXJhbC9tdWx0aXBvcnRcIjtcbmltcG9ydCAqIGFzIFJhbW5ldFJlc3BvbnNlcyBmcm9tIFwiL3NlcnZpY2VzL3JhbW5ldC1zZXJ2aWNlXCI7XG5pbXBvcnQgeyBKb2IgfSBmcm9tIFwiL2dlbmVyYWwvcmFtbmV0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbW5ldENvbW1zIHtcbiAgICBwcml2YXRlIG5zOiBucy5OUztcbiAgICBwcml2YXRlIHJlcXVlc3RzOiBNdWx0aXBvcnQ7XG4gICAgcHJpdmF0ZSByZXNwb25zZXM6IE11bHRpcG9ydDtcbiAgICBjb25zdHJ1Y3RvcihuczogbnMuTlMpIHtcbiAgICAgICAgdGhpcy5ucyA9IG5zO1xuICAgICAgICB0aGlzLnJlcXVlc3RzID0gbmV3IE11bHRpcG9ydChucywge3N0YXJ0OiAyMDEsIGVuZDogMzAwfSk7XG4gICAgICAgIHRoaXMucmVzcG9uc2VzID0gbmV3IE11bHRpcG9ydChucywge3N0YXJ0OiAzMDEsIGVuZDogNDAwfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgYXNzaWduSm9iKGpvYjogSm9iKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMud3JpdGVFbXB0eShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMubnMucGlkLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiYXNzaWduXCIsXG4gICAgICAgICAgICAgICAgam9iXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5Bd2FpdFJlc3BvbnNlKCk7XG4gICAgICAgIHJldHVybiByZXQgYXMgUmFtbmV0UmVzcG9uc2VzLmFzc2lnbkpvYlJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBmaW5pc2hKb2Ioam9iOiBKb2IpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy53cml0ZUVtcHR5KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBpZDogdGhpcy5ucy5waWQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJmaW5pc2hcIixcbiAgICAgICAgICAgICAgICBqb2JcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLkF3YWl0UmVzcG9uc2UoKTtcbiAgICAgICAgcmV0dXJuIHJldCBhcyBSYW1uZXRSZXNwb25zZXMuZmluaXNoSm9iUmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldEJsb2NrKHNlcnZlcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMud3JpdGVFbXB0eShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMubnMucGlkLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiZ2V0QmxvY2tcIixcbiAgICAgICAgICAgICAgICBibG9jazogc2VydmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5Bd2FpdFJlc3BvbnNlKCk7XG4gICAgICAgIHJldHVybiByZXQgYXMgUmFtbmV0UmVzcG9uc2VzLmdldEJsb2NrUmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGhhc0Jsb2NrKHNlcnZlcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMud3JpdGVFbXB0eShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwaWQ6IHRoaXMubnMucGlkLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiaGFzQmxvY2tcIixcbiAgICAgICAgICAgICAgICBibG9jazogc2VydmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5Bd2FpdFJlc3BvbnNlKCkgYXMgUmFtbmV0UmVzcG9uc2VzLmhhc0Jsb2NrUmVzdWx0O1xuICAgICAgICByZXR1cm4gcmV0LnJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUb3RhbFJhbSgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0KFwidG90YWxSYW1cIikgYXMgUmFtbmV0UmVzcG9uc2VzLnRvdGFsUmFtUmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldE1heFJhbSgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0KFwibWF4UmFtXCIpIGFzIFJhbW5ldFJlc3BvbnNlcy5tYXhSYW1SZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0TWF4QmxvY2tTaXplKCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXQoXCJtYXhCbG9ja1NpemVcIikgYXMgUmFtbmV0UmVzcG9uc2VzLm1heEJsb2NrU2l6ZVJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRDbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0KFwiY2xvbmVcIikgYXMgUmFtbmV0UmVzcG9uc2VzLmNsb25lUmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0KHByb3BlcnR5OiBcInRvdGFsUmFtXCIgfCBcIm1heFJhbVwiIHwgXCJtYXhCbG9ja1NpemVcIiB8IFwiY2xvbmVcIikge1xuICAgICAgICB0aGlzLnJlcXVlc3RzLndyaXRlRW1wdHkoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGlkOiB0aGlzLm5zLnBpZCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImdldFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wZXJ0eVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuQXdhaXRSZXNwb25zZSgpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy53cml0ZUVtcHR5KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwidXBkYXRlUmFtbmV0XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgQXdhaXRSZXNwb25zZSgpIHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVzcG9uc2VzLm5leHRXcml0ZSgpXG4gICAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZXMucGVlaygoZGF0YSkgPT4gdGhpcy5pc0ZvclRoaXNQSUQoZGF0YSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5yZXNwb25zZXMucmVhZCgoZGF0YSkgPT4gdGhpcy5pc0ZvclRoaXNQSUQoZGF0YSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNGb3JUaGlzUElEKGRhdGE6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwYXJzZWQ6IFJhbW5ldFJlc3BvbnNlcy5SYW1uZXRSZXNwb25zZSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIHJldHVybiBwYXJzZWQucGlkID09IHRoaXMubnMucGlkO1xuICAgIH1cbn0iXX0=
import Multiport from "/port-registry/classes/multiport";
export default class Communicator {
    ns;
    requests;
    responses;
    constructor(ns) {
        this.ns = ns;
        this.requests = new Multiport(ns, 1, 100);
        this.responses = new Multiport(ns, 101, 200);
    }
    async assignPorts(ports) {
        const message = {
            pid: this.ns.pid,
            ports,
            request: "assign"
        };
        this.requests.writeEmpty(message);
        return await this.AwaitResponse();
    }
    unassignPorts(ports) {
        const message = {
            pid: this.ns.pid,
            ports,
            request: "unassign"
        };
        this.requests.writeEmpty(message);
    }
    async assignFirstAvailable(amount) {
        const message = {
            pid: this.ns.pid,
            request: "assignAvailable",
            portAmount: amount
        };
        this.requests.writeEmpty(message);
        return await this.AwaitResponse();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbXVuaWNhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BvcnQtcmVnaXN0cnkvY2xhc3Nlcy9jb21tdW5pY2F0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxTQUFTLE1BQU0sa0NBQWtDLENBQUM7QUFrQnpELE1BQU0sQ0FBQyxPQUFPLE9BQU8sWUFBWTtJQUNyQixFQUFFLENBQVE7SUFDVixRQUFRLENBQVk7SUFDcEIsU0FBUyxDQUFZO0lBQzdCLFlBQVksRUFBUztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBZTtRQUM3QixNQUFNLE9BQU8sR0FBbUI7WUFDNUIsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRztZQUNoQixLQUFLO1lBQ0wsT0FBTyxFQUFFLFFBQVE7U0FDcEIsQ0FBQTtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFlO1FBQ3pCLE1BQU0sT0FBTyxHQUFtQjtZQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHO1lBQ2hCLEtBQUs7WUFDTCxPQUFPLEVBQUUsVUFBVTtTQUN0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxNQUFjO1FBQ3JDLE1BQU0sT0FBTyxHQUFtQjtZQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHO1lBQ2hCLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsVUFBVSxFQUFFLE1BQU07U0FDckIsQ0FBQTtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFrQyxDQUFDO0lBQ3RFLENBQUM7SUFFTyxLQUFLLENBQUMsYUFBYTtRQUN2QixPQUFPLElBQUksRUFBRTtZQUNULE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFvQixDQUFDO2FBQ2hHO1NBQ0o7SUFDTCxDQUFDO0lBRU8sWUFBWSxDQUFDLElBQVk7UUFDN0IsTUFBTSxNQUFNLEdBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsT0FBTyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3JDLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5pbXBvcnQgTXVsdGlwb3J0IGZyb20gXCIvcG9ydC1yZWdpc3RyeS9jbGFzc2VzL211bHRpcG9ydFwiO1xuaW1wb3J0IHsgSGFuZGxlck1lc3NhZ2UgfSBmcm9tIFwiL3BvcnQtcmVnaXN0cnkvY2xhc3Nlcy9wb3J0LXJlZ2lzdHJ5XCI7XG5cbnR5cGUgUmVzcG9uc2VNZXNzYWdlID0ge1xuICAgIHBpZDogbnVtYmVyO1xuICAgIHJlc3VsdDogXCJhc3NpZ25lZFwiXG59IHwge1xuICAgIHBpZDogbnVtYmVyO1xuICAgIHJlc3VsdDogXCJjb3VsZG50IGFzc2lnblwiO1xuICAgIG93bmVkX2J5OiBudW1iZXJbXTtcbn1cblxudHlwZSBBc3NpZ25lZEF2YWlsYWJsZSA9IHtcbiAgICBwaWQ6IG51bWJlcjtcbiAgICByZXN1bHQ6IFwiYXNzaWduZWRBdmFpbGFibGVcIjtcbiAgICBhc3NpZ25lZFBvcnRzOiBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbXVuaWNhdG9yIHtcbiAgICBwcml2YXRlIG5zOiBucy5OUztcbiAgICBwcml2YXRlIHJlcXVlc3RzOiBNdWx0aXBvcnQ7XG4gICAgcHJpdmF0ZSByZXNwb25zZXM6IE11bHRpcG9ydDtcbiAgICBjb25zdHJ1Y3RvcihuczogbnMuTlMpIHtcbiAgICAgICAgdGhpcy5ucyA9IG5zO1xuICAgICAgICB0aGlzLnJlcXVlc3RzID0gbmV3IE11bHRpcG9ydChucywgMSwgMTAwKTtcbiAgICAgICAgdGhpcy5yZXNwb25zZXMgPSBuZXcgTXVsdGlwb3J0KG5zLCAxMDEsIDIwMCk7XG4gICAgfVxuXG4gICAgYXN5bmMgYXNzaWduUG9ydHMocG9ydHM6IG51bWJlcltdKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2U6IEhhbmRsZXJNZXNzYWdlID0ge1xuICAgICAgICAgICAgcGlkOiB0aGlzLm5zLnBpZCxcbiAgICAgICAgICAgIHBvcnRzLFxuICAgICAgICAgICAgcmVxdWVzdDogXCJhc3NpZ25cIlxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdHMud3JpdGVFbXB0eShtZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuQXdhaXRSZXNwb25zZSgpO1xuICAgIH1cblxuICAgIHVuYXNzaWduUG9ydHMocG9ydHM6IG51bWJlcltdKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2U6IEhhbmRsZXJNZXNzYWdlID0ge1xuICAgICAgICAgICAgcGlkOiB0aGlzLm5zLnBpZCxcbiAgICAgICAgICAgIHBvcnRzLFxuICAgICAgICAgICAgcmVxdWVzdDogXCJ1bmFzc2lnblwiXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXF1ZXN0cy53cml0ZUVtcHR5KG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGFzeW5jIGFzc2lnbkZpcnN0QXZhaWxhYmxlKGFtb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2U6IEhhbmRsZXJNZXNzYWdlID0ge1xuICAgICAgICAgICAgcGlkOiB0aGlzLm5zLnBpZCxcbiAgICAgICAgICAgIHJlcXVlc3Q6IFwiYXNzaWduQXZhaWxhYmxlXCIsXG4gICAgICAgICAgICBwb3J0QW1vdW50OiBhbW91bnRcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcXVlc3RzLndyaXRlRW1wdHkobWVzc2FnZSk7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLkF3YWl0UmVzcG9uc2UoKSBhcyB1bmtub3duIGFzIEFzc2lnbmVkQXZhaWxhYmxlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgQXdhaXRSZXNwb25zZSgpIHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVzcG9uc2VzLm5leHRXcml0ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucmVzcG9uc2VzLnBlZWsoKGRhdGEpID0+IHRoaXMuaXNGb3JUaGlzUElEKGRhdGEpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VzLnJlYWQoKGRhdGEpID0+IHRoaXMuaXNGb3JUaGlzUElEKGRhdGEpKSkgYXMgUmVzcG9uc2VNZXNzYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0ZvclRoaXNQSUQoZGF0YTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZDogUmVzcG9uc2VNZXNzYWdlID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlZC5waWQgPT0gdGhpcy5ucy5waWQ7XG4gICAgfVxufSJdfQ==
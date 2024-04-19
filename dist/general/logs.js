import { RemoteFiles } from "/general/remote-file";
export default class Logs {
    #ns;
    #files;
    #name;
    constructor(ns, name) {
        this.#ns = ns;
        this.#files = new RemoteFiles(this.#ns);
        if (name) {
            this.#name = name;
        }
        else {
            this.#name = ns.pid.toString();
        }
        ns.print(`Logs for this script can be found at /logs/${this.#name}-log.txt on the "home" server.`);
    }
    async Log(text) {
        await this.#files.write(`/logs/${this.#name}-log.txt`, "\n", "home", "a");
        await this.#files.write(`/logs/${this.#name}-log.txt`, text, "home", "a");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5lcmFsL2xvZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRW5ELE1BQU0sQ0FBQyxPQUFPLE9BQU8sSUFBSTtJQUNyQixHQUFHLENBQVE7SUFDWCxNQUFNLENBQWM7SUFDcEIsS0FBSyxDQUFTO0lBQ2QsWUFBWSxFQUFTLEVBQUUsSUFBYTtRQUNoQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLElBQUksSUFBSSxFQUFFO1lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDckI7YUFDSTtZQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNsQztRQUNELEVBQUUsQ0FBQyxLQUFLLENBQUMsOENBQThDLElBQUksQ0FBQyxLQUFLLGdDQUFnQyxDQUFDLENBQUE7SUFDdEcsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBWTtRQUNsQixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzlFLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5pbXBvcnQgeyBSZW1vdGVGaWxlcyB9IGZyb20gXCIvZ2VuZXJhbC9yZW1vdGUtZmlsZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dzIHtcbiAgICAjbnM6IG5zLk5TO1xuICAgICNmaWxlczogUmVtb3RlRmlsZXM7XG4gICAgI25hbWU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihuczogbnMuTlMsIG5hbWU/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jbnMgPSBucztcbiAgICAgICAgdGhpcy4jZmlsZXMgPSBuZXcgUmVtb3RlRmlsZXModGhpcy4jbnMpO1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy4jbmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiNuYW1lID0gbnMucGlkLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgbnMucHJpbnQoYExvZ3MgZm9yIHRoaXMgc2NyaXB0IGNhbiBiZSBmb3VuZCBhdCAvbG9ncy8ke3RoaXMuI25hbWV9LWxvZy50eHQgb24gdGhlIFwiaG9tZVwiIHNlcnZlci5gKVxuICAgIH1cblxuICAgIGFzeW5jIExvZyh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy4jZmlsZXMud3JpdGUoYC9sb2dzLyR7dGhpcy4jbmFtZX0tbG9nLnR4dGAsIFwiXFxuXCIsIFwiaG9tZVwiLCBcImFcIik7XG4gICAgICAgIGF3YWl0IHRoaXMuI2ZpbGVzLndyaXRlKGAvbG9ncy8ke3RoaXMuI25hbWV9LWxvZy50eHRgLCB0ZXh0LCBcImhvbWVcIiwgXCJhXCIpO1xuICAgIH1cbn0iXX0=
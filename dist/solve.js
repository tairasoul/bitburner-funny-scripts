import { solveCCT } from "./cct/solver";
export async function main(ns) {
    while (true) {
        await ns.sleep(1);
        const result = await solveCCT(ns);
        if (!result)
            await ns.sleep(5 * 1000);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc29sdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV4QyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFNO0lBQzdCLE9BQU8sSUFBSSxFQUFFO1FBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNO1lBQ1AsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtLQUMvQjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOUyB9IGZyb20gXCJAbnNcIjtcbmltcG9ydCB7IHNvbHZlQ0NUIH0gZnJvbSBcIi4vY2N0L3NvbHZlclwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihuczogTlMpIHtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBhd2FpdCBucy5zbGVlcCgxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc29sdmVDQ1QobnMpO1xuICAgICAgICBpZiAoIXJlc3VsdClcbiAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDUgKiAxMDAwKVxuICAgIH1cbn0iXX0=
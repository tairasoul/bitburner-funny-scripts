export async function main(ns) {
    const port = ns.args[0];
    const handle = ns.getPortHandle(port);
    const operation = handle.read();
    switch (operation.op) {
        case "read":
            handle.write(ns.read(operation.path));
            break;
        case "write":
            ns.write(operation.path, operation.data, operation.mode);
            handle.write(`wrote data to ${operation.path}`);
            break;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybS1vcGVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2VuZXJhbC9yZW1vdGUtZmlsZS9wZXJmb3JtLW9wZXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZQSxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFTO0lBQ2hDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFXLENBQUM7SUFDbEMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFtQixDQUFDO0lBQ2pELFFBQVEsU0FBUyxDQUFDLEVBQUUsRUFBRTtRQUNsQixLQUFLLE1BQU07WUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEMsTUFBTTtRQUNWLEtBQUssT0FBTztZQUNSLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNoRCxNQUFNO0tBQ2I7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gXCJAbnNcIjtcblxuZXhwb3J0IHR5cGUgT3BlcmF0aW9uRGF0YSA9IHtcbiAgICBvcDogXCJyZWFkXCI7XG4gICAgcGF0aDogc3RyaW5nO1xufSB8IHtcbiAgICBvcDogXCJ3cml0ZVwiO1xuICAgIHBhdGg6IHN0cmluZztcbiAgICBkYXRhOiBzdHJpbmc7XG4gICAgbW9kZT86IFwid1wiIHwgXCJhXCJcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IG5zLk5TKSB7XG4gICAgY29uc3QgcG9ydCA9IG5zLmFyZ3NbMF0gYXMgbnVtYmVyO1xuICAgIGNvbnN0IGhhbmRsZSA9IG5zLmdldFBvcnRIYW5kbGUocG9ydCk7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gaGFuZGxlLnJlYWQoKSBhcyBPcGVyYXRpb25EYXRhO1xuICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XG4gICAgICAgIGNhc2UgXCJyZWFkXCI6XG4gICAgICAgICAgICBoYW5kbGUud3JpdGUobnMucmVhZChvcGVyYXRpb24ucGF0aCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3cml0ZVwiOlxuICAgICAgICAgICAgbnMud3JpdGUob3BlcmF0aW9uLnBhdGgsIG9wZXJhdGlvbi5kYXRhLCBvcGVyYXRpb24ubW9kZSk7XG4gICAgICAgICAgICBoYW5kbGUud3JpdGUoYHdyb3RlIGRhdGEgdG8gJHtvcGVyYXRpb24ucGF0aH1gKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0iXX0=
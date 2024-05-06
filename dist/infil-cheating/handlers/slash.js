import { getReactKey } from "/react-handlers/get_react_key";
export async function SolveSlash(ns) {
    const doc = eval("document");
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)");
    const reactKey = getReactKey(answerElement, "Props$");
    while (true) {
        await ns.sleep(1);
        if (answerElement.querySelector(":nth-child(2)")?.textContent?.includes("Preparing"))
            break;
    }
    await ns.sleep(100);
    console.log("attacking!!");
    // @ts-ignore
    //const keyDown = answerElement[reactKey].children[5].props.onKeyDown;
    // @ts-ignore
    //const oldFailure = answerElement[reactKey].children[5].props.onFailure;
    // @ts-ignore
    /*answerElement[reactKey].children[5].props.onFailure = () => {
        oldFailure({automated: false});
    };
    const event = {
        preventDefault: () => {},
        key: " ",
        isTrusted: true
    }
    await ns.sleep(200);
    keyDown(event);*/
    const event = new KeyboardEvent("keydown", {
        key: " "
    });
    Object.defineProperty(event, 'isTrusted', { value: true });
    console.log(event);
    document.dispatchEvent(event);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhc2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5maWwtY2hlYXRpbmcvaGFuZGxlcnMvc2xhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRTVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsVUFBVSxDQUFDLEVBQU07SUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBYSxDQUFDO0lBQ3pDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0RBQXdELENBQWdCLENBQUM7SUFDakgsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RCxPQUFPLElBQUksRUFBRTtRQUNULE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixJQUFJLGFBQWEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDaEYsTUFBTTtLQUNiO0lBQ0QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDM0IsYUFBYTtJQUNiLHNFQUFzRTtJQUN0RSxhQUFhO0lBQ2IseUVBQXlFO0lBQ3pFLGFBQWE7SUFDYjs7Ozs7Ozs7O3FCQVNpQjtJQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsQ0FBQyxTQUFTLEVBQUU7UUFDdkMsR0FBRyxFQUFFLEdBQUc7S0FDWCxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5TIH0gZnJvbSBcIkBuc1wiO1xuaW1wb3J0IHsgZ2V0UmVhY3RLZXkgfSBmcm9tIFwiL3JlYWN0LWhhbmRsZXJzL2dldF9yZWFjdF9rZXlcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFNvbHZlU2xhc2gobnM6IE5TKSB7XG4gICAgY29uc3QgZG9jID0gZXZhbChcImRvY3VtZW50XCIpIGFzIERvY3VtZW50O1xuICAgIGNvbnN0IGFuc3dlckVsZW1lbnQgPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290ID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgzKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCByZWFjdEtleSA9IGdldFJlYWN0S2V5KGFuc3dlckVsZW1lbnQsIFwiUHJvcHMkXCIpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICBpZiAoYW5zd2VyRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiOm50aC1jaGlsZCgyKVwiKT8udGV4dENvbnRlbnQ/LmluY2x1ZGVzKFwiUHJlcGFyaW5nXCIpKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGF3YWl0IG5zLnNsZWVwKDEwMCk7XG4gICAgY29uc29sZS5sb2coXCJhdHRhY2tpbmchIVwiKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgLy9jb25zdCBrZXlEb3duID0gYW5zd2VyRWxlbWVudFtyZWFjdEtleV0uY2hpbGRyZW5bNV0ucHJvcHMub25LZXlEb3duO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAvL2NvbnN0IG9sZEZhaWx1cmUgPSBhbnN3ZXJFbGVtZW50W3JlYWN0S2V5XS5jaGlsZHJlbls1XS5wcm9wcy5vbkZhaWx1cmU7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8qYW5zd2VyRWxlbWVudFtyZWFjdEtleV0uY2hpbGRyZW5bNV0ucHJvcHMub25GYWlsdXJlID0gKCkgPT4ge1xuICAgICAgICBvbGRGYWlsdXJlKHthdXRvbWF0ZWQ6IGZhbHNlfSk7XG4gICAgfTtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgICAgcHJldmVudERlZmF1bHQ6ICgpID0+IHt9LFxuICAgICAgICBrZXk6IFwiIFwiLFxuICAgICAgICBpc1RydXN0ZWQ6IHRydWVcbiAgICB9XG4gICAgYXdhaXQgbnMuc2xlZXAoMjAwKTtcbiAgICBrZXlEb3duKGV2ZW50KTsqL1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoXCJrZXlkb3duXCIsIHtcbiAgICAgICAga2V5OiBcIiBcIlxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV2ZW50LCAnaXNUcnVzdGVkJywge3ZhbHVlOiB0cnVlfSk7XG4gICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufSJdfQ==
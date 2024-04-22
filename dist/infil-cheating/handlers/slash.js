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
    console.log("attacking!!");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[5].props.onKeyDown;
    const event = {
        preventDefault: () => { },
        key: " ",
        isTrusted: true,
        target: answerElement,
        currentTarget: answerElement,
        bubbles: true,
        cancelable: true
    };
    await ns.sleep(200);
    keyDown(event);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhc2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5maWwtY2hlYXRpbmcvaGFuZGxlcnMvc2xhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRTVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsVUFBVSxDQUFDLEVBQU07SUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBYSxDQUFDO0lBQ3pDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0RBQXdELENBQWdCLENBQUM7SUFDakgsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RCxPQUFPLElBQUksRUFBRTtRQUNULE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixJQUFJLGFBQWEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDaEYsTUFBTTtLQUNiO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzQixhQUFhO0lBQ2IsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ3BFLE1BQU0sS0FBSyxHQUFHO1FBQ1YsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUM7UUFDeEIsR0FBRyxFQUFFLEdBQUc7UUFDUixTQUFTLEVBQUUsSUFBSTtRQUNmLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLGFBQWEsRUFBRSxhQUFhO1FBQzVCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsVUFBVSxFQUFFLElBQUk7S0FDbkIsQ0FBQTtJQUNELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5TIH0gZnJvbSBcIkBuc1wiO1xuaW1wb3J0IHsgZ2V0UmVhY3RLZXkgfSBmcm9tIFwiL3JlYWN0LWhhbmRsZXJzL2dldF9yZWFjdF9rZXlcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFNvbHZlU2xhc2gobnM6IE5TKSB7XG4gICAgY29uc3QgZG9jID0gZXZhbChcImRvY3VtZW50XCIpIGFzIERvY3VtZW50O1xuICAgIGNvbnN0IGFuc3dlckVsZW1lbnQgPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290ID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgzKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCByZWFjdEtleSA9IGdldFJlYWN0S2V5KGFuc3dlckVsZW1lbnQsIFwiUHJvcHMkXCIpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgICAgICBpZiAoYW5zd2VyRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiOm50aC1jaGlsZCgyKVwiKT8udGV4dENvbnRlbnQ/LmluY2x1ZGVzKFwiUHJlcGFyaW5nXCIpKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiYXR0YWNraW5nISFcIik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGtleURvd24gPSBhbnN3ZXJFbGVtZW50W3JlYWN0S2V5XS5jaGlsZHJlbls1XS5wcm9wcy5vbktleURvd247XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAgIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7fSxcbiAgICAgICAga2V5OiBcIiBcIixcbiAgICAgICAgaXNUcnVzdGVkOiB0cnVlLFxuICAgICAgICB0YXJnZXQ6IGFuc3dlckVsZW1lbnQsXG4gICAgICAgIGN1cnJlbnRUYXJnZXQ6IGFuc3dlckVsZW1lbnQsXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9XG4gICAgYXdhaXQgbnMuc2xlZXAoMjAwKTtcbiAgICBrZXlEb3duKGV2ZW50KTtcbn0iXX0=
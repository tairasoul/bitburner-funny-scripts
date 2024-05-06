import { getReactKey } from "/react-handlers/get_react_key";
const arrows = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→"
};
var arrowKeys;
(function (arrowKeys) {
    arrowKeys["Up"] = "w";
    arrowKeys["Down"] = "s";
    arrowKeys["Left"] = "a";
    arrowKeys["Right"] = "d";
})(arrowKeys || (arrowKeys = {}));
export async function SolveCode(ns) {
    const doc = eval("document");
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)");
    const arrowContainer = answerElement.querySelector("div");
    const arrowSpans = arrowContainer.querySelectorAll("span");
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[2].props.onKeyDown;
    // @ts-ignore
    const oldFailure = answerElement[reactKey].children[2].props.onFailure;
    // @ts-ignore
    answerElement[reactKey].children[2].props.onFailure = () => {
        oldFailure({ automated: false });
    };
    for (let i = 1; i <= arrowSpans.length; i++) {
        const selector = `:nth-child(${i})`;
        console.log(selector);
        const arrowElement = arrowContainer.querySelector(selector);
        const text = arrowElement.textContent;
        await ns.sleep(200);
        console.log(text.trim());
        switch (text.trim()) {
            case arrows.up:
                const upEvent = {
                    preventDefault: () => { },
                    key: arrowKeys.Up,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                };
                keyDown(upEvent);
                break;
            case arrows.down:
                const downEvent = {
                    preventDefault: () => { },
                    key: arrowKeys.Down,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                };
                keyDown(downEvent);
                break;
            case arrows.left:
                const leftEvent = {
                    preventDefault: () => { },
                    key: arrowKeys.Left,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                };
                keyDown(leftEvent);
                break;
            case arrows.right:
                const rightEvent = {
                    preventDefault: () => { },
                    key: arrowKeys.Right,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                };
                keyDown(rightEvent);
                break;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbmZpbC1jaGVhdGluZy9oYW5kbGVycy9jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUU1RCxNQUFNLE1BQU0sR0FBRztJQUNYLEVBQUUsRUFBRSxHQUFHO0lBQ1AsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULEtBQUssRUFBRSxHQUFHO0NBQ2IsQ0FBQTtBQUVELElBQUssU0FLSjtBQUxELFdBQUssU0FBUztJQUNWLHFCQUFRLENBQUE7SUFDUix1QkFBVSxDQUFBO0lBQ1YsdUJBQVUsQ0FBQTtJQUNWLHdCQUFXLENBQUE7QUFDZixDQUFDLEVBTEksU0FBUyxLQUFULFNBQVMsUUFLYjtBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsU0FBUyxDQUFDLEVBQU07SUFDbEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBYSxDQUFDO0lBQ3pDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0RBQXdELENBQWdCLENBQUM7SUFDakgsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQWdCLENBQUM7SUFDekUsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEQsYUFBYTtJQUNiLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztJQUNwRSxhQUFhO0lBQ2IsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ3ZFLGFBQWE7SUFDYixhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUFFO1FBQ3ZELFVBQVUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQztJQUNGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBZ0IsQ0FBQztRQUMzRSxNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsV0FBcUIsQ0FBQztRQUNoRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNqQixLQUFLLE1BQU0sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sT0FBTyxHQUFHO29CQUNaLGNBQWMsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO29CQUN4QixHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUU7b0JBQ2pCLFNBQVMsRUFBRSxJQUFJO29CQUNmLE1BQU0sRUFBRSxhQUFhO29CQUNyQixhQUFhLEVBQUUsYUFBYTtvQkFDNUIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsVUFBVSxFQUFFLElBQUk7aUJBQ25CLENBQUE7Z0JBQ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQixNQUFNO1lBQ1YsS0FBSyxNQUFNLENBQUMsSUFBSTtnQkFDWixNQUFNLFNBQVMsR0FBRztvQkFDZCxjQUFjLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztvQkFDeEIsR0FBRyxFQUFFLFNBQVMsQ0FBQyxJQUFJO29CQUNuQixTQUFTLEVBQUUsSUFBSTtvQkFDZixNQUFNLEVBQUUsYUFBYTtvQkFDckIsYUFBYSxFQUFFLGFBQWE7b0JBQzVCLE9BQU8sRUFBRSxJQUFJO29CQUNiLFVBQVUsRUFBRSxJQUFJO2lCQUNuQixDQUFBO2dCQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDbEIsTUFBTTtZQUNWLEtBQUssTUFBTSxDQUFDLElBQUk7Z0JBQ1osTUFBTSxTQUFTLEdBQUc7b0JBQ2QsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUM7b0JBQ3hCLEdBQUcsRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDbkIsU0FBUyxFQUFFLElBQUk7b0JBQ2YsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLGFBQWEsRUFBRSxhQUFhO29CQUM1QixPQUFPLEVBQUUsSUFBSTtvQkFDYixVQUFVLEVBQUUsSUFBSTtpQkFDbkIsQ0FBQTtnQkFDRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBQ2xCLE1BQU07WUFDVixLQUFLLE1BQU0sQ0FBQyxLQUFLO2dCQUNiLE1BQU0sVUFBVSxHQUFHO29CQUNmLGNBQWMsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO29CQUN4QixHQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUs7b0JBQ3BCLFNBQVMsRUFBRSxJQUFJO29CQUNmLE1BQU0sRUFBRSxhQUFhO29CQUNyQixhQUFhLEVBQUUsYUFBYTtvQkFDNUIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsVUFBVSxFQUFFLElBQUk7aUJBQ25CLENBQUE7Z0JBQ0QsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUNuQixNQUFNO1NBQ2I7S0FDSjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOUyB9IGZyb20gXCJAbnNcIjtcbmltcG9ydCB7IGdldFJlYWN0S2V5IH0gZnJvbSBcIi9yZWFjdC1oYW5kbGVycy9nZXRfcmVhY3Rfa2V5XCI7XG5cbmNvbnN0IGFycm93cyA9IHtcbiAgICB1cDogXCLihpFcIixcbiAgICBkb3duOiBcIuKGk1wiLFxuICAgIGxlZnQ6IFwi4oaQXCIsXG4gICAgcmlnaHQ6IFwi4oaSXCJcbn1cblxuZW51bSBhcnJvd0tleXMge1xuICAgIFVwID0gXCJ3XCIsXG4gICAgRG93biA9IFwic1wiLFxuICAgIExlZnQgPSBcImFcIixcbiAgICBSaWdodCA9IFwiZFwiXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTb2x2ZUNvZGUobnM6IE5TKSB7XG4gICAgY29uc3QgZG9jID0gZXZhbChcImRvY3VtZW50XCIpIGFzIERvY3VtZW50O1xuICAgIGNvbnN0IGFuc3dlckVsZW1lbnQgPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290ID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgzKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBhcnJvd0NvbnRhaW5lciA9IGFuc3dlckVsZW1lbnQucXVlcnlTZWxlY3RvcihcImRpdlwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBhcnJvd1NwYW5zID0gYXJyb3dDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XG4gICAgY29uc3QgcmVhY3RLZXkgPSBnZXRSZWFjdEtleShhbnN3ZXJFbGVtZW50LCBcIlByb3BzJFwiKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qga2V5RG93biA9IGFuc3dlckVsZW1lbnRbcmVhY3RLZXldLmNoaWxkcmVuWzJdLnByb3BzLm9uS2V5RG93bjtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgb2xkRmFpbHVyZSA9IGFuc3dlckVsZW1lbnRbcmVhY3RLZXldLmNoaWxkcmVuWzJdLnByb3BzLm9uRmFpbHVyZTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYW5zd2VyRWxlbWVudFtyZWFjdEtleV0uY2hpbGRyZW5bMl0ucHJvcHMub25GYWlsdXJlID0gKCkgPT4ge1xuICAgICAgICBvbGRGYWlsdXJlKHthdXRvbWF0ZWQ6IGZhbHNlfSk7XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBhcnJvd1NwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gYDpudGgtY2hpbGQoJHtpfSlgO1xuICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3Rvcik7XG4gICAgICAgIGNvbnN0IGFycm93RWxlbWVudCA9IGFycm93Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBjb25zdCB0ZXh0ID0gYXJyb3dFbGVtZW50LnRleHRDb250ZW50IGFzIHN0cmluZztcbiAgICAgICAgYXdhaXQgbnMuc2xlZXAoMjAwKTtcbiAgICAgICAgY29uc29sZS5sb2codGV4dC50cmltKCkpO1xuICAgICAgICBzd2l0Y2ggKHRleHQudHJpbSgpKSB7XG4gICAgICAgICAgICBjYXNlIGFycm93cy51cDpcbiAgICAgICAgICAgICAgICBjb25zdCB1cEV2ZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdDogKCkgPT4ge30sXG4gICAgICAgICAgICAgICAgICAgIGtleTogYXJyb3dLZXlzLlVwLFxuICAgICAgICAgICAgICAgICAgICBpc1RydXN0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogYW5zd2VyRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhcmdldDogYW5zd2VyRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrZXlEb3duKHVwRXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBhcnJvd3MuZG93bjpcbiAgICAgICAgICAgICAgICBjb25zdCBkb3duRXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7fSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBhcnJvd0tleXMuRG93bixcbiAgICAgICAgICAgICAgICAgICAgaXNUcnVzdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGFuc3dlckVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IGFuc3dlckVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga2V5RG93bihkb3duRXZlbnQpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGFycm93cy5sZWZ0OlxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRFdmVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmVudERlZmF1bHQ6ICgpID0+IHt9LFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGFycm93S2V5cy5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBpc1RydXN0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogYW5zd2VyRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhcmdldDogYW5zd2VyRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrZXlEb3duKGxlZnRFdmVudClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYXJyb3dzLnJpZ2h0OlxuICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0RXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7fSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBhcnJvd0tleXMuUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGlzVHJ1c3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGtleURvd24ocmlnaHRFdmVudClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=
import { getReactKey } from "/react-handlers/get_react_key";
export async function SolveBribe(ns) {
    const positive = [
        "affectionate",
        "agreeable",
        "bright",
        "charming",
        "creative",
        "determined",
        "energetic",
        "friendly",
        "funny",
        "generous",
        "polite",
        "likable",
        "diplomatic",
        "helpful",
        "giving",
        "kind",
        "hardworking",
        "patient",
        "dynamic",
        "loyal",
        "straightforward",
    ];
    const doc = eval("document");
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)");
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const oldFailure = answerElement[reactKey].children[1].props.onFailure;
    // @ts-ignore
    answerElement[reactKey].children[1].props.onFailure = () => {
        oldFailure({ automated: false });
    };
    while (true) {
        await ns.sleep(300);
        // @ts-ignore
        const keyDown = answerElement[reactKey].children[1].props.onKeyDown;
        const text = answerElement.querySelector(":nth-child(3)")?.textContent;
        console.log(text);
        if (positive.includes(text)) {
            const event = {
                preventDefault: () => { },
                key: " ",
                isTrusted: true,
                target: answerElement,
                currentTarget: answerElement,
                bubbles: true,
                cancelable: true
            };
            keyDown(event);
            break;
        }
        await ns.sleep(300);
        const event = {
            preventDefault: () => { },
            key: "w",
            isTrusted: true,
            target: answerElement,
            currentTarget: answerElement,
            bubbles: true,
            cancelable: true
        };
        console.log(event);
        keyDown(event);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpYmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5maWwtY2hlYXRpbmcvaGFuZGxlcnMvYnJpYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRzVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsVUFBVSxDQUFDLEVBQU07SUFDbkMsTUFBTSxRQUFRLEdBQUc7UUFDYixjQUFjO1FBQ2QsV0FBVztRQUNYLFFBQVE7UUFDUixVQUFVO1FBQ1YsVUFBVTtRQUNWLFlBQVk7UUFDWixXQUFXO1FBQ1gsVUFBVTtRQUNWLE9BQU87UUFDUCxVQUFVO1FBQ1YsUUFBUTtRQUNSLFNBQVM7UUFDVCxZQUFZO1FBQ1osU0FBUztRQUNULFFBQVE7UUFDUixNQUFNO1FBQ04sYUFBYTtRQUNiLFNBQVM7UUFDVCxTQUFTO1FBQ1QsT0FBTztRQUNQLGlCQUFpQjtLQUNwQixDQUFDO0lBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBYSxDQUFDO0lBQ3pDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0RBQXdELENBQWdCLENBQUM7SUFDakgsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNyRCxhQUFhO0lBQ2IsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ3ZFLGFBQWE7SUFDYixhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUFFO1FBQ3ZELFVBQVUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQztJQUNGLE9BQU8sSUFBSSxFQUFFO1FBQ1QsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLGFBQWE7UUFDYixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDcEUsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsRUFBRSxXQUFxQixDQUFDO1FBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sS0FBSyxHQUFHO2dCQUNWLGNBQWMsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO2dCQUN4QixHQUFHLEVBQUUsR0FBRztnQkFDUixTQUFTLEVBQUUsSUFBSTtnQkFDZixNQUFNLEVBQUUsYUFBYTtnQkFDckIsYUFBYSxFQUFFLGFBQWE7Z0JBQzVCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFVBQVUsRUFBRSxJQUFJO2FBQ25CLENBQUE7WUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDZixNQUFNO1NBQ1Q7UUFDRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsTUFBTSxLQUFLLEdBQUc7WUFDVixjQUFjLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztZQUN4QixHQUFHLEVBQUUsR0FBRztZQUNSLFNBQVMsRUFBRSxJQUFJO1lBQ2YsTUFBTSxFQUFFLGFBQWE7WUFDckIsYUFBYSxFQUFFLGFBQWE7WUFDNUIsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUUsSUFBSTtTQUNuQixDQUFBO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEI7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0UmVhY3RLZXkgfSBmcm9tIFwiL3JlYWN0LWhhbmRsZXJzL2dldF9yZWFjdF9rZXlcIjtcbmltcG9ydCB7IE5TIH0gZnJvbSBcIkBuc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gU29sdmVCcmliZShuczogTlMpIHtcbiAgICBjb25zdCBwb3NpdGl2ZSA9IFtcbiAgICAgICAgXCJhZmZlY3Rpb25hdGVcIixcbiAgICAgICAgXCJhZ3JlZWFibGVcIixcbiAgICAgICAgXCJicmlnaHRcIixcbiAgICAgICAgXCJjaGFybWluZ1wiLFxuICAgICAgICBcImNyZWF0aXZlXCIsXG4gICAgICAgIFwiZGV0ZXJtaW5lZFwiLFxuICAgICAgICBcImVuZXJnZXRpY1wiLFxuICAgICAgICBcImZyaWVuZGx5XCIsXG4gICAgICAgIFwiZnVubnlcIixcbiAgICAgICAgXCJnZW5lcm91c1wiLFxuICAgICAgICBcInBvbGl0ZVwiLFxuICAgICAgICBcImxpa2FibGVcIixcbiAgICAgICAgXCJkaXBsb21hdGljXCIsXG4gICAgICAgIFwiaGVscGZ1bFwiLFxuICAgICAgICBcImdpdmluZ1wiLFxuICAgICAgICBcImtpbmRcIixcbiAgICAgICAgXCJoYXJkd29ya2luZ1wiLFxuICAgICAgICBcInBhdGllbnRcIixcbiAgICAgICAgXCJkeW5hbWljXCIsXG4gICAgICAgIFwibG95YWxcIixcbiAgICAgICAgXCJzdHJhaWdodGZvcndhcmRcIixcbiAgICBdO1xuICAgIGNvbnN0IGRvYyA9IGV2YWwoXCJkb2N1bWVudFwiKSBhcyBEb2N1bWVudDtcbiAgICBjb25zdCBhbnN3ZXJFbGVtZW50ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdCA+IGRpdiA+IGRpdiA+IGRpdjpudGgtY2hpbGQoMylcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgcmVhY3RLZXkgPSBnZXRSZWFjdEtleShhbnN3ZXJFbGVtZW50LCBcIlByb3BzJFwiKVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBvbGRGYWlsdXJlID0gYW5zd2VyRWxlbWVudFtyZWFjdEtleV0uY2hpbGRyZW5bMV0ucHJvcHMub25GYWlsdXJlO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhbnN3ZXJFbGVtZW50W3JlYWN0S2V5XS5jaGlsZHJlblsxXS5wcm9wcy5vbkZhaWx1cmUgPSAoKSA9PiB7XG4gICAgICAgIG9sZEZhaWx1cmUoe2F1dG9tYXRlZDogZmFsc2V9KTtcbiAgICB9O1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDMwMCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29uc3Qga2V5RG93biA9IGFuc3dlckVsZW1lbnRbcmVhY3RLZXldLmNoaWxkcmVuWzFdLnByb3BzLm9uS2V5RG93bjtcbiAgICAgICAgY29uc3QgdGV4dCA9IGFuc3dlckVsZW1lbnQucXVlcnlTZWxlY3RvcihcIjpudGgtY2hpbGQoMylcIik/LnRleHRDb250ZW50IGFzIHN0cmluZztcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgICAgIGlmIChwb3NpdGl2ZS5pbmNsdWRlcyh0ZXh0KSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgcHJldmVudERlZmF1bHQ6ICgpID0+IHt9LFxuICAgICAgICAgICAgICAgIGtleTogXCIgXCIsXG4gICAgICAgICAgICAgICAgaXNUcnVzdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRhcmdldDogYW5zd2VyRWxlbWVudCxcbiAgICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5RG93bihldmVudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBucy5zbGVlcCgzMDApO1xuICAgICAgICBjb25zdCBldmVudCA9IHtcbiAgICAgICAgICAgIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7fSxcbiAgICAgICAgICAgIGtleTogXCJ3XCIsXG4gICAgICAgICAgICBpc1RydXN0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0YXJnZXQ6IGFuc3dlckVsZW1lbnQsXG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICAgIGtleURvd24oZXZlbnQpO1xuICAgIH1cbn0iXX0=
import { SolveBackwards } from "/infil-cheating/handlers/backwards";
import { SolveBracket } from "/infil-cheating/handlers/bracket";
import { SolveBribe } from "/infil-cheating/handlers/bribe";
import { SolveCode } from "/infil-cheating/handlers/code";
import { SolveMinefield } from "/infil-cheating/handlers/minefield";
import { SolveSlash } from "/infil-cheating/handlers/slash";
import { SolveSymbols } from "/infil-cheating/handlers/symbols";
import { SolveWires } from "/infil-cheating/handlers/wire";
const associations = {
    "Close the brackets": SolveBracket,
    "Attack when his guard is down!": SolveSlash,
    "Type it": SolveBackwards,
    "Remember all the mines!": SolveMinefield,
    "Say something nice about the guard": SolveBribe,
    "Enter the Code!": SolveCode,
    "Cut the wires": SolveWires,
    "Match the symbols!": SolveSymbols
};
function clickBypassed(element) {
    const propsName = Object.keys(element).find((v) => v.startsWith("__reactProps$"));
    // @ts-ignore
    const click = element[propsName].onClick;
    const event = {
        target: element,
        currentTarget: element,
        bubbles: true,
        cancelable: true,
        type: 'click',
        isTrusted: true
    };
    // @ts-ignore
    click(event);
}
function extractNumberFromString(str) {
    const numericStr = str.replace(/\D/g, '');
    const number = parseInt(numericStr);
    return number;
}
export async function main(ns) {
    const company = ns.args.join(" ");
    const doc = eval("document");
    const divsWithRoleButton = doc.querySelectorAll('div[role="button"]');
    divsWithRoleButton.forEach(div => {
        if (Array.from(div.querySelectorAll('*')).some(element => element.textContent?.includes('City'))) {
            div.click();
        }
    });
    await ns.sleep(1000);
    const cityWindow = doc.querySelector("#root > div.MuiBox-root > div:nth-child(2)");
    const companyElement = Array.from(cityWindow.querySelectorAll(`span`)).find((elem) => elem.ariaLabel == company);
    companyElement?.click();
    await ns.sleep(1000);
    const companyWindow = doc.querySelector("#root > div.MuiBox-root > div:nth-child(2)");
    const button = companyWindow.querySelector(":nth-child(3) > button");
    clickBypassed(button);
    await ns.sleep(1000);
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(2)");
    const start = answerElement.querySelector("div > button:nth-child(1)");
    start.click();
    while (doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(2) > h4") != null)
        await ns.sleep(1);
    while (true) {
        const InfiltrationType = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3) > h4").textContent?.trim();
        console.log(InfiltrationType);
        const associatedName = Object.keys(associations).find((v) => InfiltrationType.startsWith(v));
        console.log(associatedName);
        // @ts-ignore
        const associatedFunction = associations[associatedName];
        await associatedFunction(ns);
        const text = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(1) > h5")?.textContent;
        if (text) {
            const split = text.split(" / ");
            const split1 = split[0];
            const split2 = split[1];
            const num1 = extractNumberFromString(split1);
            const num2 = extractNumberFromString(split2);
            if (num1 == num2)
                break;
        }
        else
            break;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5maWx0cmF0ZS1jb21wYW55LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2luZmlsLWNoZWF0aW5nL2luZmlsdHJhdGUtY29tcGFueS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM1RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM1RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDaEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRzNELE1BQU0sWUFBWSxHQUFHO0lBQ2pCLG9CQUFvQixFQUFFLFlBQVk7SUFDbEMsZ0NBQWdDLEVBQUUsVUFBVTtJQUM1QyxTQUFTLEVBQUUsY0FBYztJQUN6Qix5QkFBeUIsRUFBRSxjQUFjO0lBQ3pDLG9DQUFvQyxFQUFFLFVBQVU7SUFDaEQsaUJBQWlCLEVBQUUsU0FBUztJQUM1QixlQUFlLEVBQUUsVUFBVTtJQUMzQixvQkFBb0IsRUFBRSxZQUFZO0NBQ3JDLENBQUE7QUFFRCxTQUFTLGFBQWEsQ0FBQyxPQUFvQjtJQUN2QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBVyxDQUFDO0lBQzVGLGFBQWE7SUFDYixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFBO0lBQ3hDLE1BQU0sS0FBSyxHQUFHO1FBQ1YsTUFBTSxFQUFFLE9BQU87UUFDZixhQUFhLEVBQUUsT0FBTztRQUN0QixPQUFPLEVBQUUsSUFBSTtRQUNiLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLElBQUksRUFBRSxPQUFPO1FBQ2IsU0FBUyxFQUFFLElBQUk7S0FDbEIsQ0FBQztJQUNGLGFBQWE7SUFDYixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakIsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsR0FBVztJQUN4QyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEMsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQU07SUFDN0IsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLENBQUM7SUFDNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBYSxDQUFDO0lBQ3pDLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFFdEUsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO1lBQzdGLEdBQW1CLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDaEM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUVwQixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDRDQUE0QyxDQUFnQixDQUFDO0lBQ2xHLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ2pILGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUN4QixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFcEIsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsQ0FBZ0IsQ0FBQztJQUNyRyxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFnQixDQUFDO0lBQ3BGLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDcEIsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3REFBd0QsQ0FBZ0IsQ0FBQztJQUNqSCxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFnQixDQUFDO0lBQ3RGLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNkLE9BQVEsR0FBRyxDQUFDLGFBQWEsQ0FBQyw2REFBNkQsQ0FBaUIsSUFBSSxJQUFJO1FBQzVHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixPQUFPLElBQUksRUFBRTtRQUNULE1BQU0sZ0JBQWdCLEdBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyw2REFBNkQsQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFZLENBQUM7UUFDekosT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQVcsQ0FBQztRQUN2RyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzNCLGFBQWE7UUFDYixNQUFNLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN2RCxNQUFNLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsNkRBQTZELENBQUMsRUFBRSxXQUFxQixDQUFDO1FBQ3JILElBQUksSUFBSSxFQUFDO1lBQ0wsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxHQUFHLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLE1BQU0sSUFBSSxHQUFHLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBQ1osTUFBTTtTQUNiOztZQUVHLE1BQU07S0FDYjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTb2x2ZUJhY2t3YXJkcyB9IGZyb20gXCIvaW5maWwtY2hlYXRpbmcvaGFuZGxlcnMvYmFja3dhcmRzXCI7XG5pbXBvcnQgeyBTb2x2ZUJyYWNrZXQgfSBmcm9tIFwiL2luZmlsLWNoZWF0aW5nL2hhbmRsZXJzL2JyYWNrZXRcIjtcbmltcG9ydCB7IFNvbHZlQnJpYmUgfSBmcm9tIFwiL2luZmlsLWNoZWF0aW5nL2hhbmRsZXJzL2JyaWJlXCI7XG5pbXBvcnQgeyBTb2x2ZUNvZGUgfSBmcm9tIFwiL2luZmlsLWNoZWF0aW5nL2hhbmRsZXJzL2NvZGVcIjtcbmltcG9ydCB7IFNvbHZlTWluZWZpZWxkIH0gZnJvbSBcIi9pbmZpbC1jaGVhdGluZy9oYW5kbGVycy9taW5lZmllbGRcIjtcbmltcG9ydCB7IFNvbHZlU2xhc2ggfSBmcm9tIFwiL2luZmlsLWNoZWF0aW5nL2hhbmRsZXJzL3NsYXNoXCI7XG5pbXBvcnQgeyBTb2x2ZVN5bWJvbHMgfSBmcm9tIFwiL2luZmlsLWNoZWF0aW5nL2hhbmRsZXJzL3N5bWJvbHNcIjtcbmltcG9ydCB7IFNvbHZlV2lyZXMgfSBmcm9tIFwiL2luZmlsLWNoZWF0aW5nL2hhbmRsZXJzL3dpcmVcIjtcbmltcG9ydCB7IE5TIH0gZnJvbSBcIkBuc1wiO1xuXG5jb25zdCBhc3NvY2lhdGlvbnMgPSB7XG4gICAgXCJDbG9zZSB0aGUgYnJhY2tldHNcIjogU29sdmVCcmFja2V0LFxuICAgIFwiQXR0YWNrIHdoZW4gaGlzIGd1YXJkIGlzIGRvd24hXCI6IFNvbHZlU2xhc2gsXG4gICAgXCJUeXBlIGl0XCI6IFNvbHZlQmFja3dhcmRzLFxuICAgIFwiUmVtZW1iZXIgYWxsIHRoZSBtaW5lcyFcIjogU29sdmVNaW5lZmllbGQsXG4gICAgXCJTYXkgc29tZXRoaW5nIG5pY2UgYWJvdXQgdGhlIGd1YXJkXCI6IFNvbHZlQnJpYmUsXG4gICAgXCJFbnRlciB0aGUgQ29kZSFcIjogU29sdmVDb2RlLFxuICAgIFwiQ3V0IHRoZSB3aXJlc1wiOiBTb2x2ZVdpcmVzLFxuICAgIFwiTWF0Y2ggdGhlIHN5bWJvbHMhXCI6IFNvbHZlU3ltYm9sc1xufVxuXG5mdW5jdGlvbiBjbGlja0J5cGFzc2VkKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcHJvcHNOYW1lID0gT2JqZWN0LmtleXMoZWxlbWVudCkuZmluZCgodikgPT4gdi5zdGFydHNXaXRoKFwiX19yZWFjdFByb3BzJFwiKSkgYXMgc3RyaW5nO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjbGljayA9IGVsZW1lbnRbcHJvcHNOYW1lXS5vbkNsaWNrXG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAgIHRhcmdldDogZWxlbWVudCxcbiAgICAgICAgY3VycmVudFRhcmdldDogZWxlbWVudCxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ2NsaWNrJyxcbiAgICAgICAgaXNUcnVzdGVkOiB0cnVlXG4gICAgfTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY2xpY2soZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0TnVtYmVyRnJvbVN0cmluZyhzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IG51bWVyaWNTdHIgPSBzdHIucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICBjb25zdCBudW1iZXIgPSBwYXJzZUludChudW1lcmljU3RyKTtcbiAgICByZXR1cm4gbnVtYmVyO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihuczogTlMpIHtcbiAgICBjb25zdCBjb21wYW55ID0gbnMuYXJncy5qb2luKFwiIFwiKSBhcyBzdHJpbmc7XG4gICAgY29uc3QgZG9jID0gZXZhbChcImRvY3VtZW50XCIpIGFzIERvY3VtZW50O1xuICAgIGNvbnN0IGRpdnNXaXRoUm9sZUJ1dHRvbiA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKCdkaXZbcm9sZT1cImJ1dHRvblwiXScpO1xuXG4gICAgZGl2c1dpdGhSb2xlQnV0dG9uLmZvckVhY2goZGl2ID0+IHtcbiAgICAgICAgaWYgKEFycmF5LmZyb20oZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSkuc29tZShlbGVtZW50ID0+IGVsZW1lbnQudGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdDaXR5JykpKSB7XG4gICAgICAgICAgICAoZGl2IGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhd2FpdCBucy5zbGVlcCgxMDAwKVxuXG4gICAgY29uc3QgY2l0eVdpbmRvdyA9IGRvYy5xdWVyeVNlbGVjdG9yKFwiI3Jvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXY6bnRoLWNoaWxkKDIpXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGNvbXBhbnlFbGVtZW50ID0gQXJyYXkuZnJvbShjaXR5V2luZG93LnF1ZXJ5U2VsZWN0b3JBbGwoYHNwYW5gKSkuZmluZCgoZWxlbSkgPT4gZWxlbS5hcmlhTGFiZWwgPT0gY29tcGFueSk7XG4gICAgY29tcGFueUVsZW1lbnQ/LmNsaWNrKCk7XG4gICAgYXdhaXQgbnMuc2xlZXAoMTAwMClcblxuICAgIGNvbnN0IGNvbXBhbnlXaW5kb3cgPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290ID4gZGl2Om50aC1jaGlsZCgyKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBidXR0b24gPSBjb21wYW55V2luZG93LnF1ZXJ5U2VsZWN0b3IoXCI6bnRoLWNoaWxkKDMpID4gYnV0dG9uXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNsaWNrQnlwYXNzZWQoYnV0dG9uKTtcbiAgICBhd2FpdCBucy5zbGVlcCgxMDAwKVxuICAgIGNvbnN0IGFuc3dlckVsZW1lbnQgPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290ID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgyKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBzdGFydCA9IGFuc3dlckVsZW1lbnQucXVlcnlTZWxlY3RvcihcImRpdiA+IGJ1dHRvbjpudGgtY2hpbGQoMSlcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgc3RhcnQuY2xpY2soKTtcbiAgICB3aGlsZSAoKGRvYy5xdWVyeVNlbGVjdG9yKFwiI3Jvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXYgPiBkaXYgPiBkaXY6bnRoLWNoaWxkKDIpID4gaDRcIikgYXMgSFRNTEVsZW1lbnQpICE9IG51bGwpXG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDEpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IEluZmlsdHJhdGlvblR5cGUgPSAoZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdCA+IGRpdiA+IGRpdiA+IGRpdjpudGgtY2hpbGQoMykgPiBoNFwiKSBhcyBIVE1MRWxlbWVudCkudGV4dENvbnRlbnQ/LnRyaW0oKSBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKEluZmlsdHJhdGlvblR5cGUpO1xuICAgICAgICBjb25zdCBhc3NvY2lhdGVkTmFtZSA9IE9iamVjdC5rZXlzKGFzc29jaWF0aW9ucykuZmluZCgodikgPT4gSW5maWx0cmF0aW9uVHlwZS5zdGFydHNXaXRoKHYpKSBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKGFzc29jaWF0ZWROYW1lKVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGFzc29jaWF0ZWRGdW5jdGlvbiA9IGFzc29jaWF0aW9uc1thc3NvY2lhdGVkTmFtZV1cbiAgICAgICAgYXdhaXQgYXNzb2NpYXRlZEZ1bmN0aW9uKG5zKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvYy5xdWVyeVNlbGVjdG9yKFwiI3Jvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXYgPiBkaXYgPiBkaXY6bnRoLWNoaWxkKDEpID4gaDVcIik/LnRleHRDb250ZW50IGFzIHN0cmluZztcbiAgICAgICAgaWYgKHRleHQpe1xuICAgICAgICAgICAgY29uc3Qgc3BsaXQgPSB0ZXh0LnNwbGl0KFwiIC8gXCIpO1xuICAgICAgICAgICAgY29uc3Qgc3BsaXQxID0gc3BsaXRbMF07XG4gICAgICAgICAgICBjb25zdCBzcGxpdDIgPSBzcGxpdFsxXTtcbiAgICAgICAgICAgIGNvbnN0IG51bTEgPSBleHRyYWN0TnVtYmVyRnJvbVN0cmluZyhzcGxpdDEpO1xuICAgICAgICAgICAgY29uc3QgbnVtMiA9IGV4dHJhY3ROdW1iZXJGcm9tU3RyaW5nKHNwbGl0Mik7XG4gICAgICAgICAgICBpZiAobnVtMSA9PSBudW0yKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0iXX0=
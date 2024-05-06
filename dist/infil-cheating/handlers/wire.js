import { getReactKey } from "/react-handlers/get_react_key";
function extractNumberFromString(str) {
    const numericStr = str.replace(/\D/g, '');
    const number = parseInt(numericStr);
    return number;
}
export async function SolveWires(ns) {
    const doc = eval("document");
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)");
    const wireContainer = answerElement.querySelector("div");
    const params = Array.from(answerElement.querySelectorAll('p')).filter(p => p.parentNode === answerElement);
    ;
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[3].props.onKeyDown;
    const wireElements = {};
    const wires = wireContainer.querySelectorAll("p");
    let wireMax = 0;
    for (const wire of wires) {
        const textContent = wire.textContent;
        if (textContent && !isNaN(parseInt(textContent))) {
            wireMax++;
        }
    }
    let wireNum = 0;
    let pastFirstRow = false;
    for (const wire of wires) {
        wireNum++;
        if (!pastFirstRow) {
            if (wireNum > wireMax) {
                pastFirstRow = true;
                wireNum = 0;
            }
            wireElements[wireNum.toString()] = [];
        }
        if (wireNum > wireMax) {
            pastFirstRow = true;
            wireNum = 0;
        }
        if (wireElements[wireNum.toString()] == undefined)
            wireElements[wireNum.toString()] = [];
        wireElements[wireNum.toString()].push(wire);
    }
    await ns.sleep(50);
    console.log(wireElements);
    for (const param of params) {
        await ns.sleep(50);
        const text = param.textContent;
        console.log(text);
        if (text.includes("number")) {
            const num = extractNumberFromString(text);
            const input = {
                preventDefault: () => { },
                key: num.toString(),
                isTrusted: true,
                target: answerElement,
                currentTarget: answerElement,
                bubbles: true,
                cancelable: true
            };
            keyDown(input);
            continue;
        }
        if (text.includes("colored")) {
            const split = text.split(" ");
            const colorName = split[split.length - 1].replace(".", "");
            const color = colorName == "red" ? "red" : colorName == "yellow" ? "rgb(255, 193, 7)" : colorName == "blue" ? "blue" : "white";
            for (const wireNum of Object.keys(wireElements)) {
                for (const wire of wireElements[wireNum]) {
                    if (wire.style.color == color) {
                        const input = {
                            preventDefault: () => { },
                            key: wireNum,
                            isTrusted: true,
                            target: answerElement,
                            currentTarget: answerElement,
                            bubbles: true,
                            cancelable: true
                        };
                        keyDown(input);
                        continue;
                    }
                }
            }
            continue;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbmZpbC1jaGVhdGluZy9oYW5kbGVycy93aXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUU1RCxTQUFTLHVCQUF1QixDQUFDLEdBQVc7SUFDeEMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLFVBQVUsQ0FBQyxFQUFNO0lBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQWEsQ0FBQztJQUN6QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHdEQUF3RCxDQUFnQixDQUFDO0lBQ2pILE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFnQixDQUFDO0lBQ3hFLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxhQUFhLENBQUMsQ0FBQztJQUFBLENBQUM7SUFDNUcsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RCxhQUFhO0lBQ2IsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ3BFLE1BQU0sWUFBWSxHQUFtQyxFQUFFLENBQUM7SUFDeEQsTUFB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LE9BQU8sQ0FBQTtZQUM5SCxLQUFLLE1BQU0sT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzdDLEtBQUssTUFBTSxJQUFJLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUN0QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssRUFBRTt3QkFDM0IsTUFBTSxLQUFLLEdBQUc7NEJBQ1YsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUM7NEJBQ3hCLEdBQUcsRUFBRSxPQUFPOzRCQUNaLFNBQVMsRUFBRSxJQUFJOzRCQUNmLE1BQU0sRUFBRSxhQUFhOzRCQUNyQixhQUFhLEVBQUUsYUFBYTs0QkFDNUIsT0FBTyxFQUFFLElBQUk7NEJBQ2IsVUFBVSxFQUFFLElBQUk7eUJBQ25CLENBQUE7d0JBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNmLFNBQVM7cUJBQ1o7aUJBQ0o7YUFDSjtZQUNELFNBQVM7U0FDWjtLQUNKO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5TIH0gZnJvbSBcIkBuc1wiO1xuaW1wb3J0IHsgZ2V0UmVhY3RLZXkgfSBmcm9tIFwiL3JlYWN0LWhhbmRsZXJzL2dldF9yZWFjdF9rZXlcIjtcblxuZnVuY3Rpb24gZXh0cmFjdE51bWJlckZyb21TdHJpbmcoc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBudW1lcmljU3RyID0gc3RyLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgY29uc3QgbnVtYmVyID0gcGFyc2VJbnQobnVtZXJpY1N0cik7XG4gICAgcmV0dXJuIG51bWJlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFNvbHZlV2lyZXMobnM6IE5TKSB7XG4gICAgY29uc3QgZG9jID0gZXZhbChcImRvY3VtZW50XCIpIGFzIERvY3VtZW50O1xuICAgIGNvbnN0IGFuc3dlckVsZW1lbnQgPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290ID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgzKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCB3aXJlQ29udGFpbmVyID0gYW5zd2VyRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IHBhcmFtcyA9IEFycmF5LmZyb20oYW5zd2VyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwJykpLmZpbHRlcihwID0+IHAucGFyZW50Tm9kZSA9PT0gYW5zd2VyRWxlbWVudCk7O1xuICAgIGNvbnN0IHJlYWN0S2V5ID0gZ2V0UmVhY3RLZXkoYW5zd2VyRWxlbWVudCwgXCJQcm9wcyRcIik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGtleURvd24gPSBhbnN3ZXJFbGVtZW50W3JlYWN0S2V5XS5jaGlsZHJlblszXS5wcm9wcy5vbktleURvd247XG4gICAgY29uc3Qgd2lyZUVsZW1lbnRzOiB7W251bTogc3RyaW5nXTogSFRNTEVsZW1lbnRbXX0gPSB7fTtcbiAgICBjb25zdCB3aXJlcyA9IHdpcmVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcInBcIikgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gICAgbGV0IHdpcmVNYXggPSAwO1xuICAgIGZvciAoY29uc3Qgd2lyZSBvZiB3aXJlcykge1xuICAgICAgICBjb25zdCB0ZXh0Q29udGVudCA9IHdpcmUudGV4dENvbnRlbnQgYXMgc3RyaW5nO1xuICAgICAgICBpZiAodGV4dENvbnRlbnQgJiYgIWlzTmFOKHBhcnNlSW50KHRleHRDb250ZW50KSkpIHtcbiAgICAgICAgICAgIHdpcmVNYXgrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgd2lyZU51bSA9IDA7XG4gICAgbGV0IHBhc3RGaXJzdFJvdyA9IGZhbHNlO1xuICAgIGZvciAoY29uc3Qgd2lyZSBvZiB3aXJlcykge1xuICAgICAgICB3aXJlTnVtKys7XG4gICAgICAgIGlmICghcGFzdEZpcnN0Um93KSB7XG4gICAgICAgICAgICBpZiAod2lyZU51bSA+IHdpcmVNYXgpIHtcbiAgICAgICAgICAgICAgICBwYXN0Rmlyc3RSb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdpcmVOdW0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2lyZUVsZW1lbnRzW3dpcmVOdW0udG9TdHJpbmcoKV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2lyZU51bSA+IHdpcmVNYXgpIHtcbiAgICAgICAgICAgIHBhc3RGaXJzdFJvdyA9IHRydWU7XG4gICAgICAgICAgICB3aXJlTnVtID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2lyZUVsZW1lbnRzW3dpcmVOdW0udG9TdHJpbmcoKV0gPT0gdW5kZWZpbmVkKSB3aXJlRWxlbWVudHNbd2lyZU51bS50b1N0cmluZygpXSA9IFtdO1xuICAgICAgICB3aXJlRWxlbWVudHNbd2lyZU51bS50b1N0cmluZygpXS5wdXNoKHdpcmUpO1xuICAgIH1cbiAgICBhd2FpdCBucy5zbGVlcCg1MCk7XG4gICAgY29uc29sZS5sb2cod2lyZUVsZW1lbnRzKTtcbiAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIHBhcmFtcykge1xuICAgICAgICBhd2FpdCBucy5zbGVlcCg1MCk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBwYXJhbS50ZXh0Q29udGVudCBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgICAgICBpZiAodGV4dC5pbmNsdWRlcyhcIm51bWJlclwiKSkge1xuICAgICAgICAgICAgY29uc3QgbnVtID0gZXh0cmFjdE51bWJlckZyb21TdHJpbmcodGV4dCk7XG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IHtcbiAgICAgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdDogKCkgPT4ge30sXG4gICAgICAgICAgICAgICAga2V5OiBudW0udG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBpc1RydXN0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IGFuc3dlckVsZW1lbnQsXG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXlEb3duKGlucHV0KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0LmluY2x1ZGVzKFwiY29sb3JlZFwiKSkge1xuICAgICAgICAgICAgY29uc3Qgc3BsaXQgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yTmFtZSA9IHNwbGl0W3NwbGl0Lmxlbmd0aCAtIDFdLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBjb2xvck5hbWUgPT0gXCJyZWRcIiA/IFwicmVkXCIgOiBjb2xvck5hbWUgPT0gXCJ5ZWxsb3dcIiA/IFwicmdiKDI1NSwgMTkzLCA3KVwiIDogY29sb3JOYW1lID09IFwiYmx1ZVwiID8gXCJibHVlXCIgOiBcIndoaXRlXCJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd2lyZU51bSBvZiBPYmplY3Qua2V5cyh3aXJlRWxlbWVudHMpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3aXJlIG9mIHdpcmVFbGVtZW50c1t3aXJlTnVtXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5zdHlsZS5jb2xvciA9PSBjb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudERlZmF1bHQ6ICgpID0+IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogd2lyZU51bSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1RydXN0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IGFuc3dlckVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlEb3duKGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG59Il19
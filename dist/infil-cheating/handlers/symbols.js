import { getReactKey } from "/react-handlers/get_react_key";
var sizes;
(function (sizes) {
    sizes[sizes["Smallest"] = 9] = "Smallest";
    sizes[sizes["Small"] = 16] = "Small";
    sizes[sizes["Medium"] = 25] = "Medium";
    sizes[sizes["Large"] = 36] = "Large";
})(sizes || (sizes = {}));
function turnIntoGrid(items) {
    const size = getSize(items);
    if (size != undefined) {
        return createGrid(items, size);
    }
    throw new Error(`Could not turn array of length ${items.length} into grid.`);
}
function createGrid(items, size) {
    const grid = [];
    const limit = size == sizes.Smallest ? 3 : size == sizes.Small ? 4 : size == sizes.Medium ? 5 : 6;
    console.log(limit);
    let index = 0;
    for (let i = 0; i < limit; i++) {
        grid.push([]);
        for (let j = 0; j < limit; j++) {
            grid[i].push(items[index]);
            index++;
        }
    }
    return grid;
}
function generateInstructions(currentPosition, targetPosition) {
    const instructions = [];
    let [currentRow, currentColumn] = currentPosition;
    const [targetRow, targetColumn] = targetPosition;
    while (currentRow !== targetRow || currentColumn !== targetColumn) {
        if (currentRow < targetRow) {
            instructions.push("s");
            currentRow++;
        }
        else if (currentRow > targetRow) {
            instructions.push("w");
            currentRow--;
        }
        if (currentColumn < targetColumn) {
            instructions.push("d");
            currentColumn++;
        }
        else if (currentColumn > targetColumn) {
            instructions.push("a");
            currentColumn--;
        }
    }
    instructions.push(" ");
    return instructions;
}
function getSize(items) {
    if (items.length == 6 * 6)
        return sizes.Large;
    if (items.length == 5 * 5)
        return sizes.Medium;
    if (items.length == 4 * 4)
        return sizes.Small;
    if (items.length == 3 * 3)
        return sizes.Smallest;
    return;
}
function findTarget(grid, target) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].textContent === target) {
                return [i, j];
            }
        }
    }
    return null;
}
export async function SolveSymbols(ns) {
    const doc = eval("document");
    const answerElement = doc.querySelector("#root > div.MuiBox-root > div > div > div:nth-child(3)");
    const targetElement = answerElement.querySelector("h5");
    const targets = targetElement.querySelectorAll("span");
    const symbolContainer = answerElement.querySelector("div");
    const symbols = symbolContainer.querySelectorAll("p");
    const grid = turnIntoGrid(Array.from(symbols));
    const reactKey = getReactKey(answerElement, "Props$");
    // @ts-ignore
    const keyDown = answerElement[reactKey].children[4].props.onKeyDown;
    let currentRow = 0;
    let currentColumn = 0;
    for (const target of targets) {
        await ns.sleep(200);
        const targetString = target.textContent.trim();
        const targetCoords = findTarget(grid, targetString);
        console.log(targetString);
        console.log(targetCoords);
        if (targetCoords) {
            const instructions = generateInstructions([currentRow, currentColumn], targetCoords);
            console.log([currentColumn, currentRow], targetCoords, instructions);
            currentRow = targetCoords[1];
            currentColumn = targetCoords[0];
            for (const instruction of instructions) {
                await ns.sleep(150);
                const event = {
                    preventDefault: () => { },
                    key: instruction,
                    isTrusted: true,
                    target: answerElement,
                    currentTarget: answerElement,
                    bubbles: true,
                    cancelable: true
                };
                keyDown(event);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbmZpbC1jaGVhdGluZy9oYW5kbGVycy9zeW1ib2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUU1RCxJQUFLLEtBS0o7QUFMRCxXQUFLLEtBQUs7SUFDTix5Q0FBYyxDQUFBO0lBQ2Qsb0NBQVcsQ0FBQTtJQUNYLHNDQUFZLENBQUE7SUFDWixvQ0FBVyxDQUFBO0FBQ2YsQ0FBQyxFQUxJLEtBQUssS0FBTCxLQUFLLFFBS1Q7QUFFRCxTQUFTLFlBQVksQ0FBSSxLQUFVO0lBQy9CLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixJQUFJLElBQUksSUFBSSxTQUFTLEVBQUU7UUFDbkIsT0FBTyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2pDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsS0FBSyxDQUFDLE1BQU0sYUFBYSxDQUFDLENBQUM7QUFDakYsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFJLEtBQVUsRUFBRSxJQUFXO0lBQzFDLE1BQU0sSUFBSSxHQUFVLEVBQUUsQ0FBQztJQUN2QixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDakcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxLQUFLLElBQUksQ0FB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QkFBb0IsQ0FBQyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNyRSxVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLGFBQWEsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsS0FBSyxNQUFNLFdBQVcsSUFBSSxZQUFZLEVBQUU7Z0JBQ3BDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxLQUFLLEdBQUc7b0JBQ1YsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUM7b0JBQ3hCLEdBQUcsRUFBRSxXQUFXO29CQUNoQixTQUFTLEVBQUUsSUFBSTtvQkFDZixNQUFNLEVBQUUsYUFBYTtvQkFDckIsYUFBYSxFQUFFLGFBQWE7b0JBQzVCLE9BQU8sRUFBRSxJQUFJO29CQUNiLFVBQVUsRUFBRSxJQUFJO2lCQUNuQixDQUFBO2dCQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQjtTQUNKO0tBQ0o7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTlMgfSBmcm9tIFwiQG5zXCI7XG5pbXBvcnQgeyBnZXRSZWFjdEtleSB9IGZyb20gXCIvcmVhY3QtaGFuZGxlcnMvZ2V0X3JlYWN0X2tleVwiO1xuXG5lbnVtIHNpemVzIHtcbiAgICBTbWFsbGVzdCA9IDMqMyxcbiAgICBTbWFsbCA9IDQqNCxcbiAgICBNZWRpdW0gPSA1KjUsXG4gICAgTGFyZ2UgPSA2KjZcbn1cblxuZnVuY3Rpb24gdHVybkludG9HcmlkPFQ+KGl0ZW1zOiBUW10pIHtcbiAgICBjb25zdCBzaXplID0gZ2V0U2l6ZShpdGVtcyk7XG4gICAgaWYgKHNpemUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVHcmlkKGl0ZW1zLCBzaXplKVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCB0dXJuIGFycmF5IG9mIGxlbmd0aCAke2l0ZW1zLmxlbmd0aH0gaW50byBncmlkLmApO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHcmlkPFQ+KGl0ZW1zOiBUW10sIHNpemU6IHNpemVzKTogVFtdW10ge1xuICAgIGNvbnN0IGdyaWQ6IFRbXVtdID0gW107XG4gICAgY29uc3QgbGltaXQgPSBzaXplID09IHNpemVzLlNtYWxsZXN0ID8gMyA6IHNpemUgPT0gc2l6ZXMuU21hbGwgPyA0IDogc2l6ZSA9PSBzaXplcy5NZWRpdW0gPyA1IDogNlxuICAgIGNvbnNvbGUubG9nKGxpbWl0KTtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXQ7IGkrKykge1xuICAgICAgICBncmlkLnB1c2goW10pO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxpbWl0OyBqKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0ucHVzaChpdGVtc1tpbmRleF0pO1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ3JpZDtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlSW5zdHJ1Y3Rpb25zKGN1cnJlbnRQb3NpdGlvbjogW251bWJlciwgbnVtYmVyXSwgdGFyZ2V0UG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0pOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgaW5zdHJ1Y3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBbY3VycmVudFJvdywgY3VycmVudENvbHVtbl0gPSBjdXJyZW50UG9zaXRpb247XG4gICAgY29uc3QgW3RhcmdldFJvdywgdGFyZ2V0Q29sdW1uXSA9IHRhcmdldFBvc2l0aW9uO1xuXG4gICAgd2hpbGUgKGN1cnJlbnRSb3cgIT09IHRhcmdldFJvdyB8fCBjdXJyZW50Q29sdW1uICE9PSB0YXJnZXRDb2x1bW4pIHtcbiAgICAgICAgaWYgKGN1cnJlbnRSb3cgPCB0YXJnZXRSb3cpIHtcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFwic1wiKTtcbiAgICAgICAgICAgIGN1cnJlbnRSb3crKztcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50Um93ID4gdGFyZ2V0Um93KSB7XG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcIndcIik7XG4gICAgICAgICAgICBjdXJyZW50Um93LS07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudENvbHVtbiA8IHRhcmdldENvbHVtbikge1xuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXCJkXCIpO1xuICAgICAgICAgICAgY3VycmVudENvbHVtbisrO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRDb2x1bW4gPiB0YXJnZXRDb2x1bW4pIHtcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFwiYVwiKTtcbiAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4tLTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluc3RydWN0aW9ucy5wdXNoKFwiIFwiKTtcblxuICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGdldFNpemUoaXRlbXM6IGFueVtdKSB7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PSA2KjYpXG4gICAgICAgIHJldHVybiBzaXplcy5MYXJnZTtcbiAgICBpZiAoaXRlbXMubGVuZ3RoID09IDUqNSlcbiAgICAgICAgcmV0dXJuIHNpemVzLk1lZGl1bTtcbiAgICBpZiAoaXRlbXMubGVuZ3RoID09IDQqNClcbiAgICAgICAgcmV0dXJuIHNpemVzLlNtYWxsO1xuICAgIGlmIChpdGVtcy5sZW5ndGggPT0gMyozKVxuICAgICAgICByZXR1cm4gc2l6ZXMuU21hbGxlc3Q7XG4gICAgcmV0dXJuO1xufVxuXG5mdW5jdGlvbiBmaW5kVGFyZ2V0PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZ3JpZDogVFtdW10sIHRhcmdldDogc3RyaW5nKTogW251bWJlciwgbnVtYmVyXSB8IG51bGwge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyaWRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChncmlkW2ldW2pdLnRleHRDb250ZW50ID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2ksIGpdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gU29sdmVTeW1ib2xzKG5zOiBOUykge1xuICAgIGNvbnN0IGRvYyA9IGV2YWwoXCJkb2N1bWVudFwiKSBhcyBEb2N1bWVudDtcbiAgICBjb25zdCBhbnN3ZXJFbGVtZW50ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdCA+IGRpdiA+IGRpdiA+IGRpdjpudGgtY2hpbGQoMylcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGFuc3dlckVsZW1lbnQucXVlcnlTZWxlY3RvcihcImg1XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IHRhcmdldHMgPSB0YXJnZXRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xuICAgIGNvbnN0IHN5bWJvbENvbnRhaW5lciA9IGFuc3dlckVsZW1lbnQucXVlcnlTZWxlY3RvcihcImRpdlwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBzeW1ib2xzID0gc3ltYm9sQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJwXCIpO1xuICAgIGNvbnN0IGdyaWQgPSB0dXJuSW50b0dyaWQoQXJyYXkuZnJvbShzeW1ib2xzKSk7XG4gICAgY29uc3QgcmVhY3RLZXkgPSBnZXRSZWFjdEtleShhbnN3ZXJFbGVtZW50LCBcIlByb3BzJFwiKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qga2V5RG93biA9IGFuc3dlckVsZW1lbnRbcmVhY3RLZXldLmNoaWxkcmVuWzRdLnByb3BzLm9uS2V5RG93bjtcblxuICAgIGxldCBjdXJyZW50Um93ID0gMDtcbiAgICBsZXQgY3VycmVudENvbHVtbiA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDIwMClcbiAgICAgICAgY29uc3QgdGFyZ2V0U3RyaW5nID0gKHRhcmdldC50ZXh0Q29udGVudCBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Q29vcmRzID0gZmluZFRhcmdldChncmlkLCB0YXJnZXRTdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRTdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRDb29yZHMpO1xuICAgICAgICBpZiAodGFyZ2V0Q29vcmRzKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBnZW5lcmF0ZUluc3RydWN0aW9ucyhbY3VycmVudFJvdywgY3VycmVudENvbHVtbl0sIHRhcmdldENvb3Jkcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhbY3VycmVudENvbHVtbiwgY3VycmVudFJvd10sIHRhcmdldENvb3JkcywgaW5zdHJ1Y3Rpb25zKTtcbiAgICAgICAgICAgIGN1cnJlbnRSb3cgPSB0YXJnZXRDb29yZHNbMV07XG4gICAgICAgICAgICBjdXJyZW50Q29sdW1uID0gdGFyZ2V0Q29vcmRzWzBdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpbnN0cnVjdGlvbiBvZiBpbnN0cnVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCgxNTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdDogKCkgPT4ge30sXG4gICAgICAgICAgICAgICAgICAgIGtleTogaW5zdHJ1Y3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGlzVHJ1c3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiBhbnN3ZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGtleURvd24oZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==
// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function twoColorGraph(data: Array<any>) {
    const nodes: Array<number>[] = new Array(data[0]).fill(0).map(() => [])
    for (const e of data[1]) {
        nodes[e[0]].push(e[1])
        nodes[e[1]].push(e[0])
    }
    const solution = new Array(data[0]).fill(undefined)
    let oddCycleFound = false
    const traverse = (index: number, color: number) => {
        if (oddCycleFound) {
            return
        }
        if (solution[index] === color) {
            return
        }
        if (solution[index] === (color ^ 1)) {
            oddCycleFound = true
            return
        }
        solution[index] = color
        for (const n of nodes[index]) {
            traverse(n, color ^ 1)
        }
    }

    while (!oddCycleFound && solution.some(e => e === undefined)) {
        traverse(solution.indexOf(undefined), 0)
    }
    if (oddCycleFound) return "[]";
    return solution
}
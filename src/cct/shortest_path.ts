// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function ShortestPath(data: any) {
    //slightly adapted and simplified to get rid of MinHeap usage, and construct a valid path from potential candidates   
        //MinHeap replaced by simple array acting as queue (breadth first search)  
        const width = data[0].length;
        const height = data.length;
        const dstY = height - 1;
        const dstX = width - 1;

        const distance = new Array(height);
        //const prev: [[number, number] | undefined][] = new Array(height);
        const queue = [];

        for (let y = 0; y < height; y++) {
            distance[y] = new Array(width).fill(Infinity);
            //prev[y] = new Array(width).fill(undefined) as [undefined];
        }
        // @ts-ignore
        function validPosition(y, x) {
            return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
        }

        // List in-bounds and passable neighbors
        // @ts-ignore
        function* neighbors(y, x) {
            if (validPosition(y - 1, x)) yield [y - 1, x]; // Up
            if (validPosition(y + 1, x)) yield [y + 1, x]; // Down
            if (validPosition(y, x - 1)) yield [y, x - 1]; // Left
            if (validPosition(y, x + 1)) yield [y, x + 1]; // Right
        }

        // Prepare starting point
        distance[0][0] = 0;

        //## Original version
        // queue.push([0, 0], 0);
        // // Take next-nearest position and expand potential paths from there
        // while (queue.size > 0) {
        //   const [y, x] = queue.pop() as [number, number];
        //   for (const [yN, xN] of neighbors(y, x)) {
        //     const d = distance[y][x] + 1;
        //     if (d < distance[yN][xN]) {
        //       if (distance[yN][xN] == Infinity)
        //         // Not reached previously
        //         queue.push([yN, xN], d);
        //       // Found a shorter path
        //       else queue.changeWeight(([yQ, xQ]) => yQ == yN && xQ == xN, d);
        //       //prev[yN][xN] = [y, x];
        //       distance[yN][xN] = d;
        //     }
        //   }
        // }

        //Simplified version. d < distance[yN][xN] should never happen for BFS if d != infinity, so we skip changeweight and simplify implementation
        //algo always expands shortest path, distance != infinity means a <= lenght path reaches it, only remaining case to solve is infinity    
        queue.push([0, 0]);
        while (queue.length > 0) {
            // @ts-ignore
            const [y, x] = queue.shift()
            for (const [yN, xN] of neighbors(y, x)) {
                if (distance[yN][xN] == Infinity) {
                    queue.push([yN, xN])
                    distance[yN][xN] = distance[y][x] + 1
                }
            }
        }

        // No path at all?
        if (distance[dstY][dstX] == Infinity) return "";

        //trace a path back to start
        let path = ""
        let [yC, xC] = [dstY, dstX]
        while (xC != 0 || yC != 0) {
            const dist = distance[yC][xC];
            for (const [yF, xF] of neighbors(yC, xC)) {
                if (distance[yF][xF] == dist - 1) {
                    path = (xC == xF ? (yC == yF + 1 ? "D" : "U") : (xC == xF + 1 ? "R" : "L")) + path;
                    [yC, xC] = [yF, xF]
                    break
                }
            }
        }

        return path;
}
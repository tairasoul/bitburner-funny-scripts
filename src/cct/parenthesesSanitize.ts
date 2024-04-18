export function sanitizeParentheses(data: string) {
        let left = 0
        let right = 0
        const res: string[] = []
        for (let i = 0; i < data.length; ++i) {
            if (data[i] === '(') {
                ++left
            } else if (data[i] === ')') {
                left > 0 ? --left : ++right
            }
        }

        function dfs(pair: number, index: number, left: number, right: number, s: string, solution: string, res: string[]) {
            if (s.length === index) {
                if (left === 0 && right === 0 && pair === 0) {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i] === solution) {
                            return
                        }
                    }
                    res.push(solution)
                }
                return
            }
            if (s[index] === '(') {
                if (left > 0) {
                    dfs(pair, index + 1, left - 1, right, s, solution, res)
                }
                dfs(pair + 1, index + 1, left, right, s, solution + s[index], res)
            } else if (s[index] === ')') {
                if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res)
                if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res)
            } else {
                dfs(pair, index + 1, left, right, s, solution + s[index], res)
            }
        }
        dfs(0, 0, left, right, data, '', res)

        return res
}
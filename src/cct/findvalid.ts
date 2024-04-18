// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function findValid(data: any) {
    const num = data[0]
    const target = data[1]

    // @ts-ignore
    function helper(res, path, num, target, pos, evaluated, multed) {
        if (pos === num.length) {
            if (target === evaluated) {
                res.push(path)
            }
            return
        }
        for (let i = pos; i < num.length; ++i) {
            if (i != pos && num[pos] == '0') {
                break
            }
            const cur = parseInt(num.substring(pos, i + 1))
            if (pos === 0) {
                helper(res, path + cur, num, target, i + 1, cur, cur)
            } else {
                helper(res, path + '+' + cur, num, target, i + 1, evaluated + cur, cur)
                helper(res, path + '-' + cur, num, target, i + 1, evaluated - cur, -cur)
                helper(res, path + '*' + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur)
            }
        }
    }

    if (num == null || num.length === 0) {
        return []
    }
    // @ts-ignore
    const result = []
    // @ts-ignore
    helper(result, '', num, target, 0, 0, 0)
    // @ts-ignore
    return result
}
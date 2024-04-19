// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function stock1(data: any) {
    let maxCur = 0
    let maxSoFar = 0
    for (let i = 1; i < data.length; ++i) {
        maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]))
        maxSoFar = Math.max(maxCur, maxSoFar)
    }
    return maxSoFar.toString()
}

export function stock2(data: any) {
    let profit = 0
    for (let p = 1; p < data.length; ++p) {
        profit += Math.max(data[p] - data[p - 1], 0)
    }
    return profit.toString()
}

export function stock3(data: any) {
    let hold1 = Number.MIN_SAFE_INTEGER
    let hold2 = Number.MIN_SAFE_INTEGER
    let release1 = 0
    let release2 = 0
    for (const price of data) {
        release2 = Math.max(release2, hold2 + price)
        hold2 = Math.max(hold2, release1 - price)
        release1 = Math.max(release1, hold1 + price)
        hold1 = Math.max(hold1, price * -1)
    }
    return release2.toString()
}

export function stock4(data: any) {
    const k = data[0]
    const prices = data[1]
    const len = prices.length
    if (len < 2) {
        return 0
    }
    if (k > len / 2) {
        let res = 0
        for (let i = 1; i < len; ++i) {
            res += Math.max(prices[i] - prices[i - 1], 0)
        }
        return res
    }
    const hold = []
    const rele = []
    hold.length = k + 1
    rele.length = k + 1
    for (let i = 0; i <= k; ++i) {
        hold[i] = Number.MIN_SAFE_INTEGER
        rele[i] = 0
    }
    let cur
    for (let i = 0; i < len; ++i) {
        cur = prices[i]
        for (let j = k; j > 0; --j) {
            rele[j] = Math.max(rele[j], hold[j] + cur)
            hold[j] = Math.max(hold[j], rele[j - 1] - cur)
        }
    }
    return rele[k]
}
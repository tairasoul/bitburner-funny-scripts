export function totalSums(n: number) {
    const dp: number[] = new Array(n + 1).fill(0);
    dp[0] = 1;

    for (let i = 1; i < n; i++) {
        for (let j = i; j <= n; j++) {
            dp[j] += dp[j - i];
        }
    }

    return dp[n];
}

// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function totalSums2(data: any) {
    const n = data[0];
    const s = data[1];
    const ways = [1];
    ways.length = n + 1;
    ways.fill(0, 1);
    for (let i = 0; i < s.length; i++) {
        for (let j = s[i]; j <= n; j++) {
            ways[j] += ways[j - s[i]];
        }
    }
    return ways[n];
}
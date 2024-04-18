export function maxProfit(maxTransactions: number, prices: number[]) {
    const n = prices.length;
    if (n <= 1 || maxTransactions === 0) return 0;

    if (maxTransactions >= n / 2) {
        let maxProfit = 0;
        for (let i = 1; i < n; i++) {
            if (prices[i] > prices[i - 1]) {
                maxProfit += prices[i] - prices[i - 1];
            }
        }
        return maxProfit;
    }

    const dp: number[][] = new Array(maxTransactions + 1).fill(0).map(() => new Array(n).fill(0));

    for (let t = 1; t <= maxTransactions; t++) {
        let maxDiff = -prices[0];
        for (let i = 1; i < n; i++) {
            dp[t][i] = Math.max(dp[t][i - 1], prices[i] + maxDiff);
            maxDiff = Math.max(maxDiff, dp[t - 1][i] - prices[i]);
        }
    }

    return dp[maxTransactions][n - 1];
}
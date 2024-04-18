export function uniquePaths(grid: number[][]) {
    const rows = grid.length;
    const cols = grid[0].length;

    const dp = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

    dp[0][0] = grid[0][0] === 0 ? 1 : 0;

    for (let i = 1; i < rows; i++) {
        dp[i][0] = grid[i][0] === 0 ? dp[i - 1][0] : 0;
    }

    for (let j = 1; j < cols; j++) {
        dp[0][j] = grid[0][j] === 0 ? dp[0][j - 1] : 0;
    }

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (grid[i][j] === 0) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            } else {
                dp[i][j] = 0;
            }
        }
    }

    return dp[rows - 1][cols - 1];
}
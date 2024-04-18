export function mergeInterval(intervals: number[][]) {
    if (intervals.length <= 1) {
        return intervals;
    }

    // Sort the intervals based on the start value
    intervals.sort((a, b) => a[0] - b[0]);

    const result: number[][] = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const currentInterval = intervals[i];
        const lastMergedInterval = result[result.length - 1];

        if (currentInterval[0] <= lastMergedInterval[1]) {
            // Merge the current interval with the last merged interval
            lastMergedInterval[1] = Math.max(lastMergedInterval[1], currentInterval[1]);
        } else {
            // Add the current interval to the result array
            result.push(currentInterval);
        }
    }

    return result;
}

export function mergeInterval(intervals) {
    if (intervals.length <= 1) {
        return intervals;
    }
    // Sort the intervals based on the start value
    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const currentInterval = intervals[i];
        const lastMergedInterval = result[result.length - 1];
        if (currentInterval[0] <= lastMergedInterval[1]) {
            // Merge the current interval with the last merged interval
            lastMergedInterval[1] = Math.max(lastMergedInterval[1], currentInterval[1]);
        }
        else {
            // Add the current interval to the result array
            result.push(currentInterval);
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VJbnRlcnZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jY3QvbWVyZ2VJbnRlcnZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsYUFBYSxDQUFDLFNBQXFCO0lBQy9DLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDdkIsT0FBTyxTQUFTLENBQUM7S0FDcEI7SUFFRCw4Q0FBOEM7SUFDOUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0QyxNQUFNLE1BQU0sR0FBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXJELElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzdDLDJEQUEyRDtZQUMzRCxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9FO2FBQU07WUFDSCwrQ0FBK0M7WUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNoQztLQUNKO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBtZXJnZUludGVydmFsKGludGVydmFsczogbnVtYmVyW11bXSkge1xuICAgIGlmIChpbnRlcnZhbHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFscztcbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSBpbnRlcnZhbHMgYmFzZWQgb24gdGhlIHN0YXJ0IHZhbHVlXG4gICAgaW50ZXJ2YWxzLnNvcnQoKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcblxuICAgIGNvbnN0IHJlc3VsdDogbnVtYmVyW11bXSA9IFtpbnRlcnZhbHNbMF1dO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBpbnRlcnZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY3VycmVudEludGVydmFsID0gaW50ZXJ2YWxzW2ldO1xuICAgICAgICBjb25zdCBsYXN0TWVyZ2VkSW50ZXJ2YWwgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGlmIChjdXJyZW50SW50ZXJ2YWxbMF0gPD0gbGFzdE1lcmdlZEludGVydmFsWzFdKSB7XG4gICAgICAgICAgICAvLyBNZXJnZSB0aGUgY3VycmVudCBpbnRlcnZhbCB3aXRoIHRoZSBsYXN0IG1lcmdlZCBpbnRlcnZhbFxuICAgICAgICAgICAgbGFzdE1lcmdlZEludGVydmFsWzFdID0gTWF0aC5tYXgobGFzdE1lcmdlZEludGVydmFsWzFdLCBjdXJyZW50SW50ZXJ2YWxbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWRkIHRoZSBjdXJyZW50IGludGVydmFsIHRvIHRoZSByZXN1bHQgYXJyYXlcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnRJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuIl19
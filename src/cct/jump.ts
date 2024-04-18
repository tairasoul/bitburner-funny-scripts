export function minJumps(nums: number[]) {
    if (nums.length <= 1) return 0;

    let maxReach = nums[0];
    let steps = 1;
    let lastJumpEnd = nums[0];

    for (let i = 1; i < nums.length - 1; i++) {
        maxReach = Math.max(maxReach, i + nums[i]);
        if (i === lastJumpEnd) {
            steps++;
            lastJumpEnd = maxReach;
        }
        if (lastJumpEnd >= nums.length - 1) {
            return steps;
        }
    }

    return 0;
}
export function largestPrimeFactor(num: number) {
    let factor = 2;
    let largestFactor = 1;

    while (num > 1) {
        if (num % factor === 0) {
            largestFactor = factor;
            num /= factor;
            while (num % factor === 0) {
                num /= factor;
            }
        }
        factor++;
    }

    return largestFactor;
}
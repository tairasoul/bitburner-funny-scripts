export function generateIPAddresses(s: string) {
    const result: string[] = [];

    const generateIPAddressesRecursively = (remaining: string, octets: string[], count: number) => {
        if (count === 4) {
            if (remaining === '') {
                result.push(octets.join('.'));
            }
            return;
        }

        for (let i = 1; i <= 3 && i <= remaining.length; i++) {
            const octetStr = remaining.substring(0, i);
            const octet = parseInt(octetStr);

            if (octet >= 0 && octet <= 255 && !(octetStr.length > 1 && octetStr.startsWith('0'))) {
                generateIPAddressesRecursively(remaining.substring(i), [...octets, octetStr], count + 1);
            }
        }
    };

    generateIPAddressesRecursively(s, [], 0);
    return result;
}
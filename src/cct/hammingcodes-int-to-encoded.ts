// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function HammingCodes_to_encoded(value: any) {
    // Calculates the needed amount of parityBits 'without' the "overall"-Parity
    // @ts-ignore
    const HammingSumOfParity = lengthOfDBits => lengthOfDBits == 0 ? 0 : lengthOfDBits < 3 ? lengthOfDBits + 1 :
        Math.ceil(Math.log2(lengthOfDBits * 2)) <= Math.ceil(Math.log2(1 + lengthOfDBits + Math.ceil(Math.log2(lengthOfDBits)))) ?
            Math.ceil(Math.log2(lengthOfDBits) + 1) : Math.ceil(Math.log2(lengthOfDBits));
    // @ts-ignore
    const data = value.toString(2).split(""); // first, change into binary string, then create array with 1 bit per index
    const sumParity = HammingSumOfParity(data.length); // get the sum of needed parity bits (for later use in encoding)
    // @ts-ignore
    const count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // function count for specific entries in the array, for later use
    const build = ["x", "x", ...data.splice(0, 1)]; // init the "pre-build"
    for (let i = 2; i < sumParity; i++)
        build.push("x", ...data.splice(0, Math.pow(2, i) - 1)); // add new paritybits and the corresponding data bits (pre-building array)
    // Get the index numbers where the parity bits "x" are placed
    const parityBits = build.map((e, i) => [e, i]).filter(([e, _]) => e == "x").map(([_, i]) => i);
    for (const index of parityBits) {
        const tempcount = index + 1; // set the "stepsize" for the parityBit
        const temparray = []; // temporary array to store the extracted bits
        const tempdata = [...build]; // only work with a copy of the build
        while (tempdata[index] !== undefined) {
            // as long as there are bits on the starting index, do "cut"
            const temp = tempdata.splice(index, tempcount * 2); // cut stepsize*2 bits, then...
            // @ts-ignore
            temparray.push(...temp.splice(0, tempcount)); // ... cut the result again and keep the first half
        }
        temparray.splice(0, 1); // remove first bit, which is the parity one
        build[index] = (count(temparray, "1") % 2).toString(); // count with remainder of 2 and"toString" to store the parityBit
    } // parity done, now the "overall"-parity is set
    build.unshift((count(build, "1") % 2).toString()); // has to be done as last element
    return build.join(""); // return the build as string
}
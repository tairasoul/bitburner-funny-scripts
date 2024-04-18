// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function HammingCodes_to_int(data: any) {

        //check for altered bit and decode
        const build = data.split(""); // ye, an array for working, again
        const testArray = []; //for the "truthtable". if any is false, the data has an altered bit, will check for and fix it
        const sumParity = Math.ceil(Math.log2(data.length)); // sum of parity for later use
        // @ts-ignore
        const count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
        // the count.... again ;)
        let overallParity = build.splice(0, 1).join(""); // store first index, for checking in next step and fix the build properly later on
        testArray.push(overallParity == (count(build, "1") % 2).toString() ? true : false); // first check with the overall parity bit
        for (let i = 0; i < sumParity; i++) {
            // for the rest of the remaining parity bits we also "check"
            const tempIndex = Math.pow(2, i) - 1; // get the parityBits Index
            const tempStep = tempIndex + 1; // set the stepsize
            const tempData = [...build]; // get a "copy" of the build-data for working
            const tempArray = []; // init empty array for "testing"
            while (tempData[tempIndex] != undefined) {
                // extract from the copied data until the "starting" index is undefined
                const temp = [...tempData.splice(tempIndex, tempStep * 2)]; // extract 2*stepsize
                tempArray.push(...temp.splice(0, tempStep)); // and cut again for keeping first half
            }
            const tempParity = tempArray.shift(); // and again save the first index separated for checking with the rest of the data
            testArray.push(tempParity == (count(tempArray, "1") % 2).toString() ? true : false);
            // is the tempParity the calculated data? push answer into the 'truthtable'
        }
        let fixIndex = 0; // init the "fixing" index and start with 0
        for (let i = 1; i < sumParity + 1; i++) {
            // simple binary adding for every boolean in the testArray, starting from 2nd index of it
            fixIndex += testArray[i] ? 0 : Math.pow(2, i) / 2;
        }
        build.unshift(overallParity); // now we need the "overall" parity back in it's place
        // try fix the actual encoded binary string if there is an error
        if (fixIndex > 0 && testArray[0] == false) { // if the overall is false and the sum of calculated values is greater equal 0, fix the corresponding hamming-bit           
            build[fixIndex] = build[fixIndex] == "0" ? "1" : "0";
        } else if (testArray[0] == false) { // otherwise, if the the overallparity is the only wrong, fix that one           
            overallParity = overallParity == "0" ? "1" : "0";
        } else if (testArray[0] == true && testArray.some((truth) => truth == false)) {
            return 0; // ERROR: There's some strange going on... 2 bits are altered? How? This should not happen
        }
        // oof.. halfway through... we fixed an possible altered bit, now "extract" the parity-bits from the build
        for (let i = sumParity; i >= 0; i--) {
            // start from the last parity down the 2nd index one
            build.splice(Math.pow(2, i), 1);
        }
        build.splice(0, 1); // remove the overall parity bit and we have our binary value
        return parseInt(build.join(""), 2); // parse the integer with redux 2 and we're done!
}
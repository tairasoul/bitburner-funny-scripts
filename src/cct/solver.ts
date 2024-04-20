import { NS } from "@ns";
import { decompressLZ } from "/cct/decompressLZ";
import { getCCT } from "/cct/findCct";
import { minJumps } from "/cct/jump";
import { largestPrimeFactor } from "/cct/largestPrimeFactor";
import * as stocks from "/cct/stockTrader";
import { maxSubarraySum } from "/cct/maxSubarraySum";
import { sanitizeParentheses } from "/cct/parenthesesSanitize";
import { RLE } from "/cct/RLE";
import { twoColorGraph } from "/cct/twoColourGraph";
import { uniquePaths } from "/cct/uniquePaths";
import { totalSums, totalSums2 } from "/cct/totalSums";
import { vignere } from "/cct/vignere";
import { generateIPAddresses } from "/cct/generateIPAddresses";
import { mergeInterval } from "/cct/mergeInterval";
import { triangle } from "/cct/triangle";
import { caesar } from "/cct/caesar";
import { compressLZ } from "/cct/compressLZ";
import { findValid } from "/cct/findvalid";
import { HammingCodes_to_int } from "/cct/hammingcodes-encoded-to-int";
import { HammingCodes_to_encoded } from "/cct/hammingcodes-int-to-encoded"
import { SpiralizeMatrix } from "/cct/spiralize_matrix";
import { ShortestPath } from "/cct/shortest_path";
import Logs from "/general/logs";

function getAll(ns: NS, contract: string, host: string) {
    return {
        type: ns.codingcontract.getContractType(contract, host),
        data: ns.codingcontract.getData(contract, host),
        description: ns.codingcontract.getDescription(contract, host)
    }
}

function createGrid(numRows: number, numCols: number) {
    const array: number[][] = [];

    for (let i = 0; i < numRows; i++) {
        array.push(new Array(numCols).fill(0));
    }
    return array;
}

export async function solveCCT(ns: NS, logger: Logs) {
    ns.disableLog("ALL");
    const cct = getCCT(ns);
    if (cct != null) {
        const contract = getAll(ns, cct.cct, cct.hostname);
        if (contract.type.includes("Array Jumping Game")) {
            const output = ns.codingcontract.attempt(minJumps(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Subarray with Maximum Sum") {
            const output = ns.codingcontract.attempt(maxSubarraySum(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Proper 2-Coloring of a Graph") {
            const output = ns.codingcontract.attempt(twoColorGraph(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Compression I: RLE Compression") {
            const output = ns.codingcontract.attempt(RLE(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Compression II: LZ Decompression") {
            const output = ns.codingcontract.attempt(decompressLZ(contract.data) as string, cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Find Largest Prime Factor") {
            const output = ns.codingcontract.attempt(largestPrimeFactor(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Unique Paths in a Grid I") {
            const output = ns.codingcontract.attempt(uniquePaths(createGrid(contract.data[0], contract.data[1])), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Unique Paths in a Grid II") {
            const output = ns.codingcontract.attempt(uniquePaths(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type.startsWith("Total Ways to Sum")) {
            const output = ns.codingcontract.attempt(contract.type.endsWith("II") ? totalSums2(contract.data) : totalSums(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type.includes("Algorithmic Stock Trader")) {
            const type = contract.type.split(" ")[3];
            switch (type) {
                case "I":
                    const output = ns.codingcontract.attempt(stocks.stock1(contract.data), cct.cct, cct.hostname);
                    if (output == "") {
                        await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
                    }
                    else {
                        await logger.Log(output);
                    }
                    return true;
                case "II":
                    const output2 = ns.codingcontract.attempt(stocks.stock2(contract.data), cct.cct, cct.hostname);
                    if (output2 == "") {
                        await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
                    }
                    else {
                        await logger.Log(output2);
                    }
                    return true;
                case "III":
                    const output3 = ns.codingcontract.attempt(stocks.stock3(contract.data), cct.cct, cct.hostname);
                    if (output3 == "") {
                        await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
                    }
                    else {
                        await logger.Log(output3);
                    }
                    return true;
                case "IV":
                    const output4 = ns.codingcontract.attempt(stocks.stock4(contract.data), cct.cct, cct.hostname);
                    if (output4 == "") {
                        await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
                    }
                    else {
                        await logger.Log(output4);
                    }
                    return true;
            }
        }
        if (contract.type.startsWith("Encryption II")) {
            const output = ns.codingcontract.attempt(vignere(contract.data[0], contract.data[1]), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Generate IP Addresses") {
            const output = ns.codingcontract.attempt(generateIPAddresses(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Merge Overlapping Intervals") {
            const output = ns.codingcontract.attempt(mergeInterval(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Minimum Path Sum in a Triangle") {
            const output = ns.codingcontract.attempt(triangle(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Sanitize Parentheses in Expression") {
            const output = ns.codingcontract.attempt(sanitizeParentheses(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type.startsWith("Encryption I")) {
            const output = ns.codingcontract.attempt(caesar(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type.startsWith("Compression III")) {
            const output = ns.codingcontract.attempt(compressLZ(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Find All Valid Math Expressions") {
            const output = ns.codingcontract.attempt(findValid(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "HammingCodes: Integer to Encoded Binary") {
            const output = ns.codingcontract.attempt(HammingCodes_to_encoded(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "HammingCodes: Encoded Binary to Integer") {
            const output = ns.codingcontract.attempt(HammingCodes_to_int(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Shortest Path in a Grid") {
            const output = ns.codingcontract.attempt(ShortestPath(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
        if (contract.type == "Spiralize Matrix") {
            const output = ns.codingcontract.attempt(SpiralizeMatrix(contract.data), cct.cct, cct.hostname);
            if (output == "") {
                await logger.Log(`Failed to solve contract of type ${contract.type} ${cct.cct} on ${cct.hostname}.`);
            }
            else {
                await logger.Log(output);
            }
            return true;
        }
    }
    return false
}
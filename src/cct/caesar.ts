// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function caesar(data: any) {
    const cipher = [...data[0]]
        .map((a) => (a === " " ? a : String.fromCharCode(((a.charCodeAt(0) - 65 - data[1] + 26) % 26) + 65)))
        .join("");
    return cipher;
}
import ns from "@ns";

export async function download(ns: ns.NS) {
    await ns.wget("https://github.com/paulcdejean/rouletteburn/releases/download/1.0.0/rouletteburn.js", "rouletteburn.js");
}
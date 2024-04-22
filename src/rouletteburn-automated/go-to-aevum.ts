import ns from "@ns";

export async function aevum(ns: ns.NS) {
    const doc = eval("document") as Document;
    const buttons = doc.querySelectorAll("div.MuiButtonBase-root");

    buttons.forEach(div => {
        if (Array.from(div.querySelectorAll('*')).some(element => element.textContent?.includes('Travel'))) {
            (div as HTMLElement).click();
        }
    });
    const elems = doc.querySelectorAll('span');
    let element: HTMLElement | undefined;
    elems.forEach((elem) => {
        if (elem.textContent?.trim() == "A") {
            element = elem as HTMLElement;
            return;
        }
    })
    if (ns.getServerMoneyAvailable("home") < 200000) {
        while (ns.getServerMoneyAvailable("home") < 200000) {
            await ns.hack("n00dles");
            await ns.weaken("n00dles");
            await ns.grow("n00dles");
            await ns.weaken("n00dles");
        }
    }
    if (element) element.click();
}
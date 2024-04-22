import ns from "@ns";

export async function aevum(ns: ns.NS) {
    const doc = eval("document") as Document;
    const elems = doc.querySelectorAll('.jss84');
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
    const travelButton = doc.querySelector('div.MuiButtonBase-root.MuiListItem-root.jss23.MuiListItem-gutters.MuiListItem-padding.MuiListItem-button.jss22.css-1kk0p5e')
    if (travelButton) {
        (travelButton as HTMLElement).click();
    }
    if (element) element.click();
}
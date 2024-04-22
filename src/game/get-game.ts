import { GAME } from "./types";

export async function exploit() {
    const Window = eval("window");
    const doc = eval("document") as Document;
    const optionsButton = doc.querySelector("#root > div.MuiBox-root > div.MuiDrawer-root.MuiDrawer-docked > div > ul > div:nth-child(11) > div > div > div:nth-child(4)") as HTMLElement
    return await (new Promise<GAME>((resolve, reject) => {
      if (Window.GAME) {
        resolve(Window.GAME as GAME)
        return
      }
      let a = false
      try {
        Object.defineProperty(Object.prototype, 'setMoney', {
          get() { return this._gM; },
          set(newValue) {
            this._gM = newValue;
            if (a) { return }
            a = true
            Window.GAME = this;
            resolve(this as GAME)
          }
        });
        optionsButton.click();
        const saveButton = doc.querySelector("#root > div.MuiBox-root > div.jss1.MuiBox-root > div > div > div.MuiBox-root > div.MuiBox-root > button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium") as HTMLElement;
        saveButton.click();
        const terminal = doc.querySelector("#root > div.MuiBox-root > div.MuiDrawer-root.MuiDrawer-docked > div > ul > div:nth-child(2) > div > div > div:nth-child(1)") as HTMLElement;
        terminal.click();
      } catch {
        if (!Window.GAME) {
          reject("Exploit.js: Hmm, either the exploit didnt work or you haven't pressed the save button yet!")
          return
        }
        reject("Exploit.js: Looks like you have run this script before! :<\nTo rerun, refresh game.")
      }
    }))
  }
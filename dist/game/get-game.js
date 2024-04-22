export async function exploit() {
    const Window = eval("window");
    const doc = eval("document");
    const optionsButton = doc.querySelector("#root > div.MuiBox-root > div.MuiDrawer-root.MuiDrawer-docked > div > ul > div:nth-child(11) > div > div > div:nth-child(4)");
    return await (new Promise((resolve, reject) => {
        if (Window.GAME) {
            resolve(Window.GAME);
            return;
        }
        let a = false;
        try {
            Object.defineProperty(Object.prototype, 'setMoney', {
                get() { return this._gM; },
                set(newValue) {
                    this._gM = newValue;
                    if (a) {
                        return;
                    }
                    a = true;
                    Window.GAME = this;
                    resolve(this);
                }
            });
            optionsButton.click();
            const saveButton = doc.querySelector("#root > div.MuiBox-root > div.jss1.MuiBox-root > div > div > div.MuiBox-root > div.MuiBox-root > button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium");
            saveButton.click();
            const terminal = doc.querySelector("#root > div.MuiBox-root > div.MuiDrawer-root.MuiDrawer-docked > div > ul > div:nth-child(2) > div > div > div:nth-child(1)");
            terminal.click();
        }
        catch {
            if (!Window.GAME) {
                reject("Exploit.js: Hmm, either the exploit didnt work or you haven't pressed the save button yet!");
                return;
            }
            reject("Exploit.js: Looks like you have run this script before! :<\nTo rerun, refresh game.");
        }
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWdhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2FtZS9nZXQtZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsS0FBSyxVQUFVLE9BQU87SUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQWEsQ0FBQztJQUN6QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZIQUE2SCxDQUFnQixDQUFBO0lBQ3JMLE9BQU8sTUFBTSxDQUFDLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ2xELElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtZQUNmLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBWSxDQUFDLENBQUE7WUFDNUIsT0FBTTtTQUNQO1FBQ0QsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFBO1FBQ2IsSUFBSTtZQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUU7Z0JBQ2xELEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixHQUFHLENBQUMsUUFBUTtvQkFDVixJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLEVBQUU7d0JBQUUsT0FBTTtxQkFBRTtvQkFDakIsQ0FBQyxHQUFHLElBQUksQ0FBQTtvQkFDUixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDbkIsT0FBTyxDQUFDLElBQVksQ0FBQyxDQUFBO2dCQUN2QixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsZ1VBQWdVLENBQWdCLENBQUM7WUFDdFgsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsNEhBQTRILENBQWdCLENBQUM7WUFDaEwsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2xCO1FBQUMsTUFBTTtZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNoQixNQUFNLENBQUMsNEZBQTRGLENBQUMsQ0FBQTtnQkFDcEcsT0FBTTthQUNQO1lBQ0QsTUFBTSxDQUFDLHFGQUFxRixDQUFDLENBQUE7U0FDOUY7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdBTUUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhwbG9pdCgpIHtcbiAgICBjb25zdCBXaW5kb3cgPSBldmFsKFwid2luZG93XCIpO1xuICAgIGNvbnN0IGRvYyA9IGV2YWwoXCJkb2N1bWVudFwiKSBhcyBEb2N1bWVudDtcbiAgICBjb25zdCBvcHRpb25zQnV0dG9uID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdCA+IGRpdi5NdWlEcmF3ZXItcm9vdC5NdWlEcmF3ZXItZG9ja2VkID4gZGl2ID4gdWwgPiBkaXY6bnRoLWNoaWxkKDExKSA+IGRpdiA+IGRpdiA+IGRpdjpudGgtY2hpbGQoNClcIikgYXMgSFRNTEVsZW1lbnRcbiAgICByZXR1cm4gYXdhaXQgKG5ldyBQcm9taXNlPEdBTUU+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChXaW5kb3cuR0FNRSkge1xuICAgICAgICByZXNvbHZlKFdpbmRvdy5HQU1FIGFzIEdBTUUpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgbGV0IGEgPSBmYWxzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdzZXRNb25leScsIHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLl9nTTsgfSxcbiAgICAgICAgICBzZXQobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dNID0gbmV3VmFsdWU7XG4gICAgICAgICAgICBpZiAoYSkgeyByZXR1cm4gfVxuICAgICAgICAgICAgYSA9IHRydWVcbiAgICAgICAgICAgIFdpbmRvdy5HQU1FID0gdGhpcztcbiAgICAgICAgICAgIHJlc29sdmUodGhpcyBhcyBHQU1FKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9wdGlvbnNCdXR0b24uY2xpY2soKTtcbiAgICAgICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IGRvYy5xdWVyeVNlbGVjdG9yKFwiI3Jvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXYuanNzMS5NdWlCb3gtcm9vdCA+IGRpdiA+IGRpdiA+IGRpdi5NdWlCb3gtcm9vdCA+IGRpdi5NdWlCb3gtcm9vdCA+IGJ1dHRvbi5NdWlCdXR0b25CYXNlLXJvb3QuTXVpQnV0dG9uLXJvb3QuTXVpQnV0dG9uLXRleHQuTXVpQnV0dG9uLXRleHRQcmltYXJ5Lk11aUJ1dHRvbi1zaXplTWVkaXVtLk11aUJ1dHRvbi10ZXh0U2l6ZU1lZGl1bS5NdWlCdXR0b24tcm9vdC5NdWlCdXR0b24tdGV4dC5NdWlCdXR0b24tdGV4dFByaW1hcnkuTXVpQnV0dG9uLXNpemVNZWRpdW0uTXVpQnV0dG9uLXRleHRTaXplTWVkaXVtXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBzYXZlQnV0dG9uLmNsaWNrKCk7XG4gICAgICAgIGNvbnN0IHRlcm1pbmFsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdCA+IGRpdi5NdWlEcmF3ZXItcm9vdC5NdWlEcmF3ZXItZG9ja2VkID4gZGl2ID4gdWwgPiBkaXY6bnRoLWNoaWxkKDIpID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgxKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgdGVybWluYWwuY2xpY2soKTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAoIVdpbmRvdy5HQU1FKSB7XG4gICAgICAgICAgcmVqZWN0KFwiRXhwbG9pdC5qczogSG1tLCBlaXRoZXIgdGhlIGV4cGxvaXQgZGlkbnQgd29yayBvciB5b3UgaGF2ZW4ndCBwcmVzc2VkIHRoZSBzYXZlIGJ1dHRvbiB5ZXQhXCIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KFwiRXhwbG9pdC5qczogTG9va3MgbGlrZSB5b3UgaGF2ZSBydW4gdGhpcyBzY3JpcHQgYmVmb3JlISA6PFxcblRvIHJlcnVuLCByZWZyZXNoIGdhbWUuXCIpXG4gICAgICB9XG4gICAgfSkpXG4gIH0iXX0=
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
            const saveButton = doc.querySelector("#root > div.MuiBox-root > div.MuiBox-root > div > div > div.MuiBox-root > div.MuiBox-root > button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWdhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2FtZS9nZXQtZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsS0FBSyxVQUFVLE9BQU87SUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQWEsQ0FBQztJQUN6QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZIQUE2SCxDQUFnQixDQUFBO0lBQ3JMLE9BQU8sTUFBTSxDQUFDLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ2xELElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtZQUNmLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBWSxDQUFDLENBQUE7WUFDNUIsT0FBTTtTQUNQO1FBQ0QsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFBO1FBQ2IsSUFBSTtZQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUU7Z0JBQ2xELEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixHQUFHLENBQUMsUUFBUTtvQkFDVixJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLEVBQUU7d0JBQUUsT0FBTTtxQkFBRTtvQkFDakIsQ0FBQyxHQUFHLElBQUksQ0FBQTtvQkFDUixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDbkIsT0FBTyxDQUFDLElBQVksQ0FBQyxDQUFBO2dCQUN2QixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMlRBQTJULENBQWdCLENBQUM7WUFDalgsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsNEhBQTRILENBQWdCLENBQUM7WUFDaEwsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2xCO1FBQUMsTUFBTTtZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNoQixNQUFNLENBQUMsNEZBQTRGLENBQUMsQ0FBQTtnQkFDcEcsT0FBTTthQUNQO1lBQ0QsTUFBTSxDQUFDLHFGQUFxRixDQUFDLENBQUE7U0FDOUY7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdBTUUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhwbG9pdCgpIHtcbiAgICBjb25zdCBXaW5kb3cgPSBldmFsKFwid2luZG93XCIpO1xuICAgIGNvbnN0IGRvYyA9IGV2YWwoXCJkb2N1bWVudFwiKSBhcyBEb2N1bWVudDtcbiAgICBjb25zdCBvcHRpb25zQnV0dG9uID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdCA+IGRpdi5NdWlEcmF3ZXItcm9vdC5NdWlEcmF3ZXItZG9ja2VkID4gZGl2ID4gdWwgPiBkaXY6bnRoLWNoaWxkKDExKSA+IGRpdiA+IGRpdiA+IGRpdjpudGgtY2hpbGQoNClcIikgYXMgSFRNTEVsZW1lbnRcbiAgICByZXR1cm4gYXdhaXQgKG5ldyBQcm9taXNlPEdBTUU+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChXaW5kb3cuR0FNRSkge1xuICAgICAgICByZXNvbHZlKFdpbmRvdy5HQU1FIGFzIEdBTUUpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgbGV0IGEgPSBmYWxzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdzZXRNb25leScsIHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzLl9nTTsgfSxcbiAgICAgICAgICBzZXQobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dNID0gbmV3VmFsdWU7XG4gICAgICAgICAgICBpZiAoYSkgeyByZXR1cm4gfVxuICAgICAgICAgICAgYSA9IHRydWVcbiAgICAgICAgICAgIFdpbmRvdy5HQU1FID0gdGhpcztcbiAgICAgICAgICAgIHJlc29sdmUodGhpcyBhcyBHQU1FKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9wdGlvbnNCdXR0b24uY2xpY2soKTtcbiAgICAgICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IGRvYy5xdWVyeVNlbGVjdG9yKFwiI3Jvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXYgPiBkaXYgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBidXR0b24uTXVpQnV0dG9uQmFzZS1yb290Lk11aUJ1dHRvbi1yb290Lk11aUJ1dHRvbi10ZXh0Lk11aUJ1dHRvbi10ZXh0UHJpbWFyeS5NdWlCdXR0b24tc2l6ZU1lZGl1bS5NdWlCdXR0b24tdGV4dFNpemVNZWRpdW0uTXVpQnV0dG9uLXJvb3QuTXVpQnV0dG9uLXRleHQuTXVpQnV0dG9uLXRleHRQcmltYXJ5Lk11aUJ1dHRvbi1zaXplTWVkaXVtLk11aUJ1dHRvbi10ZXh0U2l6ZU1lZGl1bVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgc2F2ZUJ1dHRvbi5jbGljaygpO1xuICAgICAgICBjb25zdCB0ZXJtaW5hbCA9IGRvYy5xdWVyeVNlbGVjdG9yKFwiI3Jvb3QgPiBkaXYuTXVpQm94LXJvb3QgPiBkaXYuTXVpRHJhd2VyLXJvb3QuTXVpRHJhd2VyLWRvY2tlZCA+IGRpdiA+IHVsID4gZGl2Om50aC1jaGlsZCgyKSA+IGRpdiA+IGRpdiA+IGRpdjpudGgtY2hpbGQoMSlcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIHRlcm1pbmFsLmNsaWNrKCk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgaWYgKCFXaW5kb3cuR0FNRSkge1xuICAgICAgICAgIHJlamVjdChcIkV4cGxvaXQuanM6IEhtbSwgZWl0aGVyIHRoZSBleHBsb2l0IGRpZG50IHdvcmsgb3IgeW91IGhhdmVuJ3QgcHJlc3NlZCB0aGUgc2F2ZSBidXR0b24geWV0IVwiKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJlamVjdChcIkV4cGxvaXQuanM6IExvb2tzIGxpa2UgeW91IGhhdmUgcnVuIHRoaXMgc2NyaXB0IGJlZm9yZSEgOjxcXG5UbyByZXJ1biwgcmVmcmVzaCBnYW1lLlwiKVxuICAgICAgfVxuICAgIH0pKVxuICB9Il19
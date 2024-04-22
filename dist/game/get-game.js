export async function exploit() {
    const Window = eval("window");
    const doc = eval("document");
    const optionsButton = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.MuiDrawer-root.MuiDrawer-docked.css-v3syqg > div > ul > div:nth-child(11) > div > div > div:nth-child(4)");
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
            const saveButton = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.jss1.MuiBox-root.css-0 > div > div > div.MuiBox-root.css-0 > div.MuiBox-root.css-2dfeen > button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.css-1pps7yp");
            saveButton.click();
            const terminal = doc.querySelector("#root > div.MuiBox-root.css-1ik4laa > div.MuiDrawer-root.MuiDrawer-docked.css-v3syqg > div > ul > div:nth-child(2) > div > div > div:nth-child(1)");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWdhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2FtZS9nZXQtZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsS0FBSyxVQUFVLE9BQU87SUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQWEsQ0FBQztJQUN6QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG9KQUFvSixDQUFnQixDQUFBO0lBQzVNLE9BQU8sTUFBTSxDQUFDLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ2xELElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtZQUNmLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBWSxDQUFDLENBQUE7WUFDNUIsT0FBTTtTQUNQO1FBQ0QsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFBO1FBQ2IsSUFBSTtZQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUU7Z0JBQ2xELEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixHQUFHLENBQUMsUUFBUTtvQkFDVixJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLEVBQUU7d0JBQUUsT0FBTTtxQkFBRTtvQkFDakIsQ0FBQyxHQUFHLElBQUksQ0FBQTtvQkFDUixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDbkIsT0FBTyxDQUFDLElBQVksQ0FBQyxDQUFBO2dCQUN2QixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsK1dBQStXLENBQWdCLENBQUM7WUFDcmEsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsbUpBQW1KLENBQWdCLENBQUM7WUFDdk0sUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2xCO1FBQUMsTUFBTTtZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNoQixNQUFNLENBQUMsNEZBQTRGLENBQUMsQ0FBQTtnQkFDcEcsT0FBTTthQUNQO1lBQ0QsTUFBTSxDQUFDLHFGQUFxRixDQUFDLENBQUE7U0FDOUY7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdBTUUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhwbG9pdCgpIHtcbiAgICBjb25zdCBXaW5kb3cgPSBldmFsKFwid2luZG93XCIpO1xuICAgIGNvbnN0IGRvYyA9IGV2YWwoXCJkb2N1bWVudFwiKSBhcyBEb2N1bWVudDtcbiAgICBjb25zdCBvcHRpb25zQnV0dG9uID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdC5jc3MtMWlrNGxhYSA+IGRpdi5NdWlEcmF3ZXItcm9vdC5NdWlEcmF3ZXItZG9ja2VkLmNzcy12M3N5cWcgPiBkaXYgPiB1bCA+IGRpdjpudGgtY2hpbGQoMTEpID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCg0KVwiKSBhcyBIVE1MRWxlbWVudFxuICAgIHJldHVybiBhd2FpdCAobmV3IFByb21pc2U8R0FNRT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKFdpbmRvdy5HQU1FKSB7XG4gICAgICAgIHJlc29sdmUoV2luZG93LkdBTUUgYXMgR0FNRSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBsZXQgYSA9IGZhbHNlXG4gICAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ3NldE1vbmV5Jywge1xuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXMuX2dNOyB9LFxuICAgICAgICAgIHNldChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fZ00gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIGlmIChhKSB7IHJldHVybiB9XG4gICAgICAgICAgICBhID0gdHJ1ZVxuICAgICAgICAgICAgV2luZG93LkdBTUUgPSB0aGlzO1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzIGFzIEdBTUUpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb3B0aW9uc0J1dHRvbi5jbGljaygpO1xuICAgICAgICBjb25zdCBzYXZlQnV0dG9uID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdC5jc3MtMWlrNGxhYSA+IGRpdi5qc3MxLk11aUJveC1yb290LmNzcy0wID4gZGl2ID4gZGl2ID4gZGl2Lk11aUJveC1yb290LmNzcy0wID4gZGl2Lk11aUJveC1yb290LmNzcy0yZGZlZW4gPiBidXR0b24uTXVpQnV0dG9uQmFzZS1yb290Lk11aUJ1dHRvbi1yb290Lk11aUJ1dHRvbi10ZXh0Lk11aUJ1dHRvbi10ZXh0UHJpbWFyeS5NdWlCdXR0b24tc2l6ZU1lZGl1bS5NdWlCdXR0b24tdGV4dFNpemVNZWRpdW0uTXVpQnV0dG9uLXJvb3QuTXVpQnV0dG9uLXRleHQuTXVpQnV0dG9uLXRleHRQcmltYXJ5Lk11aUJ1dHRvbi1zaXplTWVkaXVtLk11aUJ1dHRvbi10ZXh0U2l6ZU1lZGl1bS5jc3MtMXBwczd5cFwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgc2F2ZUJ1dHRvbi5jbGljaygpO1xuICAgICAgICBjb25zdCB0ZXJtaW5hbCA9IGRvYy5xdWVyeVNlbGVjdG9yKFwiI3Jvb3QgPiBkaXYuTXVpQm94LXJvb3QuY3NzLTFpazRsYWEgPiBkaXYuTXVpRHJhd2VyLXJvb3QuTXVpRHJhd2VyLWRvY2tlZC5jc3MtdjNzeXFnID4gZGl2ID4gdWwgPiBkaXY6bnRoLWNoaWxkKDIpID4gZGl2ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgxKVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgdGVybWluYWwuY2xpY2soKTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAoIVdpbmRvdy5HQU1FKSB7XG4gICAgICAgICAgcmVqZWN0KFwiRXhwbG9pdC5qczogSG1tLCBlaXRoZXIgdGhlIGV4cGxvaXQgZGlkbnQgd29yayBvciB5b3UgaGF2ZW4ndCBwcmVzc2VkIHRoZSBzYXZlIGJ1dHRvbiB5ZXQhXCIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KFwiRXhwbG9pdC5qczogTG9va3MgbGlrZSB5b3UgaGF2ZSBydW4gdGhpcyBzY3JpcHQgYmVmb3JlISA6PFxcblRvIHJlcnVuLCByZWZyZXNoIGdhbWUuXCIpXG4gICAgICB9XG4gICAgfSkpXG4gIH0iXX0=
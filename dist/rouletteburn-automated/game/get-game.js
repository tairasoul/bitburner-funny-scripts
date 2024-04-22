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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWdhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91bGV0dGVidXJuLWF1dG9tYXRlZC9nYW1lL2dldC1nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBQyxLQUFLLFVBQVUsT0FBTztJQUN6QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBYSxDQUFDO0lBQ3pDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0pBQW9KLENBQWdCLENBQUE7SUFDNU0sT0FBTyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbEQsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFZLENBQUMsQ0FBQTtZQUM1QixPQUFNO1NBQ1A7UUFDRCxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUE7UUFDYixJQUFJO1lBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRTtnQkFDbEQsR0FBRyxLQUFLLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEdBQUcsQ0FBQyxRQUFRO29CQUNWLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO29CQUNwQixJQUFJLENBQUMsRUFBRTt3QkFBRSxPQUFNO3FCQUFFO29CQUNqQixDQUFDLEdBQUcsSUFBSSxDQUFBO29CQUNSLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNuQixPQUFPLENBQUMsSUFBWSxDQUFDLENBQUE7Z0JBQ3ZCLENBQUM7YUFDRixDQUFDLENBQUM7WUFDSCxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywrV0FBK1csQ0FBZ0IsQ0FBQztZQUNyYSxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtSkFBbUosQ0FBZ0IsQ0FBQztZQUN2TSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbEI7UUFBQyxNQUFNO1lBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hCLE1BQU0sQ0FBQyw0RkFBNEYsQ0FBQyxDQUFBO2dCQUNwRyxPQUFNO2FBQ1A7WUFDRCxNQUFNLENBQUMscUZBQXFGLENBQUMsQ0FBQTtTQUM5RjtJQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0FNRSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleHBsb2l0KCkge1xuICAgIGNvbnN0IFdpbmRvdyA9IGV2YWwoXCJ3aW5kb3dcIik7XG4gICAgY29uc3QgZG9jID0gZXZhbChcImRvY3VtZW50XCIpIGFzIERvY3VtZW50O1xuICAgIGNvbnN0IG9wdGlvbnNCdXR0b24gPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290LmNzcy0xaWs0bGFhID4gZGl2Lk11aURyYXdlci1yb290Lk11aURyYXdlci1kb2NrZWQuY3NzLXYzc3lxZyA+IGRpdiA+IHVsID4gZGl2Om50aC1jaGlsZCgxMSkgPiBkaXYgPiBkaXYgPiBkaXY6bnRoLWNoaWxkKDQpXCIpIGFzIEhUTUxFbGVtZW50XG4gICAgcmV0dXJuIGF3YWl0IChuZXcgUHJvbWlzZTxHQU1FPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoV2luZG93LkdBTUUpIHtcbiAgICAgICAgcmVzb2x2ZShXaW5kb3cuR0FNRSBhcyBHQU1FKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGxldCBhID0gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCAnc2V0TW9uZXknLCB7XG4gICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpcy5fZ007IH0sXG4gICAgICAgICAgc2V0KG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9nTSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgaWYgKGEpIHsgcmV0dXJuIH1cbiAgICAgICAgICAgIGEgPSB0cnVlXG4gICAgICAgICAgICBXaW5kb3cuR0FNRSA9IHRoaXM7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMgYXMgR0FNRSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvcHRpb25zQnV0dG9uLmNsaWNrKCk7XG4gICAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBkb2MucXVlcnlTZWxlY3RvcihcIiNyb290ID4gZGl2Lk11aUJveC1yb290LmNzcy0xaWs0bGFhID4gZGl2LmpzczEuTXVpQm94LXJvb3QuY3NzLTAgPiBkaXYgPiBkaXYgPiBkaXYuTXVpQm94LXJvb3QuY3NzLTAgPiBkaXYuTXVpQm94LXJvb3QuY3NzLTJkZmVlbiA+IGJ1dHRvbi5NdWlCdXR0b25CYXNlLXJvb3QuTXVpQnV0dG9uLXJvb3QuTXVpQnV0dG9uLXRleHQuTXVpQnV0dG9uLXRleHRQcmltYXJ5Lk11aUJ1dHRvbi1zaXplTWVkaXVtLk11aUJ1dHRvbi10ZXh0U2l6ZU1lZGl1bS5NdWlCdXR0b24tcm9vdC5NdWlCdXR0b24tdGV4dC5NdWlCdXR0b24tdGV4dFByaW1hcnkuTXVpQnV0dG9uLXNpemVNZWRpdW0uTXVpQnV0dG9uLXRleHRTaXplTWVkaXVtLmNzcy0xcHBzN3lwXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBzYXZlQnV0dG9uLmNsaWNrKCk7XG4gICAgICAgIGNvbnN0IHRlcm1pbmFsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdCA+IGRpdi5NdWlCb3gtcm9vdC5jc3MtMWlrNGxhYSA+IGRpdi5NdWlEcmF3ZXItcm9vdC5NdWlEcmF3ZXItZG9ja2VkLmNzcy12M3N5cWcgPiBkaXYgPiB1bCA+IGRpdjpudGgtY2hpbGQoMikgPiBkaXYgPiBkaXYgPiBkaXY6bnRoLWNoaWxkKDEpXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICB0ZXJtaW5hbC5jbGljaygpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIGlmICghV2luZG93LkdBTUUpIHtcbiAgICAgICAgICByZWplY3QoXCJFeHBsb2l0LmpzOiBIbW0sIGVpdGhlciB0aGUgZXhwbG9pdCBkaWRudCB3b3JrIG9yIHlvdSBoYXZlbid0IHByZXNzZWQgdGhlIHNhdmUgYnV0dG9uIHlldCFcIilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICByZWplY3QoXCJFeHBsb2l0LmpzOiBMb29rcyBsaWtlIHlvdSBoYXZlIHJ1biB0aGlzIHNjcmlwdCBiZWZvcmUhIDo8XFxuVG8gcmVydW4sIHJlZnJlc2ggZ2FtZS5cIilcbiAgICAgIH1cbiAgICB9KSlcbiAgfSJdfQ==
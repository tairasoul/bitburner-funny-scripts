export async function aevum(ns) {
    const doc = eval("document");
    const elems = doc.querySelectorAll('.jss84');
    let element;
    elems.forEach((elem) => {
        if (elem.textContent?.trim() == "A") {
            element = elem;
            return;
        }
    });
    if (ns.getServerMoneyAvailable("home") < 200000) {
        while (ns.getServerMoneyAvailable("home") < 200000) {
            await ns.hack("n00dles");
            await ns.weaken("n00dles");
            await ns.grow("n00dles");
            await ns.weaken("n00dles");
        }
    }
    const travelButton = doc.querySelector('div.MuiButtonBase-root.MuiListItem-root.jss23.MuiListItem-gutters.MuiListItem-padding.MuiListItem-button.jss22.css-1kk0p5e');
    if (travelButton) {
        travelButton.click();
    }
    if (element)
        element.click();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ28tdG8tYWV2dW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91bGV0dGVidXJuLWF1dG9tYXRlZC9nby10by1hZXZ1bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsS0FBSyxVQUFVLEtBQUssQ0FBQyxFQUFTO0lBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQWEsQ0FBQztJQUN6QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsSUFBSSxPQUFnQyxDQUFDO0lBQ3JDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNuQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2pDLE9BQU8sR0FBRyxJQUFtQixDQUFDO1lBQzlCLE9BQU87U0FDVjtJQUNMLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxFQUFFLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFO1FBQzdDLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRTtZQUNoRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QixNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDOUI7S0FDSjtJQUNELE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsNEhBQTRILENBQUMsQ0FBQTtJQUNwSyxJQUFJLFlBQVksRUFBRTtRQUNiLFlBQTRCLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDekM7SUFDRCxJQUFJLE9BQU87UUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tIFwiQG5zXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZXZ1bShuczogbnMuTlMpIHtcbiAgICBjb25zdCBkb2MgPSBldmFsKFwiZG9jdW1lbnRcIikgYXMgRG9jdW1lbnQ7XG4gICAgY29uc3QgZWxlbXMgPSBkb2MucXVlcnlTZWxlY3RvckFsbCgnLmpzczg0Jyk7XG4gICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuICAgIGVsZW1zLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgaWYgKGVsZW0udGV4dENvbnRlbnQ/LnRyaW0oKSA9PSBcIkFcIikge1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9KVxuICAgIGlmIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZShcImhvbWVcIikgPCAyMDAwMDApIHtcbiAgICAgICAgd2hpbGUgKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKFwiaG9tZVwiKSA8IDIwMDAwMCkge1xuICAgICAgICAgICAgYXdhaXQgbnMuaGFjayhcIm4wMGRsZXNcIik7XG4gICAgICAgICAgICBhd2FpdCBucy53ZWFrZW4oXCJuMDBkbGVzXCIpO1xuICAgICAgICAgICAgYXdhaXQgbnMuZ3JvdyhcIm4wMGRsZXNcIik7XG4gICAgICAgICAgICBhd2FpdCBucy53ZWFrZW4oXCJuMDBkbGVzXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHRyYXZlbEJ1dHRvbiA9IGRvYy5xdWVyeVNlbGVjdG9yKCdkaXYuTXVpQnV0dG9uQmFzZS1yb290Lk11aUxpc3RJdGVtLXJvb3QuanNzMjMuTXVpTGlzdEl0ZW0tZ3V0dGVycy5NdWlMaXN0SXRlbS1wYWRkaW5nLk11aUxpc3RJdGVtLWJ1dHRvbi5qc3MyMi5jc3MtMWtrMHA1ZScpXG4gICAgaWYgKHRyYXZlbEJ1dHRvbikge1xuICAgICAgICAodHJhdmVsQnV0dG9uIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudCkgZWxlbWVudC5jbGljaygpO1xufSJdfQ==
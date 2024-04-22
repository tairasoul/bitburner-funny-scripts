export function getReactKey(element: HTMLElement, filter: string) {
    for (const key of Object.keys(element)) {
        if (key.startsWith("__react") && key.includes(filter))
            return key;
    }
    return null;
}
type char = {
    character: string;
    occurs: number
}

export function RLE(str: string) {
    return str.replace(/([\w])\1{0,8}/g, (group, chr) => group.length + chr)
}
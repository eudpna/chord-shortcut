
export function strInsert(str: string, index: number, text: string) {
    const res = str.slice(0, index) + text + str.slice(index);
    return res;
};

export function strSplice(str: string, start: number, len: number, text: string) {
    const res = str.slice(0, start) + text + str.slice(start + len);
    return res;
};


export function isNumber(value: string) {
    return /^-?\d+$/.test(value);
}

export function isNaturalNumber(str: string) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

export const roman_numeric = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'
]
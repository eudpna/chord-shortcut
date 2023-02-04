// Arrayから要素を削除する関数
export function removeItemOnce<T>(arr: T[], value: T) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export function removeItemAll<T>(arr: T[], value: T) {
    let i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}
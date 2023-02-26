export function RandomNum(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

declare global {
    interface Array<T> {
        random(): T;
    }
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}

export function chunk_array(input, chunkSize: number = 9) {
    let array = [...input];
    let chunked = new Array()
    while (array.length > 0) {
        let chunk;
        chunk = array.splice(0, chunkSize);
        chunked.push(chunk);
    }
    return chunked;
}
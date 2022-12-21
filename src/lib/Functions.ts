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
export function RandomNum(max: number): number {
    let min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
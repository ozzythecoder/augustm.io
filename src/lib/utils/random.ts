export function getRandomElement<T>(arr: Array<T>): T;
export function getRandomElement<T>(
    arr: Array<T>,
    skipDuplicates: true,
    duplicate: T,
): T;

export function getRandomElement<T>(
    arr: Array<T>,
    skipDuplicates: boolean = false,
    duplicate?: T,
) {
    const item = arr[Math.floor(Math.random() * arr.length)];
    if (skipDuplicates && item === duplicate) {
        const filtered = arr.filter(e => e !== duplicate)
        if (filtered.length === 0) {
            return arr[0]
        }
        return filtered[Math.floor(Math.random() * filtered.length)]
    }
    return item;
}

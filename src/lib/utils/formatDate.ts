export function formatDate(date: string): string;
export function formatDate(date: string, opts: Intl.DateTimeFormatOptions): string;
export function formatDate(date: string, opts?: Intl.DateTimeFormatOptions): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        ...opts
    });

    return formatter.format(new Date(date));
}

export function parseFullDateFromMonth(date: string): Date {
    const split = date.split(" ")
    if (split.length = 2) {
        return new Date([split[0], "1", split[1]].join(" "))
    }
    return new Date(date)
}

export function getEpochTime(date: string): string;
export function getEpochTime(date: string, asNumber: true): number;
export function getEpochTime(date: string, asNumber?: boolean) {
    return asNumber
        ? Date.parse(date)
        : Date.parse(date).toString();
}

export function formatDate(date: string): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return formatter.format(new Date(date));
}

export function getEpochTime(date: string): string;
export function getEpochTime(date: string, asNumber: true): number;
export function getEpochTime(date: string, asNumber?: boolean) {
    return asNumber
        ? Date.parse(date)
        : Date.parse(date).toString();
}

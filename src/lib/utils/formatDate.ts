export function formatDate(date: string): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return formatter.format(new Date(date));
}
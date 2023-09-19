export default function formatDate(date: Date | null): string | undefined {
    if (!date) return;

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    let suffix = 'th';
    if (day === 1 || (day > 20 && day % 10 === 1)) {
        suffix = 'st';
    } else if (day === 2 || (day > 20 && day % 10 === 2)) {
        suffix = 'nd';
    } else if (day === 3 || (day > 20 && day % 10 === 3)) {
        suffix = 'rd';
    }

    return `${day}${suffix} ${month} ${year}`;
}

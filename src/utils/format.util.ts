const LOCALE = "ar-IQ";

function toDate(value: string | Date): Date {
    return value instanceof Date ? value : new Date(value);
}

/** e.g. ٢ تشرين الثاني ٢٠٢٦ */
export function formatArabicDate(value: string | Date): string {
    return new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", year: "numeric" }).format(toDate(value));
}

/** e.g. ٢ تشرين الثاني ٢٠٢٦ - ٩:٢٠ ص */
export function formatArabicDateTime(value: string | Date): string {
    const d = toDate(value);
    const date = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", year: "numeric" }).format(d);
    const time = new Intl.DateTimeFormat(LOCALE, { hour: "numeric", minute: "2-digit" }).format(d);
    return `${date} - ${time}`;
}

/** Render a number with Arabic-Indic digits. */
export function formatArabicNumber(value: number): string {
    return new Intl.NumberFormat(LOCALE).format(value);
}

/** e.g. ١٠٬٠٠٠ د.ع */
export function formatCurrencyIQD(amount: number): string {
    return `${formatArabicNumber(amount)} د.ع`;
}

/** e.g. قبل ٣ أيام */
export function formatRelativeArabic(value: string | Date): string {
    const d = toDate(value);
    const diffMs = d.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });
    const minutes = Math.round(diffMs / 60000);
    const hours = Math.round(diffMs / 3600000);
    const days = Math.round(diffMs / 86400000);

    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    if (Math.abs(days) < 30) return rtf.format(days, "day");
    return formatArabicDate(d);
}

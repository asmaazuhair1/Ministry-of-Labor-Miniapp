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

/**
 * Arabic noun–number agreement for a count shown separately as a big number.
 * forms: [one, two, few (3–10), many (11+ and 0)].
 */
export function arabicCountNoun(count: number, forms: [string, string, string, string]): string {
    const n = Math.abs(Math.trunc(count));
    if (n === 1) return forms[0];
    if (n === 2) return forms[1];
    if (n >= 3 && n <= 10) return forms[2];
    return forms[3];
}

/** Day of month only, e.g. ٣ */
export function formatArabicDay(value: string | Date): string {
    return new Intl.DateTimeFormat(LOCALE, { day: "numeric" }).format(toDate(value));
}

/** Month name only, e.g. تشرين الثاني */
export function formatArabicMonth(value: string | Date): string {
    return new Intl.DateTimeFormat(LOCALE, { month: "long" }).format(toDate(value));
}

/** Estimated reading time in whole minutes (≥1) at ~180 Arabic words per minute. */
export function readingMinutes(text: string): number {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 180));
}

/** e.g. "قراءة في دقيقة" / "٣ دقائق قراءة" */
export function readingLabel(text: string): string {
    const n = readingMinutes(text);
    if (n === 1) return "قراءة في دقيقة";
    if (n === 2) return "قراءة في دقيقتين";
    return `${formatArabicNumber(n)} ${n <= 10 ? "دقائق" : "دقيقة"} قراءة`;
}

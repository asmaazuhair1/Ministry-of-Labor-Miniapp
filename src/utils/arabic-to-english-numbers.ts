const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Normalize Arabic-Indic / Persian digits in a string to ASCII 0-9. */
export function convertArabicToEnglishNumbers(value: string): string {
    return value.replace(/[٠-٩۰-۹]/g, (char) => {
        const ai = ARABIC_DIGITS.indexOf(char);
        if (ai > -1) return String(ai);
        const pi = PERSIAN_DIGITS.indexOf(char);
        if (pi > -1) return String(pi);
        return char;
    });
}

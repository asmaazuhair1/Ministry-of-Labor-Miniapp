import { convertArabicToEnglishNumbers } from "@/utils/arabic-to-english-numbers";
import { formatArabicNumber } from "@/utils/format.util";
import type { FormField, SchemaSection } from "@/types/services";

export type Validator = (value: string, field: FormField) => string | null;

/** Named validation rules referenced by FormField.validation (schema-driven, no zod). */
export const VALIDATORS: Record<string, Validator> = {
    required: (value) => (value.trim() ? null : "هذا الحقل مطلوب"),
    nationalId: (value) => {
        const digits = convertArabicToEnglishNumbers(value).replace(/\s/g, "");
        if (!digits) return null;
        return /^\d{12}$/.test(digits) ? null : "رقم الهوية يجب أن يتكوّن من ١٢ رقماً";
    },
    phone: (value) => {
        const digits = convertArabicToEnglishNumbers(value).replace(/\s/g, "");
        if (!digits) return null;
        return /^07\d{9}$/.test(digits) ? null : "رقم هاتف غير صحيح (مثال: ٠٧XXXXXXXXX)";
    },
    arabicName: (value) => {
        if (!value.trim()) return null;
        return /^[؀-ۿ\s]+$/.test(value.trim()) ? null : "الرجاء إدخال الاسم بالأحرف العربية فقط";
    },
    positiveNumber: (value) => {
        if (!value.trim()) return null;
        const n = Number(convertArabicToEnglishNumbers(value));
        return !Number.isNaN(n) && n > 0 ? null : "الرجاء إدخال رقم موجب";
    },
};

/** Validate a single field value against its required flag, rules, and constraints. */
export function validateField(field: FormField, raw: string): string | null {
    const value = raw ?? "";

    if (field.required && !value.trim()) return "هذا الحقل مطلوب";

    for (const rule of field.validation ?? []) {
        const err = VALIDATORS[rule]?.(value, field);
        if (err) return err;
    }

    const c = field.constraints;
    if (c && value.trim()) {
        if (field.type === "number") {
            const n = Number(convertArabicToEnglishNumbers(value));
            if (c.min !== undefined && n < c.min) return `القيمة يجب ألا تقل عن ${formatArabicNumber(c.min)}`;
            if (c.max !== undefined && n > c.max) return `القيمة يجب ألا تزيد عن ${formatArabicNumber(c.max)}`;
        } else {
            const len = value.trim().length;
            if (c.minLength !== undefined && len < c.minLength)
                return `يجب ألا يقل النص عن ${formatArabicNumber(c.minLength)} حرفاً`;
            if (c.maxLength !== undefined && len > c.maxLength)
                return `يجب ألا يزيد النص عن ${formatArabicNumber(c.maxLength)} حرفاً`;
        }
    }

    return null;
}

/** Validate every field in a schema. Returns a map of field name -> error message. */
export function validateSchema(schema: SchemaSection[], values: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const section of schema) {
        for (const field of section.fields) {
            const err = validateField(field, values[field.name] ?? "");
            if (err) errors[field.name] = err;
        }
    }
    return errors;
}

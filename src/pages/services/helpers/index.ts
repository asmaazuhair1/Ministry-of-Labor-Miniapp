import { convertArabicToEnglishNumbers } from "@/utils/arabic-to-english-numbers";
import type { FormField, SchemaSection, ServiceSummary } from "@/types/services";
import type { RequestFormValue } from "@/types/requests";

/** Count available/listed services per category id. */
export function countByCategory(services: ServiceSummary[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const service of services) {
        counts[service.categoryId] = (counts[service.categoryId] ?? 0) + 1;
    }
    return counts;
}

/** Flatten all fields of a schema into one list. */
export function flattenFields(schema: SchemaSection[]): FormField[] {
    return schema.flatMap((section) => section.fields);
}

/** Initialize an empty value map for every field in the schema. */
export function initialValues(schema: SchemaSection[]): Record<string, string> {
    const values: Record<string, string> = {};
    for (const field of flattenFields(schema)) {
        values[field.name] = "";
    }
    return values;
}

function displayValue(field: FormField, raw: string): string {
    if (field.type === "select") {
        return field.options?.find((o) => o.value === raw)?.label ?? raw;
    }
    if (field.type === "number") {
        return convertArabicToEnglishNumbers(raw);
    }
    return raw;
}

/** Build the API payload from schema + values (numbers normalized to ASCII). */
export function buildApplicationPayload(
    schema: SchemaSection[],
    values: Record<string, string>,
): Record<string, string | number> {
    const payload: Record<string, string | number> = {};
    for (const field of flattenFields(schema)) {
        const raw = values[field.name] ?? "";
        if (!raw.trim()) continue;
        if (field.type === "number") {
            payload[field.name] = Number(convertArabicToEnglishNumbers(raw));
        } else {
            payload[field.name] = raw.trim();
        }
    }
    return payload;
}

/** Produce human-readable label/value pairs for a submitted request summary. */
export function toFormValues(schema: SchemaSection[], values: Record<string, string>): RequestFormValue[] {
    return flattenFields(schema)
        .filter((field) => (values[field.name] ?? "").trim())
        .map((field) => ({ label: field.label, value: displayValue(field, values[field.name] ?? "") }));
}

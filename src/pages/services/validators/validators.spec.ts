import { describe, it, expect } from "vitest";
import { validateField, validateSchema } from "./index";
import type { FormField, SchemaSection } from "@/types/services";

function field(overrides: Partial<FormField>): FormField {
    return { name: "f", label: "حقل", type: "text", required: false, ...overrides };
}

describe("validateField", () => {
    it("flags empty required fields", () => {
        expect(validateField(field({ required: true }), "")).toBe("هذا الحقل مطلوب");
    });

    it("passes a filled required field", () => {
        expect(validateField(field({ required: true }), "قيمة")).toBeNull();
    });

    it("accepts a 12-digit national id in Arabic digits", () => {
        const f = field({ type: "national-id", validation: ["nationalId"] });
        expect(validateField(f, "١٩٩٠١٢٣٤٥٦٧٨")).toBeNull();
    });

    it("rejects a short national id", () => {
        const f = field({ type: "national-id", validation: ["nationalId"] });
        expect(validateField(f, "12345")).not.toBeNull();
    });

    it("validates Iraqi phone format", () => {
        const f = field({ type: "phone", validation: ["phone"] });
        expect(validateField(f, "07701234567")).toBeNull();
        expect(validateField(f, "12345")).not.toBeNull();
    });

    it("enforces numeric min/max constraints", () => {
        const f = field({ type: "number", validation: ["positiveNumber"], constraints: { min: 1, max: 30 } });
        expect(validateField(f, "5")).toBeNull();
        expect(validateField(f, "40")).not.toBeNull();
    });

    it("enforces textarea minLength", () => {
        const f = field({ type: "textarea", constraints: { minLength: 20 } });
        expect(validateField(f, "قصير")).not.toBeNull();
    });
});

describe("validateSchema", () => {
    const schema: SchemaSection[] = [
        {
            title: "قسم",
            fields: [field({ name: "name", required: true }), field({ name: "note", required: false })],
        },
    ];

    it("returns errors only for invalid fields", () => {
        const errors = validateSchema(schema, { name: "", note: "" });
        expect(errors.name).toBeDefined();
        expect(errors.note).toBeUndefined();
    });

    it("returns no errors when all valid", () => {
        const errors = validateSchema(schema, { name: "محمد", note: "" });
        expect(Object.keys(errors)).toHaveLength(0);
    });
});

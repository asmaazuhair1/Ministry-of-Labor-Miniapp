import { describe, it, expect } from "vitest";
import { buildApplicationPayload, countByCategory, initialValues, toFormValues } from "./index";
import type { SchemaSection, ServiceSummary } from "@/types/services";

const schema: SchemaSection[] = [
    {
        title: "القسم",
        fields: [
            { name: "fullName", label: "الاسم", type: "text", required: true },
            { name: "familySize", label: "عدد الأفراد", type: "number", required: true },
            {
                name: "housingType",
                label: "نوع السكن",
                type: "select",
                required: true,
                options: [{ value: "rent", label: "إيجار" }],
            },
        ],
    },
];

describe("countByCategory", () => {
    it("tallies services per category", () => {
        const services = [{ categoryId: "a" }, { categoryId: "a" }, { categoryId: "b" }] as ServiceSummary[];
        expect(countByCategory(services)).toEqual({ a: 2, b: 1 });
    });
});

describe("initialValues", () => {
    it("creates an empty string for each field", () => {
        expect(initialValues(schema)).toEqual({ fullName: "", familySize: "", housingType: "" });
    });
});

describe("buildApplicationPayload", () => {
    it("coerces numbers to ASCII and drops empty fields", () => {
        const payload = buildApplicationPayload(schema, { fullName: "محمد", familySize: "٥", housingType: "" });
        expect(payload).toEqual({ fullName: "محمد", familySize: 5 });
    });
});

describe("toFormValues", () => {
    it("maps select values to their labels", () => {
        const values = { fullName: "محمد", familySize: "5", housingType: "rent" };
        const result = toFormValues(schema, values);
        expect(result).toContainEqual({ label: "نوع السكن", value: "إيجار" });
    });
});

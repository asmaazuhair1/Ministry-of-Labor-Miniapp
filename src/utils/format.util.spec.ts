import { describe, expect, it } from "vitest";
import { arabicCountNoun } from "./format.util";

const FORMS: [string, string, string, string] = ["خدمة متاحة", "خدمتان متاحتان", "خدمات متاحة", "خدمة متاحة"];

describe("arabicCountNoun", () => {
    it("picks the right form per count", () => {
        expect(arabicCountNoun(1, FORMS)).toBe("خدمة متاحة");
        expect(arabicCountNoun(2, FORMS)).toBe("خدمتان متاحتان");
        expect(arabicCountNoun(3, FORMS)).toBe("خدمات متاحة");
        expect(arabicCountNoun(10, FORMS)).toBe("خدمات متاحة");
        expect(arabicCountNoun(11, FORMS)).toBe("خدمة متاحة");
        expect(arabicCountNoun(0, FORMS)).toBe("خدمة متاحة");
    });
});

import { readingMinutes } from "./format.util";

describe("readingMinutes", () => {
    it("never returns less than one minute", () => {
        expect(readingMinutes("")).toBe(1);
        expect(readingMinutes("كلمة واحدة")).toBe(1);
    });
    it("scales with length", () => {
        expect(readingMinutes(Array(540).fill("كلمة").join(" "))).toBe(3);
    });
});

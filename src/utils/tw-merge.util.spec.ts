import { describe, expect, it } from "vitest";
import { twMerge } from "./tw-merge.util";

describe("twMerge with Naseej tokens", () => {
    it("keeps text colour alongside a custom font-size token", () => {
        const out = twMerge("text-on-primary", "text-label");
        expect(out).toContain("text-on-primary");
        expect(out).toContain("text-label");
    });

    it("still resolves conflicting custom font sizes", () => {
        expect(twMerge("text-label", "text-headline")).toBe("text-headline");
    });
});

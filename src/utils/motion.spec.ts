import { describe, expect, it } from "vitest";
import { cubicBezier, duration, easing, stagger, STAGGER_LIMIT } from "./motion";

describe("motion helper", () => {
    it("cubicBezier hits endpoints and stays monotonic for standard curve", () => {
        const ease = cubicBezier(0.2, 0, 0, 1);
        expect(ease(0)).toBe(0);
        expect(ease(1)).toBe(1);
        let prev = 0;
        for (let t = 0.05; t < 1; t += 0.05) {
            const v = ease(t);
            expect(v).toBeGreaterThanOrEqual(prev);
            prev = v;
        }
    });

    it("linear bezier is identity", () => {
        const linear = cubicBezier(0, 0, 1, 1);
        expect(linear(0.37)).toBeCloseTo(0.37, 3);
    });

    it("falls back to token defaults when CSS vars are absent", () => {
        expect(duration("base")).toBe(260);
        expect(easing("spring")(1)).toBe(1);
    });

    it("caps stagger after STAGGER_LIMIT items", () => {
        expect(stagger(0)).toBe(0);
        expect(stagger(STAGGER_LIMIT + 5)).toBe(stagger(STAGGER_LIMIT));
    });
});

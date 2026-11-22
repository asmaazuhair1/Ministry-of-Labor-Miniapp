import { fade, fly, scale, type FadeParams, type FlyParams, type ScaleParams } from "svelte/transition";
import { prefersReducedMotion } from "svelte/motion";

/*
 * Naseej motion system. Every duration and easing is read from the tokens in
 * src/app.css (@theme), so pages never hand-write timings. All presets collapse
 * to a short fade (or nothing) when the user prefers reduced motion.
 */

export type DurationToken = "instant" | "fast" | "base" | "slow" | "hero" | "stagger";
export type EasingToken = "standard" | "decelerate" | "accelerate" | "spring";

const FALLBACK_MS: Record<DurationToken, number> = {
    instant: 100,
    fast: 180,
    base: 260,
    slow: 420,
    hero: 600,
    stagger: 40,
};
const FALLBACK_EASE: Record<EasingToken, [number, number, number, number]> = {
    standard: [0.2, 0, 0, 1],
    decelerate: [0.05, 0.7, 0.1, 1],
    accelerate: [0.3, 0, 0.8, 0.15],
    spring: [0.34, 1.3, 0.64, 1],
};

/** Max items that get a staggered delay; the rest appear with the last step. */
export const STAGGER_LIMIT = 8;
const REDUCED_MS = 120;

function cssVar(name: string): string {
    if (typeof document === "undefined") return "";
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const durationCache = new Map<DurationToken, number>();
/** Duration token in ms (e.g. duration("base") → 260). */
export function duration(token: DurationToken): number {
    const cached = durationCache.get(token);
    if (cached !== undefined) return cached;
    const raw = cssVar(`--duration-${token}`);
    const ms = raw.endsWith("ms") ? parseFloat(raw) : raw.endsWith("s") ? parseFloat(raw) * 1000 : NaN;
    const value = Number.isFinite(ms) ? ms : FALLBACK_MS[token];
    durationCache.set(token, value);
    return value;
}

/** Build a JS easing function from cubic-bezier control points (Newton–Raphson + bisection). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
    const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
    const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

    function solveT(x: number): number {
        let t = x;
        for (let i = 0; i < 8; i++) {
            const err = sampleX(t) - x;
            if (Math.abs(err) < 1e-5) return t;
            const d = slopeX(t);
            if (Math.abs(d) < 1e-6) break;
            t -= err / d;
        }
        let lo = 0;
        let hi = 1;
        t = x;
        while (lo < hi) {
            const v = sampleX(t);
            if (Math.abs(v - x) < 1e-5) return t;
            if (x > v) lo = t;
            else hi = t;
            t = (lo + hi) / 2;
            if (hi - lo < 1e-6) break;
        }
        return t;
    }

    return (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : sampleY(solveT(t)));
}

const easingCache = new Map<EasingToken, (t: number) => number>();
/** Easing token as a JS function usable by svelte/transition and svelte/motion. */
export function easing(token: EasingToken): (t: number) => number {
    const cached = easingCache.get(token);
    if (cached) return cached;
    const match = cssVar(`--ease-${token}`).match(/cubic-bezier\(([^)]+)\)/);
    const points = match ? match[1].split(",").map((n) => parseFloat(n)) : [];
    const [x1, y1, x2, y2] = points.length === 4 && points.every(Number.isFinite) ? points : FALLBACK_EASE[token];
    const fn = cubicBezier(x1, y1, x2, y2);
    easingCache.set(token, fn);
    return fn;
}

/** True when the user asked the OS for reduced motion (reactive in .svelte files). */
export function reducedMotion(): boolean {
    return prefersReducedMotion.current;
}

/** Stagger delay for the i-th item of a list (capped at STAGGER_LIMIT). */
export function stagger(index: number, base = 0): number {
    if (reducedMotion()) return 0;
    return base + Math.min(index, STAGGER_LIMIT) * duration("stagger");
}

// ---- Transition presets ------------------------------------------------
// Usage: <div in:rise={{ delay: stagger(i) }}> / <div transition:sheetSlide>

const reducedFade = (node: Element, delay = 0) => fade(node, { duration: REDUCED_MS, delay });

/** Fade with the standard curve. */
export function fadeIn(node: Element, params: FadeParams = {}) {
    if (reducedMotion()) return reducedFade(node, params.delay);
    return fade(node, { duration: duration("base"), easing: easing("standard"), ...params });
}

/** Entrance: rise 12px + fade (lists, sections, cards). */
export function rise(node: Element, params: FlyParams = {}) {
    if (reducedMotion()) return reducedFade(node, params.delay);
    return fly(node, { y: 12, opacity: 0, duration: duration("slow"), easing: easing("decelerate"), ...params });
}

/** Pop-in for confirmations, badges and check marks (mild overshoot). */
export function pop(node: Element, params: ScaleParams = {}) {
    if (reducedMotion()) return reducedFade(node, params.delay);
    return scale(node, { start: 0.85, opacity: 0, duration: duration("base"), easing: easing("spring"), ...params });
}

/** Bottom sheet enter/exit. */
export function sheetSlide(node: Element, params: FlyParams = {}) {
    if (reducedMotion()) return reducedFade(node, params.delay);
    return fly(node, { y: 48, opacity: 0, duration: duration("slow"), easing: easing("decelerate"), ...params });
}

export type NavDirection = "forward" | "back";

/**
 * Directional page slide that respects RTL: in an RTL app "forward" content
 * arrives from the inline-end (the left) and "back" content from the right.
 */
export function pageSlide(node: Element, params: { direction?: NavDirection; delay?: number } = {}) {
    if (reducedMotion()) return reducedFade(node, params.delay);
    const rtl = document.documentElement.dir === "rtl";
    const forward = (params.direction ?? "forward") === "forward";
    const sign = forward === rtl ? -1 : 1;
    return fly(node, {
        x: 24 * sign,
        opacity: 0,
        duration: duration("slow"),
        easing: easing("decelerate"),
        delay: params.delay,
    });
}

/**
 * Run a DOM update inside a View Transition when supported (and motion is
 * allowed); otherwise just run it. Callers keep their Svelte-transition fallback.
 */
export function withViewTransition(update: () => void | Promise<void>): void {
    const doc = document as Document & { startViewTransition?: (cb: () => void | Promise<void>) => unknown };
    if (!reducedMotion() && typeof doc.startViewTransition === "function") {
        doc.startViewTransition(update);
    } else {
        void update();
    }
}

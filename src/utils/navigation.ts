import { tick } from "svelte";
import { get, writable } from "svelte/store";
import { location, pop, push, replace } from "svelte-spa-router";
import { reducedMotion } from "@/utils/motion";

/*
 * Navigation with motion that explains direction. Uses the View Transitions API
 * when available (CSS in app.css keyed on html[data-nav]); otherwise the layout
 * falls back to Svelte transitions driven by `navDirection`.
 */

export type NavKind = "forward" | "back" | "tab";

export const navDirection = writable<NavKind>("forward");

type ViewTransitionDoc = Document & {
    startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> };
};

export function supportsViewTransitions(): boolean {
    return typeof document !== "undefined" && typeof (document as ViewTransitionDoc).startViewTransition === "function";
}

function nextLocationChange(): Promise<void> {
    const before = get(location);
    return new Promise((resolve) => {
        let unsub: (() => void) | undefined;
        const timer = setTimeout(() => {
            unsub?.();
            resolve();
        }, 400);
        unsub = location.subscribe((value) => {
            if (value !== before) {
                clearTimeout(timer);
                queueMicrotask(() => unsub?.());
                resolve();
            }
        });
    });
}

function run(kind: NavKind, change: () => unknown) {
    navDirection.set(kind);
    const doc = document as ViewTransitionDoc;
    if (!reducedMotion() && supportsViewTransitions()) {
        document.documentElement.dataset.nav = kind;
        const transition = doc.startViewTransition!(async () => {
            const changed = nextLocationChange();
            change();
            await changed;
            await tick();
        });
        transition.finished.finally(() => delete document.documentElement.dataset.nav);
    } else {
        change();
    }
}

/** Go deeper (detail, form…). */
export function go(path: string): void {
    run("forward", () => push(path));
}

/** Switch top-level tab (crossfade, no direction). */
export function goTab(path: string): void {
    run("tab", () => push(path));
}

/** Replace the current entry (e.g. after submitting a form). */
export function goReplace(path: string): void {
    run("forward", () => replace(path));
}

/** Go back one step. */
export function back(): void {
    run("back", () => pop());
}

/**
 * Helpers for detecting and talking to the SuperQi mini-app host shell.
 *
 * Inside the real shell a global `my` bridge object is injected. In a plain
 * browser (dev / preview) it is absent, so every call is guarded with
 * `typeof my !== "undefined"` and falls back to browser behaviour.
 */

interface SuperQiBridge {
    exitMiniProgram?: () => void;
    closeApp?: () => void;
    navigateBack?: () => void;
    [key: string]: unknown;
}

declare const my: SuperQiBridge | undefined;

/** True when running inside the SuperQi host shell (native chrome is present). */
export function isSuperQiShell(): boolean {
    return typeof my !== "undefined";
}

/**
 * Close the mini-app. Inside the shell, delegate to the host's close bridge;
 * in the browser, run the provided fallback (e.g. navigate home).
 */
export function closeMiniApp(fallback: () => void): void {
    if (typeof my !== "undefined") {
        const close = my.exitMiniProgram ?? my.closeApp ?? my.navigateBack;
        if (typeof close === "function") {
            close();
            return;
        }
    }
    fallback();
}

export type HapticKind = "light" | "success" | "error";

/**
 * Haptic feedback on key actions via the host bridge. No-op in the browser or
 * when the host lacks the API — never throws.
 */
export function haptic(kind: HapticKind = "light"): void {
    if (typeof my === "undefined") return;
    const fn = kind === "light" ? my.vibrateShort : (my.vibrateLong ?? my.vibrateShort);
    if (typeof fn === "function") {
        try {
            (fn as () => void).call(my);
        } catch {
            // Host refused; feedback is optional.
        }
    }
}

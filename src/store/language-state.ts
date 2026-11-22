import { writable } from "svelte/store";

export type AppLanguage = "ar" | "ku";

/** localStorage key for the language the citizen picked on first launch. */
export const LANGUAGE_KEY = "mol-language";

function readSaved(): AppLanguage | null {
    if (typeof localStorage === "undefined") return null;
    const v = localStorage.getItem(LANGUAGE_KEY);
    return v === "ar" || v === "ku" ? v : null;
}

/** True until the citizen has chosen a language once on this device. */
export function needsLanguageChoice(): boolean {
    return readSaved() === null;
}

/** App language (UI copy is Arabic for now; the choice is stored for later use). */
export const appLanguage = writable<AppLanguage>(readSaved() ?? "ar");

/** Set and remember the app language. */
export function setLanguage(lang: AppLanguage): void {
    appLanguage.set(lang);
    if (typeof localStorage !== "undefined") localStorage.setItem(LANGUAGE_KEY, lang);
}

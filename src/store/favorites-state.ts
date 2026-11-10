import { writable } from "svelte/store";

/**
 * In-memory set of "favorited" route keys. State lives only for the session
 * (resets on reload) — no localStorage / storage adapter by design.
 */
export const favorites = writable<Set<string>>(new Set());

/** Toggle a key's favorite status. */
export function toggleFavorite(key: string): void {
    favorites.update((current) => {
        const next = new Set(current);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        return next;
    });
}

/** Clear all favorites (primarily for tests / sign-out). */
export function clearFavorites(): void {
    favorites.set(new Set());
}

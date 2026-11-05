import { writable } from "svelte/store";

export const loadingState = writable<boolean>(false);

export function setLoading(value: boolean): void {
    loadingState.set(value);
}

import { writable } from "svelte/store";
import type { UserProfile } from "@/types/profile";

export const accessToken = writable<string | null>(null);
export const isGuest = writable<boolean>(false);
export const userData = writable<UserProfile | null>(null);

export function clearTokens(): void {
    accessToken.set(null);
    userData.set(null);
}

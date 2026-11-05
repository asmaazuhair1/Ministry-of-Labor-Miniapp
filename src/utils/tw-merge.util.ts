import { clsx, type ClassValue } from "clsx";
import { twMerge as baseTwMerge } from "tailwind-merge";

/** Merge Tailwind class lists, resolving conflicts (last wins). */
export function twMerge(...inputs: ClassValue[]): string {
    return baseTwMerge(clsx(inputs));
}

import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * tailwind-merge must know our custom theme tokens, otherwise e.g. `text-label`
 * (a font size) is mistaken for a text colour and silently drops `text-on-primary`.
 */
const merge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [{ text: ["display", "title-1", "title-2", "headline", "body", "label", "caption"] }],
            shadow: [{ shadow: ["e1", "e2", "e3", "e4"] }],
            rounded: [{ rounded: ["chip", "frame", "field", "card", "hero", "pill"] }],
        },
    },
});

/** Merge Tailwind class lists, resolving conflicts (last wins). */
export function twMerge(...inputs: ClassValue[]): string {
    return merge(clsx(inputs));
}

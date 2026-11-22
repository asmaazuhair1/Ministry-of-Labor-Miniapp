import type { AccentKey } from "@/utils/accent.util";

export type AnnouncementCategory = string;

export interface Announcement {
    id: string;
    category: AnnouncementCategory;
    title: string;
    description: string;
    date: string;
    accent: AccentKey;
    /** Cover photo (public path). */
    image?: string;
    /** Full announcement text (details page). */
    body?: string;
    /** Short "what you need to know" points. */
    points?: string[];
    /** The one action this announcement asks for. */
    cta?: { label: string; path: string };
}

export interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    date: string;
    accent: AccentKey;
    icon: string;
    /** Cover photo (public path). */
    image?: string;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface LawDocument {
    id: string;
    kind: "law" | "instruction";
    title: string;
    date: string;
    /** Icon shown on the file thumbnail (e.g. "scales" for laws, "file-text" for instructions). */
    icon: string;
    /** File URL once the backend provides one; null in demo mode. */
    fileUrl: string | null;
}

import type { AccentKey } from "@/utils/accent.util";

export type AnnouncementCategory = string;

export interface Announcement {
    id: string;
    category: AnnouncementCategory;
    title: string;
    description: string;
    date: string;
    accent: AccentKey;
}

export interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    date: string;
    accent: AccentKey;
    icon: string;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

import { demoRequest } from "@/services/demo-transport";
import { DEMO_ANNOUNCEMENTS, DEMO_NEWS } from "@/config/demo/content.demo";
import type { Announcement, NewsItem } from "@/types/content";

/* Home content data layer (DEMO-backed via demoRequest). */

export function getAnnouncements() {
    return demoRequest<Announcement[]>(DEMO_ANNOUNCEMENTS);
}

export function getNews() {
    return demoRequest<NewsItem[]>(DEMO_NEWS);
}

export function getNewsById(newsId: string) {
    return demoRequest<NewsItem | null>(DEMO_NEWS.find((n) => n.id === newsId) ?? null);
}

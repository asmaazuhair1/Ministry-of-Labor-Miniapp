import { demoRequest } from "@/services/demo-transport";
import { DEMO_NEWS } from "@/config/demo/content.demo";
import type { NewsItem } from "@/types/content";

/* News content data layer (DEMO-backed via demoRequest). */

export function getNews() {
    return demoRequest<NewsItem[]>(DEMO_NEWS);
}

export function getNewsById(newsId: string) {
    return demoRequest<NewsItem | null>(DEMO_NEWS.find((n) => n.id === newsId) ?? null);
}

import { demoRequest } from "@/services/demo-transport";
import { DEMO_ANNOUNCEMENTS, DEMO_LAWS } from "@/config/demo/content.demo";
import type { Announcement, LawDocument } from "@/types/content";

/* Home content data layer (DEMO-backed via demoRequest). */

export function getAnnouncements() {
    return demoRequest<Announcement[]>(DEMO_ANNOUNCEMENTS);
}

export function getAnnouncementById(id: string) {
    return demoRequest<Announcement | null>(DEMO_ANNOUNCEMENTS.find((a) => a.id === id) ?? null);
}

export function getLaws() {
    return demoRequest<LawDocument[]>(DEMO_LAWS);
}

// News data lives in the News feature; re-exported here for the Home sections.
export { getNews, getNewsById } from "@/pages/news/service";

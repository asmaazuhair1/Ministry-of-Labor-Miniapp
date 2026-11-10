import { demoRequest } from "@/services/demo-transport";
import { DEMO_ANNOUNCEMENTS } from "@/config/demo/content.demo";
import type { Announcement } from "@/types/content";

/* Home content data layer (DEMO-backed via demoRequest). */

export function getAnnouncements() {
    return demoRequest<Announcement[]>(DEMO_ANNOUNCEMENTS);
}

// News data lives in the News feature; re-exported here for the Home sections.
export { getNews, getNewsById } from "@/pages/news/service";

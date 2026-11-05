import { writable, derived } from "svelte/store";
import type { AppNotification } from "@/types/notifications";
import { DEMO_NOTIFICATIONS } from "@/config/demo/notifications.demo";

export const notifications = writable<AppNotification[]>(DEMO_NOTIFICATIONS);

export const unreadCount = derived(notifications, ($list) => $list.filter((n) => !n.read).length);

export function markAsRead(id: string): void {
    notifications.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllAsRead(): void {
    notifications.update((list) => list.map((n) => ({ ...n, read: true })));
}

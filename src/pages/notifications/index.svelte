<script lang="ts">
    import { flip } from "svelte/animate";
    import EmptyState from "@/components/empty-state.svelte";
    import Button from "@/components/ui/button.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import NotificationRow from "./components/notification-row.svelte";
    import { notifications, unreadCount, markAsRead, markAllAsRead } from "@/store/notifications-state";
    import { arabicCountNoun } from "@/utils/format.util";
    import { duration, easing, fadeIn, reducedMotion, rise, stagger } from "@/utils/motion";
    import { go } from "@/utils/navigation";
    import type { AppNotification } from "@/types/notifications";

    const sorted = $derived(
        $notifications.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    );
    const fresh = $derived(sorted.filter((n) => !n.read));
    const earlier = $derived(sorted.filter((n) => n.read));

    const FORMS: [string, string, string, string] = ["إشعار جديد", "إشعارات جديدة", "إشعارات جديدة", "إشعاراً جديداً"];
    const flipOptions = () => ({ duration: reducedMotion() ? 0 : duration("slow"), easing: easing("standard") });

    function open(item: AppNotification) {
        markAsRead(item.id);
        if (item.requestId) go(`/requests/${item.requestId}`);
    }
</script>

<div class="px-gutter pt-5 pb-8">
    {#if sorted.length === 0}
        <EmptyState icon="bell" title="كل شيء هادئ" description="ستظهر هنا تحديثات معاملاتك وإعلانات الوزارة." />
    {:else}
        <!-- Moment -->
        <section class="flex items-end justify-between gap-3" in:rise>
            <div class="flex items-end gap-3">
                <span class="text-display text-primary leading-none"><CountUp value={$unreadCount} /></span>
                <span class="pb-0.5 text-headline text-on-surface">
                    {$unreadCount === 0 ? "لا جديد" : arabicCountNoun($unreadCount, FORMS)}
                </span>
            </div>
            {#if $unreadCount > 0}
                <Button variant="ghost" class="-me-3 h-11 px-3" onclick={markAllAsRead}>تعليم الكل كمقروء</Button>
            {/if}
        </section>
        {#if $unreadCount > 0}
            <p class="mt-2 text-caption text-on-surface-muted">اسحب الإشعار جانباً لتعليمه كمقروء.</p>
        {/if}

        <!-- Two groups (proximity). Reading an item moves it: fades out of "new", rises into "earlier". -->
        {#each [{ title: "جديدة", items: fresh, offset: 1 }, { title: "سابقة", items: earlier, offset: fresh.length + 1 }] as group (group.title)}
            {#if group.items.length}
                <section class="mt-6">
                    <h2 class="mb-3 text-label text-on-surface-muted">{group.title}</h2>
                    <ul class="flex flex-col gap-3">
                        {#each group.items as item, i (item.id)}
                            <li
                                animate:flip={flipOptions()}
                                in:rise={{ delay: stagger(i + group.offset) }}
                                out:fadeIn={{ duration: duration("fast") }}
                            >
                                <NotificationRow {item} onOpen={open} onRead={markAsRead} />
                            </li>
                        {/each}
                    </ul>
                </section>
            {/if}
        {/each}
    {/if}
</div>

<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import { notifications, unreadCount, markAsRead, markAllAsRead } from "@/store/notifications-state";
    import { formatRelativeArabic } from "@/utils/format.util";
    import type { NotificationKind } from "@/types/notifications";

    const KIND_ICON: Record<NotificationKind, string> = {
        submission: "file-text",
        "status-change": "arrow-right",
        "payment-request": "wallet",
        "payment-confirmed": "check-circle",
        "missing-documents": "warning-circle",
        approved: "check-circle",
        rejected: "x-circle",
        announcement: "megaphone",
    };

    const KIND_COLOR: Record<NotificationKind, string> = {
        submission: "bg-info-container text-info",
        "status-change": "bg-info-container text-info",
        "payment-request": "bg-payment-container text-payment",
        "payment-confirmed": "bg-success-container text-success",
        "missing-documents": "bg-warning-container text-warning",
        approved: "bg-success-container text-success",
        rejected: "bg-danger-container text-danger",
        announcement: "bg-tertiary-container text-tertiary",
    };

    function open(id: string, requestId?: string) {
        markAsRead(id);
        if (requestId) push(`/requests/${requestId}`);
    }
</script>

<div class="py-4 animate-fade-up">
    {#if $notifications.length === 0}
        <EmptyState title="لا توجد إشعارات" description="ستظهر هنا تحديثات معاملاتك وإعلانات الوزارة." />
    {:else}
        {#if $unreadCount > 0}
            <div class="px-4 mb-3 flex justify-end">
                <button
                    type="button"
                    onclick={markAllAsRead}
                    class="text-[12px] font-bold text-primary active:opacity-70 transition"
                >
                    تعليم الكل كمقروء
                </button>
            </div>
        {/if}

        <ul class="px-4 flex flex-col gap-2.5">
            {#each $notifications as item (item.id)}
                <li>
                    <button
                        type="button"
                        onclick={() => open(item.id, item.requestId)}
                        class="w-full flex items-start gap-3 rounded-card border p-3.5 text-start shadow-card transition active:scale-[0.99] {item.read
                            ? 'bg-surface-container border-outline-variant'
                            : 'bg-primary-container/40 border-primary-container'}"
                    >
                        <span class="grid place-items-center w-10 h-10 shrink-0 rounded-full {KIND_COLOR[item.kind]}">
                            <AppIcon name={KIND_ICON[item.kind]} size={20} weight="fill" />
                        </span>
                        <span class="flex-1 min-w-0">
                            <span class="flex items-center gap-2">
                                <span class="flex-1 text-[13px] font-extrabold text-on-surface leading-snug"
                                    >{item.title}</span
                                >
                                {#if !item.read}
                                    <span class="w-2 h-2 shrink-0 rounded-full bg-primary"></span>
                                {/if}
                            </span>
                            <span class="mt-1 block text-[12.5px] leading-relaxed text-on-surface-variant"
                                >{item.body}</span
                            >
                            <span class="mt-1.5 block text-[11px] text-on-surface-muted"
                                >{formatRelativeArabic(item.date)}</span
                            >
                        </span>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

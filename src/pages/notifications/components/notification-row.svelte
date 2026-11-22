<script lang="ts">
    import { Spring } from "svelte/motion";
    import AppIcon from "@/components/app-icon.svelte";
    import { formatRelativeArabic } from "@/utils/format.util";
    import { reducedMotion } from "@/utils/motion";
    import { haptic } from "@/utils/superqi.util";
    import type { AppNotification, NotificationKind } from "@/types/notifications";

    /*
     * Notification row. Tap opens it; swipe sideways past the threshold to mark
     * it read (the row springs back and the list re-flows it into "earlier").
     */
    interface Props {
        item: AppNotification;
        onOpen: (item: AppNotification) => void;
        onRead: (id: string) => void;
    }
    const { item, onOpen, onRead }: Props = $props();

    const KIND_ICON: Record<NotificationKind, string> = {
        submission: "file-text",
        "status-change": "arrow-left",
        "payment-request": "wallet",
        "payment-confirmed": "check-circle",
        "missing-documents": "warning-circle",
        approved: "check-circle",
        rejected: "x-circle",
        announcement: "megaphone",
    };
    // Semantic colour = information (status), never decoration.
    const KIND_TONE: Record<NotificationKind, string> = {
        submission: "bg-info-container text-info",
        "status-change": "bg-info-container text-info",
        "payment-request": "bg-payment-container text-payment",
        "payment-confirmed": "bg-success-container text-success",
        "missing-documents": "bg-warning-container text-warning",
        approved: "bg-success-container text-success",
        rejected: "bg-danger-container text-danger",
        announcement: "bg-secondary-container text-secondary",
    };

    const THRESHOLD = 72;
    const x = new Spring(0, { stiffness: 0.15, damping: 0.8 });
    let start: { x: number; y: number } | null = null;
    let horizontal = false;
    let moved = false;

    const armed = $derived(Math.abs(x.current) > THRESHOLD);

    function down(e: PointerEvent) {
        start = { x: e.clientX, y: e.clientY };
        horizontal = false;
        moved = false;
    }
    function move(e: PointerEvent) {
        if (!start || item.read) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (!horizontal) {
            if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
            horizontal = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }
        moved = true;
        x.set(Math.max(-120, Math.min(120, dx)), { instant: true });
    }
    function up() {
        if (!start) return;
        start = null;
        if (moved && armed && !item.read) {
            haptic("light");
            onRead(item.id);
        }
        x.set(0, { instant: reducedMotion() });
    }
    function click() {
        if (moved) return;
        onOpen(item);
    }
</script>

<div class="relative overflow-hidden rounded-card">
    <!-- Revealed behind the row while swiping -->
    {#if !item.read}
        <div
            class="absolute inset-0 flex items-center px-6 bg-primary-container text-primary {x.current > 0
                ? 'justify-start'
                : 'justify-end'}"
            aria-hidden="true"
        >
            <span
                class="inline-flex items-center gap-1.5 text-label transition-transform duration-[var(--duration-fast)] {armed
                    ? 'scale-110'
                    : 'scale-100'}"
            >
                <AppIcon name="check" size={18} weight="bold" /> تم القراءة
            </span>
        </div>
    {/if}

    <button
        type="button"
        onclick={click}
        onpointerdown={down}
        onpointermove={move}
        onpointerup={up}
        onpointercancel={up}
        class="relative w-full flex items-start gap-3 p-4 text-start touch-pan-y select-none transition-colors duration-[var(--duration-base)] {item.read
            ? 'bg-surface-container'
            : 'bg-surface-container shadow-e1'}"
        style="transform: translateX({x.current}px)"
        aria-label="{item.title}{item.read ? '' : '، غير مقروء'}"
    >
        <span class="grid place-items-center w-11 h-11 shrink-0 rounded-full {KIND_TONE[item.kind]}">
            <AppIcon name={KIND_ICON[item.kind]} size={20} weight="fill" />
        </span>
        <span class="flex-1 min-w-0">
            <span class="flex items-start gap-2">
                <span class="flex-1 text-label {item.read ? 'text-on-surface-variant' : 'text-on-surface'}"
                    >{item.title}</span
                >
                {#if !item.read}
                    <span class="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-primary" aria-hidden="true"></span>
                {/if}
            </span>
            <span class="mt-1 block text-body text-on-surface-variant line-clamp-2">{item.body}</span>
            <span class="mt-1.5 block text-caption text-on-surface-muted">{formatRelativeArabic(item.date)}</span>
        </span>
    </button>
</div>

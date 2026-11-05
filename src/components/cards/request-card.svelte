<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import StatusBadge from "@/components/status-badge.svelte";
    import ProgressIndicator from "@/components/requests/progress-indicator.svelte";
    import { formatArabicDate } from "@/utils/format.util";
    import type { RequestSummary } from "@/types/requests";

    interface Props {
        request: RequestSummary;
        onClick: (id: string) => void;
    }

    const { request, onClick }: Props = $props();
</script>

<button
    type="button"
    onclick={() => onClick(request.id)}
    class="w-full text-start rounded-card bg-surface-container border border-outline-variant p-4 shadow-card active:scale-[0.99] transition"
>
    <div class="flex items-start gap-3">
        <span class="grid place-items-center w-11 h-11 shrink-0 rounded-2xl bg-primary-container">
            <AppIcon name={request.serviceIcon} size={23} weight="fill" class="text-primary" />
        </span>
        <div class="flex-1 min-w-0">
            <p class="text-sm font-extrabold text-on-surface leading-snug line-clamp-2">{request.serviceTitle}</p>
            <p class="mt-1 flex items-center gap-1.5 text-[11px] text-on-surface-muted">
                <AppIcon name="scroll" size={13} />
                <span class="font-mono tracking-tight">{request.reference}</span>
            </p>
        </div>
        <StatusBadge status={request.status} size="sm" />
    </div>

    <div class="mt-4">
        <ProgressIndicator stages={request.stages} status={request.status} />
    </div>

    <div class="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-[11px] text-on-surface-muted">
            <AppIcon name="calendar" size={13} />
            {formatArabicDate(request.submittedAt)}
        </span>
        <span class="flex items-center gap-1 text-[11px] font-bold text-primary">
            التفاصيل
            <AppIcon name="caret-left" size={13} weight="bold" />
        </span>
    </div>
</button>

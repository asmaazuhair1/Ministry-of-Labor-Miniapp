<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import { STATUS_DEFINITIONS, STATUS_TOKEN_DOT } from "@/config/status.config";
    import { formatArabicDate } from "@/utils/format.util";
    import type { RequestSummary } from "@/types/requests";

    /** Request summary: arch icon, title, segmented stage progress. */
    interface Props {
        request: RequestSummary;
        onClick: (id: string) => void;
    }

    const { request, onClick }: Props = $props();

    const token = $derived(STATUS_DEFINITIONS[request.status].token);
    const doneCount = $derived(request.stages.filter((s) => s.state === "done").length);
    const currentIndex = $derived(request.stages.findIndex((s) => s.state === "current"));
    const currentTitle = $derived(
        currentIndex >= 0 ? request.stages[currentIndex].title : request.stages[request.stages.length - 1]?.title,
    );
</script>

<button
    type="button"
    onclick={() => onClick(request.id)}
    class="pressable w-full text-start rounded-card bg-surface-container p-4 shadow-e1 active:shadow-none"
>
    <div class="flex items-center gap-3.5">
        <IconFrame icon={request.serviceIcon} size="sm" transitionName="request-icon-{request.id}" />
        <div class="flex-1 min-w-0">
            <p class="text-headline text-on-surface line-clamp-2">{request.serviceTitle}</p>
            <p class="mt-1 text-caption text-on-surface-muted">{formatArabicDate(request.submittedAt)}</p>
            <span class="sr-only">{STATUS_DEFINITIONS[request.status].label}</span>
        </div>
    </div>

    <!-- Segmented progress: one segment per stage -->
    <div class="mt-4 flex gap-1" aria-hidden="true">
        {#each request.stages as stage (stage.key)}
            <span class="relative flex-1 h-1.5 overflow-hidden rounded-pill bg-surface-container-high">
                {#if stage.state === "done"}
                    <span class="absolute inset-0 {STATUS_TOKEN_DOT[token]}"></span>
                {:else if stage.state === "current"}
                    <span class="absolute inset-y-0 start-0 w-1/2 {STATUS_TOKEN_DOT[token]} opacity-60"></span>
                {/if}
            </span>
        {/each}
    </div>

    <div class="mt-3 flex items-center justify-between gap-3 text-caption">
        <span class="min-w-0 truncate text-on-surface-variant">
            <span class="tabular-nums">{doneCount}/{request.stages.length}</span> · {currentTitle}
        </span>
        <AppIcon name="caret-left" size={14} class="shrink-0 text-on-surface-muted" />
    </div>
</button>

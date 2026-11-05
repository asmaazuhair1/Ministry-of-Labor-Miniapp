<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { STATUS_DEFINITIONS, STATUS_TOKEN_DOT, STATUS_TOKEN_TEXT } from "@/config/status.config";
    import { formatArabicDateTime } from "@/utils/format.util";
    import type { RequestStage, RequestStatus } from "@/types/requests";

    interface Props {
        stages: RequestStage[];
        status: RequestStatus;
    }

    const { stages, status }: Props = $props();
    const token = $derived(STATUS_DEFINITIONS[status].token);
</script>

<ol class="relative">
    {#each stages as stage, i (stage.key)}
        {@const isDone = stage.state === "done"}
        {@const isCurrent = stage.state === "current"}
        {@const isLast = i === stages.length - 1}
        <li class="relative flex gap-3 pb-6 last:pb-0">
            {#if !isLast}
                <span
                    class="absolute top-7 w-0.5 bottom-0 {isDone ? STATUS_TOKEN_DOT[token] : 'bg-outline-variant'}"
                    style="inset-inline-start: 13px;"
                ></span>
            {/if}
            <span
                class="relative z-10 grid place-items-center w-7 h-7 shrink-0 rounded-full
                {isDone || isCurrent
                    ? STATUS_TOKEN_DOT[token] + ' text-on-primary'
                    : 'bg-surface-container-high text-on-surface-muted'}
                {isCurrent ? 'ring-4 ring-surface-container-high' : ''}"
            >
                {#if isDone}
                    <AppIcon name="check" size={15} weight="bold" />
                {:else}
                    <span class="text-[11px] font-bold">{i + 1}</span>
                {/if}
            </span>
            <div class="flex-1 -mt-0.5">
                <p class="text-sm font-bold {isCurrent ? STATUS_TOKEN_TEXT[token] : 'text-on-surface'}">
                    {stage.title}
                </p>
                {#if stage.date}
                    <p class="mt-0.5 text-[11px] text-on-surface-muted">{formatArabicDateTime(stage.date)}</p>
                {:else}
                    <p class="mt-0.5 text-[11px] text-on-surface-muted">بانتظار الوصول لهذه المرحلة</p>
                {/if}
            </div>
        </li>
    {/each}
</ol>

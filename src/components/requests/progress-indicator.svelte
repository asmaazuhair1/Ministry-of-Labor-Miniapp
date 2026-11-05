<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { STATUS_DEFINITIONS, STATUS_TOKEN_DOT, STATUS_TOKEN_TEXT } from "@/config/status.config";
    import type { RequestStage, RequestStatus } from "@/types/requests";

    interface Props {
        stages: RequestStage[];
        status: RequestStatus;
    }

    const { stages, status }: Props = $props();

    const token = $derived(STATUS_DEFINITIONS[status].token);
    const doneCount = $derived(stages.filter((s) => s.state === "done").length);
    const currentStage = $derived(stages.find((s) => s.state === "current") ?? stages[stages.length - 1]);
    const currentIndex = $derived(stages.findIndex((s) => s === currentStage));
</script>

<div>
    <div class="flex items-center" role="list" aria-label="مراحل الطلب">
        {#each stages as stage, i (stage.key)}
            {@const isDone = stage.state === "done"}
            {@const isCurrent = stage.state === "current"}
            <div class="flex items-center {i < stages.length - 1 ? 'flex-1' : ''}" role="listitem">
                <span
                    class="grid place-items-center w-6 h-6 rounded-full shrink-0 transition
                    {isDone ? STATUS_TOKEN_DOT[token] + ' text-on-primary' : ''}
                    {isCurrent ? STATUS_TOKEN_DOT[token] + ' text-on-primary ring-4 ring-surface-container-high' : ''}
                    {!isDone && !isCurrent ? 'bg-surface-container-high text-on-surface-muted' : ''}"
                >
                    {#if isDone}
                        <AppIcon name="check" size={13} weight="bold" />
                    {:else}
                        <span class="text-[10px] font-bold">{i + 1}</span>
                    {/if}
                </span>
                {#if i < stages.length - 1}
                    <span
                        class="h-1 flex-1 mx-1 rounded-full {i < currentIndex || isDone
                            ? STATUS_TOKEN_DOT[token]
                            : 'bg-surface-container-high'}"
                    ></span>
                {/if}
            </div>
        {/each}
    </div>
    <p class="mt-2 text-xs font-bold {STATUS_TOKEN_TEXT[token]}">
        المرحلة {currentIndex + 1} من {stages.length}: {currentStage.title}
    </p>
</div>

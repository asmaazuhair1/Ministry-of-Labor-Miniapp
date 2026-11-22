<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { STATUS_DEFINITIONS, STATUS_TOKEN_DOT, STATUS_TOKEN_TEXT } from "@/config/status.config";
    import { formatArabicDateTime } from "@/utils/format.util";
    import { duration, reducedMotion } from "@/utils/motion";
    import type { RequestStage, RequestStatus } from "@/types/requests";

    /*
     * Request progress that explains itself: stages fill one after another,
     * completed stages draw their check, the current stage pulses once.
     */
    interface Props {
        stages: RequestStage[];
        status: RequestStatus;
    }

    const { stages, status }: Props = $props();
    const token = $derived(STATUS_DEFINITIONS[status].token);

    // Sequential fill: each step waits for the previous connector.
    const STEP = $derived(reducedMotion() ? 0 : duration("base"));
    const delayFor = (i: number) => `${i * STEP}ms`;
</script>

<ol class="relative">
    {#each stages as stage, i (stage.key)}
        {@const isDone = stage.state === "done"}
        {@const isCurrent = stage.state === "current"}
        {@const isLast = i === stages.length - 1}
        <li class="relative flex gap-4 pb-7 last:pb-0">
            {#if !isLast}
                <span
                    class="absolute top-9 bottom-1 w-0.5 rounded-pill bg-outline-variant"
                    style="inset-inline-start: 17px;"
                >
                    {#if isDone}
                        <span
                            class="connector block w-full h-full rounded-pill {STATUS_TOKEN_DOT[token]}"
                            style="animation-delay: {delayFor(i)}"
                        ></span>
                    {/if}
                </span>
            {/if}

            <span class="relative z-10 grid place-items-center w-9 h-9 shrink-0">
                {#if isCurrent}
                    <span
                        class="pulse absolute inset-0 rounded-full {STATUS_TOKEN_DOT[token]}"
                        style="animation-delay: {delayFor(i)}"
                    ></span>
                {/if}
                <span
                    class="dot relative grid place-items-center w-9 h-9 rounded-full {isDone || isCurrent
                        ? STATUS_TOKEN_DOT[token] + ' text-on-primary'
                        : 'bg-surface-container-high text-on-surface-muted'}"
                    style="animation-delay: {delayFor(i)}"
                >
                    {#if isDone}
                        <svg viewBox="0 0 16 16" class="w-4 h-4" fill="none" aria-hidden="true">
                            <path
                                d="M3 8.5 l3 3 l7 -7"
                                stroke="currentColor"
                                stroke-width="2.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="check"
                                style="animation-delay: calc({delayFor(i)} + var(--duration-fast))"
                            />
                        </svg>
                    {:else if isCurrent}
                        <AppIcon name={STATUS_DEFINITIONS[status].icon} size={16} weight="fill" />
                    {:else}
                        <span class="text-label">{i + 1}</span>
                    {/if}
                </span>
            </span>

            <div class="flex-1 min-w-0 pt-1.5">
                <p
                    class="text-label {isCurrent
                        ? STATUS_TOKEN_TEXT[token]
                        : isDone
                          ? 'text-on-surface'
                          : 'text-on-surface-variant'}"
                >
                    {stage.title}
                    {#if isCurrent}<span class="sr-only">(المرحلة الحالية)</span>{/if}
                </p>
                <p class="mt-0.5 text-caption text-on-surface-muted">
                    {stage.date ? formatArabicDateTime(stage.date) : "بانتظار الوصول لهذه المرحلة"}
                </p>
            </div>
        </li>
    {/each}
</ol>

<style>
    .connector {
        transform-origin: top;
        animation: fill var(--duration-base) var(--ease-standard) both;
    }
    .dot {
        animation: dot-in var(--duration-fast) var(--ease-spring) both;
    }
    .check {
        stroke-dasharray: 16;
        stroke-dashoffset: 16;
        animation: draw var(--duration-base) var(--ease-decelerate) forwards;
    }
    .pulse {
        opacity: 0;
        animation: pulse var(--duration-hero) var(--ease-decelerate) 1 both;
    }
    @keyframes fill {
        from {
            transform: scaleY(0);
        }
    }
    @keyframes dot-in {
        from {
            transform: scale(0.6);
            opacity: 0;
        }
    }
    @keyframes draw {
        to {
            stroke-dashoffset: 0;
        }
    }
    @keyframes pulse {
        from {
            transform: scale(1);
            opacity: 0.45;
        }
        to {
            transform: scale(1.7);
            opacity: 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .connector,
        .dot,
        .pulse {
            animation: none;
        }
        .check {
            animation: none;
            stroke-dashoffset: 0;
        }
    }
</style>

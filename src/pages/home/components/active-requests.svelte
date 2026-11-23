<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { STATUS_DEFINITIONS, STATUS_TOKEN_BG, STATUS_TOKEN_DOT, STATUS_TOKEN_TEXT } from "@/config/status.config";
    import { reducedMotion, rise, stagger } from "@/utils/motion";
    import { go } from "@/utils/navigation";
    import type { RequestSummary } from "@/types/requests";

    /*
     * "Journey" cards for the citizen's open requests — a swipeable row. Each card:
     * the service's arch icon, title and a status chip, then the request's road —
     * one stop per stage, joined by a line that fills in the status colour up to the
     * current stop, which pulses softly — and the current stage with "stage x of y"
     * and a percentage. A faint shanasheel lattice rests on the card's far corner.
     */
    interface Props {
        requests: RequestSummary[];
    }
    const { requests }: Props = $props();

    const progressOf = (r: RequestSummary) => {
        const done = r.stages.filter((s) => s.state === "done").length;
        const currentIndex = r.stages.findIndex((s) => s.state === "current");
        const at = currentIndex >= 0 ? currentIndex : Math.max(done - 1, 0);
        return {
            done,
            at,
            total: r.stages.length,
            percent: r.stages.length ? Math.round((done / r.stages.length) * 100) : 0,
            current: r.stages[at]?.title ?? "",
        };
    };
</script>

<div class="-mx-gutter px-gutter flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-px-gutter pb-1">
    {#each requests as request, i (request.id)}
        {@const def = STATUS_DEFINITIONS[request.status]}
        {@const p = progressOf(request)}
        <div
            class="snap-start shrink-0 {requests.length > 1 ? 'w-[86%]' : 'w-full'}"
            in:rise|global={{ delay: reducedMotion() ? 0 : stagger(i) }}
        >
            <button
                type="button"
                onclick={() => go(`/requests/${request.id}`)}
                aria-label="{request.serviceTitle}، {def.label}، {p.percent}٪"
                class="pressable relative flex h-full w-full flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container p-4 text-start shadow-e1 active:shadow-none"
            >
                <LatticePattern
                    tile={20}
                    class="corner-lattice pointer-events-none absolute -top-2 -end-2 w-28 h-28 text-primary opacity-[0.09]"
                />

                <!-- Service + status -->
                <span class="relative flex items-center gap-3" aria-hidden="true">
                    <IconFrame icon={request.serviceIcon} size="sm" transitionName="request-icon-{request.id}" />
                    <span class="min-w-0 flex-1">
                        <span class="block text-headline text-on-surface line-clamp-1">{request.serviceTitle}</span>
                        <span
                            class="mt-1 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-caption font-bold {STATUS_TOKEN_BG[
                                def.token
                            ]} {STATUS_TOKEN_TEXT[def.token]}"
                        >
                            <AppIcon name={def.icon} size={12} weight="bold" />
                            {def.label}
                        </span>
                    </span>
                    <AppIcon name="caret-left" size={16} class="shrink-0 text-on-surface-muted" />
                </span>

                <!-- The road: one stop per stage -->
                <span class="relative mt-5 block h-4" aria-hidden="true">
                    <span
                        class="absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 rounded-pill bg-surface-container-high"
                    ></span>
                    <span
                        class="road absolute start-2 top-1/2 h-0.5 -translate-y-1/2 rounded-pill {STATUS_TOKEN_DOT[
                            def.token
                        ]}"
                        style="width: calc((100% - 1rem) * {p.total > 1
                            ? p.at / (p.total - 1)
                            : 0}); animation-delay: {reducedMotion() ? 0 : 200 + i * 80}ms"
                    ></span>
                    <span class="absolute inset-0 flex items-center justify-between">
                        {#each request.stages as stage, s (stage.key)}
                            {#if stage.state === "done"}
                                <span
                                    class="grid w-4 h-4 place-items-center rounded-full text-on-primary {STATUS_TOKEN_DOT[
                                        def.token
                                    ]}"
                                >
                                    <AppIcon name="check" size={10} weight="bold" />
                                </span>
                            {:else if s === p.at}
                                <span class="relative grid w-4 h-4 place-items-center">
                                    <span class="pulse absolute inset-0 rounded-full {STATUS_TOKEN_DOT[def.token]}"
                                    ></span>
                                    <span
                                        class="relative w-4 h-4 rounded-full border-[3px] border-surface-container {STATUS_TOKEN_DOT[
                                            def.token
                                        ]}"
                                    ></span>
                                </span>
                            {:else}
                                <span class="w-3 h-3 rounded-full border-2 border-outline-variant bg-surface-container"
                                ></span>
                            {/if}
                        {/each}
                    </span>
                </span>

                <!-- Current stage -->
                <span class="relative mt-4 flex items-end justify-between gap-3" aria-hidden="true">
                    <span class="min-w-0">
                        <span class="block text-caption text-on-surface-muted">المرحلة {p.at + 1} من {p.total}</span>
                        <span class="block truncate text-label text-on-surface">{p.current}</span>
                    </span>
                    <span class="shrink-0 text-title-2 tabular-nums {STATUS_TOKEN_TEXT[def.token]}"
                        >{p.percent}<span class="text-caption">٪</span></span
                    >
                </span>
            </button>
        </div>
    {/each}
</div>

<style>
    /* Lattice fades out from the corner instead of ending in a hard square. */
    :global(.corner-lattice) {
        mask-image: radial-gradient(circle at 0 0, black, transparent 70%);
    }
    .road {
        transform-origin: right;
        animation: fill var(--duration-hero) var(--ease-decelerate) both;
    }
    .pulse {
        animation: pulse 1.8s var(--ease-standard) infinite;
    }
    @keyframes fill {
        from {
            transform: translateY(-50%) scaleX(0);
        }
        to {
            transform: translateY(-50%) scaleX(1);
        }
    }
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.45;
        }
        100% {
            transform: scale(2.2);
            opacity: 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .road,
        .pulse {
            animation: none;
        }
    }
</style>

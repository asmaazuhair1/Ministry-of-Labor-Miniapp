<script lang="ts">
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import AppIcon from "@/components/app-icon.svelte";
    import { appConfig } from "@/config/app.config";
    import { setLanguage, type AppLanguage } from "@/store/language-state";
    import { reducedMotion } from "@/utils/motion";
    import { haptic } from "@/utils/superqi.util";

    /*
     * First-launch language picker, in the ministry's own look: a light page with a
     * faint shanasheel lattice, the emblem in a white seal inside a slowly turning
     * ring of gold ticks, a gold "welcome", the platform name, a short divider, then
     * two language cards (letter tile, name, Latin subtitle, arrow). Everything
     * enters in sequence once the splash has gone (`delay`), and the page lifts
     * away after a choice. Transform/opacity only; static under reduced motion.
     */
    interface Props {
        /** Wait before the entrance plays (ms) — e.g. while the splash is still up. */
        delay?: number;
        onDone: () => void;
    }
    const { delay = 0, onDone }: Props = $props();

    const OPTIONS: { id: AppLanguage; letter: string; name: string; latin: string }[] = [
        { id: "ar", letter: "ع", name: "العربية", latin: "ARABIC" },
        { id: "ku", letter: "ک", name: "کوردی", latin: "KURDISH · SORANI" },
    ];
    const TICKS = 36;

    let picked = $state<AppLanguage | null>(null);

    function choose(lang: AppLanguage) {
        if (picked) return;
        haptic("light");
        picked = lang;
        setLanguage(lang);
        setTimeout(onDone, reducedMotion() ? 0 : 420);
    }
</script>

<div
    class="picker fixed inset-0 z-[55] flex justify-center overflow-y-auto bg-surface {picked ? 'is-leaving' : ''}"
    style="--start: {delay}ms"
    role="dialog"
    aria-modal="true"
    aria-labelledby="language-title"
>
    <LatticePattern tile={36} class="pointer-events-none fixed inset-0 w-full h-full text-primary opacity-[0.05]" />

    <div
        class="relative flex w-full max-w-[480px] flex-col items-center px-gutter pt-[max(48px,env(safe-area-inset-top))] pb-[max(32px,env(safe-area-inset-bottom))]"
    >
        <!-- Seal: emblem in a white disc inside a turning ring of gold ticks -->
        <div class="seal relative grid w-[220px] h-[220px] place-items-center" aria-hidden="true">
            <svg viewBox="0 0 220 220" class="ticks absolute inset-0 w-full h-full text-secondary">
                {#each Array(TICKS) as _, i (i)}
                    <line
                        x1="110"
                        y1={i % 3 === 0 ? 6 : 12}
                        x2="110"
                        y2="24"
                        stroke="currentColor"
                        stroke-width={i % 3 === 0 ? 2 : 1.2}
                        stroke-linecap="round"
                        opacity={i % 3 === 0 ? 0.9 : 0.45}
                        transform="rotate({(360 / TICKS) * i} 110 110)"
                    />
                {/each}
            </svg>
            <svg viewBox="0 0 220 220" class="arc absolute inset-0 w-full h-full text-primary">
                <circle
                    cx="110"
                    cy="110"
                    r="100"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    pathLength="1"
                    stroke-dasharray="0.22 1"
                />
                <circle cx="10" cy="110" r="5" class="fill-secondary" />
            </svg>
            <span
                class="disc relative grid w-[148px] h-[148px] place-items-center rounded-full bg-surface-container shadow-e2 ring-1 ring-outline-variant"
            >
                <span class="absolute inset-2 rounded-full border border-dashed border-primary/25"></span>
                <img src="/logo.png" alt="" class="logo w-[112px] h-[112px] object-contain" />
            </span>
        </div>

        <!-- Welcome -->
        <p class="step mt-7 text-label text-secondary" style="--d: 0">مرحباً بك</p>
        <h1 id="language-title" class="step mt-1.5 text-center text-title-2 text-on-surface" style="--d: 1">
            في منصة {appConfig.metadata.ministryName}
        </h1>
        <span class="step mt-4 flex items-center gap-2" style="--d: 2" aria-hidden="true">
            <span class="h-px w-10 bg-outline-variant"></span>
            <span class="h-1.5 w-1.5 rotate-45 bg-secondary"></span>
            <span class="h-px w-10 bg-outline-variant"></span>
        </span>
        <p class="step mt-3 text-body text-on-surface-variant" style="--d: 3">اختر لغتك للاستمرار</p>

        <!-- Language cards -->
        <ul class="mt-7 flex w-full flex-col gap-3">
            {#each OPTIONS as option, i (option.id)}
                {@const chosen = picked === option.id}
                <li class="step" style="--d: {4 + i}">
                    <button
                        type="button"
                        onclick={() => choose(option.id)}
                        lang={option.id === "ar" ? "ar" : "ckb"}
                        class="pressable group relative flex w-full items-center gap-3 overflow-hidden rounded-card border bg-surface-container p-4 text-start shadow-e1 active:shadow-none {chosen
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-outline-variant'}"
                    >
                        <!-- Faint arch watermark -->
                        <span
                            class="pointer-events-none absolute -end-6 -bottom-12 w-20 h-24 shape-arch bg-primary-container/35"
                            aria-hidden="true"
                        ></span>
                        <span
                            class="relative grid w-14 h-14 shrink-0 place-items-center rounded-frame text-title-1 transition-colors duration-[var(--duration-base)] {chosen
                                ? 'bg-primary text-on-primary'
                                : 'bg-primary-container text-primary'}"
                            aria-hidden="true">{option.letter}</span
                        >
                        <span class="relative min-w-0 flex-1">
                            <span class="block text-title-2 text-on-surface">{option.name}</span>
                            <span
                                class="mt-0.5 block truncate text-caption font-bold tracking-[0.08em] text-on-surface-muted"
                                dir="ltr"
                                style="text-align: end">{option.latin}</span
                            >
                        </span>
                        <span
                            class="relative grid w-9 h-9 shrink-0 place-items-center rounded-full transition-colors duration-[var(--duration-base)] {chosen
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-on-surface-variant group-active:bg-primary-container'}"
                            aria-hidden="true"
                        >
                            <AppIcon name={chosen ? "check-circle" : "caret-left"} size={16} weight="bold" />
                        </span>
                    </button>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    /* Entrance — every delay is offset by --start (the splash's remaining time). */
    .picker {
        animation: fade var(--duration-base) var(--ease-standard) var(--start) both;
        transition:
            opacity var(--duration-slow) var(--ease-accelerate),
            transform var(--duration-slow) var(--ease-accelerate);
    }
    .picker.is-leaving {
        opacity: 0;
        transform: translateY(-16px);
        pointer-events: none;
    }
    .disc {
        animation: pop var(--duration-slow) var(--ease-spring) calc(var(--start) + 80ms) both;
    }
    .logo {
        animation: pop var(--duration-slow) var(--ease-spring) calc(var(--start) + 220ms) both;
    }
    .ticks {
        transform-origin: center;
        animation:
            fade var(--duration-hero) var(--ease-standard) calc(var(--start) + 120ms) both,
            spin 60s linear infinite;
    }
    .arc {
        transform-origin: center;
        animation:
            fade var(--duration-slow) var(--ease-standard) calc(var(--start) + 300ms) both,
            spin-back 14s linear infinite;
    }
    .step {
        animation: rise var(--duration-slow) var(--ease-decelerate) both;
        animation-delay: calc(var(--start) + 380ms + var(--d) * 70ms);
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
    }
    @keyframes pop {
        from {
            opacity: 0;
            transform: scale(0.7);
        }
    }
    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(14px);
        }
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes spin-back {
        to {
            transform: rotate(-360deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .picker,
        .disc,
        .logo,
        .ticks,
        .arc,
        .step {
            animation: none;
        }
        .picker {
            transition: none;
        }
    }
</style>

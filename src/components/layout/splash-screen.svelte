<script lang="ts">
    import { onMount } from "svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { appConfig } from "@/config/app.config";
    import { reducedMotion } from "@/utils/motion";

    /*
     * "Arch Unveil" splash. A choreographed opening (~2s) built from short
     * steps, each ≤600ms, transform/opacity/stroke only:
     *   lattice fades in → arch outline draws → arch fills with light →
     *   logo pops in → name rises word by word → loader line fills → the arch
     *   zooms forward as the splash fades, like stepping through the door.
     * Tap anywhere to skip. Reduced motion: static frame, short hold, fade.
     */
    interface Props {
        onDone: () => void;
    }
    const { onDone }: Props = $props();

    const HOLD_MS = 1900; // when the exit starts
    const EXIT_MS = 420; // --duration-slow
    const REDUCED_HOLD_MS = 700;

    const words = appConfig.metadata.ministryName.split(" ");
    let leaving = $state(false);
    let done = false;

    function finish() {
        if (done) return;
        done = true;
        leaving = true;
        setTimeout(onDone, reducedMotion() ? 120 : EXIT_MS);
    }

    onMount(() => {
        const timer = setTimeout(finish, reducedMotion() ? REDUCED_HOLD_MS : HOLD_MS);
        return () => clearTimeout(timer);
    });
</script>

<div
    class="splash fixed inset-0 z-[60] flex justify-center bg-primary {leaving ? 'is-leaving' : ''}"
    role="presentation"
    onclick={finish}
>
    <div class="relative flex w-full max-w-[480px] flex-col items-center justify-center overflow-hidden px-gutter">
        <!-- 1 · Lattice texture -->
        <span class="lattice absolute inset-0" aria-hidden="true">
            <LatticePattern tile={40} class="absolute inset-0 w-full h-full text-on-primary/10" />
        </span>

        <!-- Arch stage -->
        <div class="stage relative w-[168px] h-[210px]">
            <!-- 3 · Light filling the arch from the bottom -->
            <span class="arch-fill absolute inset-[10px] shape-arch bg-surface-container"></span>

            <!-- 2 · Arch outline drawing itself -->
            <svg viewBox="0 0 168 210" class="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
                <path
                    d="M4 206 V84 A80 80 0 0 1 164 84 V206 Z"
                    pathLength="1"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                    class="arch-line text-on-primary/70"
                />
            </svg>

            <!-- 4 · Ministry emblem -->
            <span class="absolute inset-0 grid place-items-center pt-6">
                <img
                    src="/logo.png"
                    alt="شعار وزارة العمل والشؤون الاجتماعية"
                    class="logo w-[104px] h-[104px] object-contain"
                />
            </span>
        </div>

        <!-- 5 · Name, word by word -->
        <h1 class="mt-8 flex flex-wrap justify-center gap-x-1.5 text-center text-title-2 text-on-primary">
            {#each words as word, i (i)}
                <span class="word inline-block" style="--i: {i}">{word}</span>
            {/each}
        </h1>
        <p class="subtitle mt-2 text-caption text-on-primary/75">{appConfig.metadata.country}</p>

        <!-- 6 · Loader line -->
        <span class="absolute inset-x-0 bottom-0 flex justify-center pb-[max(28px,env(safe-area-inset-bottom))]">
            <span class="block w-28 h-0.5 overflow-hidden rounded-pill bg-on-primary/20">
                <span class="loader block h-full bg-on-primary origin-right"></span>
            </span>
        </span>
    </div>
</div>

<style>
    /* Choreography (delays are positions on the timeline; durations are tokens). */
    .lattice {
        animation: fade-in var(--duration-hero) var(--ease-standard) both;
    }
    .arch-line {
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        animation: draw var(--duration-hero) var(--ease-decelerate) 100ms forwards;
    }
    .arch-fill {
        transform-origin: bottom;
        animation: rise-fill var(--duration-slow) var(--ease-decelerate) 560ms both;
    }
    .logo {
        animation: pop-in var(--duration-slow) var(--ease-spring) 820ms both;
    }
    .word {
        animation: word-rise var(--duration-base) var(--ease-decelerate) both;
        animation-delay: calc(1000ms + var(--i) * 60ms);
    }
    .subtitle {
        animation: fade-in var(--duration-base) var(--ease-standard) 1300ms both;
    }
    .loader {
        animation: grow 1800ms linear both;
    }

    /* Exit: arch zooms forward, everything fades. */
    .splash {
        transition: opacity var(--duration-slow) var(--ease-accelerate);
    }
    .splash.is-leaving {
        opacity: 0;
        pointer-events: none;
    }
    .stage {
        transition: transform var(--duration-slow) var(--ease-accelerate);
    }
    .splash.is-leaving .stage {
        transform: scale(1.35);
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }
    @keyframes draw {
        to {
            stroke-dashoffset: 0;
        }
    }
    @keyframes rise-fill {
        from {
            transform: scaleY(0);
            opacity: 0.6;
        }
    }
    @keyframes pop-in {
        from {
            transform: scale(0.6);
            opacity: 0;
        }
    }
    @keyframes word-rise {
        from {
            transform: translateY(12px);
            opacity: 0;
        }
    }
    @keyframes grow {
        from {
            transform: scaleX(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .lattice,
        .arch-fill,
        .logo,
        .word,
        .subtitle,
        .loader {
            animation: none;
        }
        .arch-line {
            animation: none;
            stroke-dashoffset: 0;
        }
        .splash.is-leaving .stage {
            transform: none;
        }
    }
</style>

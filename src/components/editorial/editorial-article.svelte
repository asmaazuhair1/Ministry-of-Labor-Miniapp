<script lang="ts">
    import type { Snippet } from "svelte";
    import AppIcon from "@/components/app-icon.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { formatArabicDate, formatArabicDay, formatArabicMonth, readingLabel } from "@/utils/format.util";
    import { pop, reducedMotion, rise, stagger } from "@/utils/motion";

    /*
     * Editorial "magazine page" shared by news and announcement details:
     * full-bleed photo with gentle parallax, a content sheet that lifts over it,
     * and a gold arch date-stamp standing on the sheet's edge (the moment).
     * Scroll-linked effects are transform-only and rAF-throttled; parallax is off
     * under reduced motion.
     */
    interface Props {
        id: string;
        /** View-transition namespace, e.g. "news" → news-photo-{id}, news-title-{id}. */
        kind: string;
        title: string;
        date: string;
        lead?: string;
        body?: string;
        image?: string;
        icon: string;
        /** Optional kicker shown above the title (e.g. category). */
        kicker?: string;
        children?: Snippet;
    }

    const { id, kind, title, date, lead, body, image, icon, kicker, children }: Props = $props();

    const paragraphs = $derived((body ?? "").split(/\n+/).filter(Boolean));

    // Scroll: parallax offset + reading progress.
    let parallax = $state(0);
    let progress = $state(0);
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            parallax = reducedMotion() ? 0 : Math.min(y, 320) * 0.35;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress = max > 0 ? Math.min(1, y / max) : 0;
            ticking = false;
        });
    }
</script>

<svelte:window onscroll={onScroll} />

<!-- Reading progress under the sticky header -->
<div class="fixed top-16 inset-x-0 z-20 flex justify-center pointer-events-none" aria-hidden="true">
    <span class="block w-full max-w-[480px] h-0.5">
        <span class="block h-full bg-primary origin-right" style="transform: scaleX({progress})"></span>
    </span>
</div>

<article>
    <!-- Hero -->
    <div class="relative h-72 overflow-hidden bg-primary-container">
        {#if image}
            <img
                src={image}
                alt=""
                draggable="false"
                class="absolute inset-0 w-full h-full object-cover will-change-transform"
                style="transform: translateY({parallax}px) scale(1.12); view-transition-name: {kind}-photo-{id}"
            />
        {:else}
            <LatticePattern tile={36} class="absolute inset-0 w-full h-full text-primary/10" />
            <span class="absolute inset-0 grid place-items-center pb-10">
                <IconFrame {icon} size="xl" class="bg-surface-container" />
            </span>
        {/if}
    </div>

    <!-- Sheet lifting over the photo -->
    <div class="relative -mt-10 rounded-t-hero bg-surface px-gutter pt-7 pb-10">
        <!-- Gold arch date stamp -->
        <span
            class="absolute -top-14 end-gutter grid w-[68px] h-[88px] place-content-center shape-arch bg-secondary text-center text-on-secondary ring-[6px] ring-surface shadow-e2"
            style="view-transition-name: {kind}-date-{id}"
            in:pop={{ delay: reducedMotion() ? 0 : 220 }}
        >
            <span class="absolute inset-1.5 shape-arch border border-on-secondary/30" aria-hidden="true"></span>
            <span class="relative mt-2 text-title-1 tabular-nums leading-none">{formatArabicDay(date)}</span>
            <span class="relative mt-1 px-1 text-caption leading-4 text-on-secondary/90">{formatArabicMonth(date)}</span
            >
        </span>

        {#if kicker}
            <p class="pe-20 text-label text-primary" in:rise>{kicker}</p>
        {/if}
        <h1 class="mt-1 pe-20 text-title-1 text-on-surface" style="view-transition-name: {kind}-title-{id}">{title}</h1>
        <div
            class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-on-surface-muted"
            in:rise={{ delay: stagger(1) }}
        >
            <span class="inline-flex items-center gap-1"
                ><AppIcon name="calendar" size={14} /> {formatArabicDate(date)}</span
            >
            {#if body}
                <span class="inline-flex items-center gap-1"
                    ><AppIcon name="clock" size={14} /> {readingLabel(body)}</span
                >
            {/if}
        </div>

        {#if lead}
            <p
                class="mt-6 ps-4 border-s-4 border-primary text-headline font-normal text-on-surface"
                in:rise={{ delay: stagger(2) }}
            >
                {lead}
            </p>
        {/if}

        {#if paragraphs.length}
            <div
                class="mt-5 flex flex-col gap-4 text-body leading-7 text-on-surface-variant"
                in:rise={{ delay: stagger(3) }}
            >
                {#each paragraphs as paragraph, i (i)}
                    <p>{paragraph}</p>
                {/each}
            </div>
        {/if}

        {#if children}
            <div class="mt-8 flex flex-col gap-section" in:rise={{ delay: stagger(4) }}>
                {@render children()}
            </div>
        {/if}
    </div>
</article>

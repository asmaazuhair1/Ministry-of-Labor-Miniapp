<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import AppIcon from "@/components/app-icon.svelte";
    import { duration, easing, reducedMotion } from "@/utils/motion";
    import { formatArabicDate } from "@/utils/format.util";
    import { go as navigateTo } from "@/utils/navigation";
    import type { Announcement } from "@/types/content";

    /*
     * Announcements slider with cover photos. Story-style progress bars live
     * inside the slide (over the photo) next to a numbered counter. Auto-advances
     * over the dwell time, pauses while touched or hidden, swipes both ways, and
     * never autoplays under reduced motion.
     */
    interface Props {
        announcements: Announcement[];
    }
    const { announcements }: Props = $props();

    const SWIPE_PX = 40;

    let index = $state(0);
    let direction = $state<1 | -1>(1);
    let held = $state(false);
    let hidden = $state(false);
    const autoplay = $derived(!reducedMotion() && announcements.length > 1);
    const paused = $derived(held || hidden);
    const current = $derived(announcements[index]);

    function go(next: number, dir: 1 | -1) {
        const count = announcements.length;
        direction = dir;
        index = (next + count) % count;
    }
    const next = () => go(index + 1, 1);
    const prev = () => go(index - 1, -1);

    const TAP_PX = 8;
    let startX: number | null = null;
    let swiped = false;
    function onPointerDown(e: PointerEvent) {
        startX = e.clientX;
        swiped = false;
        held = true;
    }
    function onPointerUp(e: PointerEvent) {
        held = false;
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        // RTL: the next slide sits to the left, so dragging right reveals it.
        if (dx > SWIPE_PX) {
            swiped = true;
            next();
        } else if (dx < -SWIPE_PX) {
            swiped = true;
            prev();
        } else if (Math.abs(dx) < TAP_PX && !(e.target as Element).closest("button")) {
            // A plain tap on the photo opens the announcement.
            openCurrent();
        }
    }
    function openCurrent() {
        if (swiped || !current) return;
        navigateTo(`/announcements/${current.id}`);
    }

    // Photo glides in from the side the new slide lives on; text rises after it.
    function photoIn(node: Element) {
        if (reducedMotion()) return fade(node, { duration: 120 });
        return fly(node, { x: -40 * direction, opacity: 0, duration: duration("slow"), easing: easing("decelerate") });
    }
    function textIn(node: Element) {
        if (reducedMotion()) return fade(node, { duration: 120 });
        return fly(node, { y: 10, opacity: 0, duration: duration("base"), easing: easing("decelerate"), delay: 80 });
    }
    function out(node: Element) {
        if (reducedMotion()) return fade(node, { duration: 0 });
        return fade(node, { duration: duration("fast"), easing: easing("accelerate") });
    }
</script>

<svelte:document onvisibilitychange={() => (hidden = document.visibilityState === "hidden")} />

{#if current}
    <section
        class="relative overflow-hidden rounded-hero bg-surface-container shadow-e1 touch-pan-y select-none"
        aria-roledescription="carousel"
        aria-label="الإعلانات"
        onpointerdown={onPointerDown}
        onpointerup={onPointerUp}
        onpointercancel={() => {
            held = false;
            startX = null;
        }}
        onpointerleave={() => (held = false)}
    >
        <!-- Photo -->
        <div class="relative grid h-44 overflow-hidden bg-surface-container-high">
            {#key current.id}
                <div class="[grid-area:1/1] relative" in:photoIn out:out>
                    {#if current.image}
                        <img
                            src={current.image}
                            alt=""
                            draggable="false"
                            class="absolute inset-0 w-full h-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    {:else}
                        <span class="absolute inset-0 grid place-items-center text-primary">
                            <AppIcon name="megaphone" size={40} weight="duotone" />
                        </span>
                    {/if}
                </div>
            {/key}

            <!-- In-slide progress: story bars + numbered counter -->
            <div
                class="absolute inset-x-3 top-3 flex items-center gap-2.5 rounded-pill bg-on-surface/70 ps-3 pe-1 py-1"
            >
                <div class="flex flex-1 gap-1">
                    {#each announcements as item, i (item.id)}
                        <button
                            type="button"
                            class="flex-1 h-6 -my-2 flex items-center"
                            aria-label="الإعلان {i + 1}"
                            aria-current={i === index}
                            onclick={() => go(i, i > index ? 1 : -1)}
                        >
                            <span
                                class="relative block w-full h-1 overflow-hidden rounded-pill bg-surface-container/30"
                            >
                                {#if i < index || (i === index && !autoplay)}
                                    <span class="absolute inset-0 bg-surface-container"></span>
                                {:else if i === index}
                                    {#key index}
                                        <span
                                            class="absolute inset-0 bg-surface-container origin-right"
                                            style="animation: story-fill var(--duration-story) linear both; animation-play-state: {paused
                                                ? 'paused'
                                                : 'running'}"
                                            onanimationend={next}
                                        ></span>
                                    {/key}
                                {/if}
                            </span>
                        </button>
                    {/each}
                </div>
                <span
                    class="shrink-0 rounded-pill bg-surface-container/15 px-2.5 py-0.5 text-caption font-bold text-surface-container tabular-nums"
                    dir="ltr"
                    aria-live="polite"
                    aria-label="الإعلان {index + 1} من {announcements.length}"
                    >{index + 1} / {announcements.length}</span
                >
            </div>

            <!-- Date badge (changes with the slide) -->
            <span
                class="absolute bottom-3 start-4 grid rounded-pill bg-secondary-container px-3 py-1 text-caption font-bold text-secondary shadow-e1"
            >
                {#key current.id}
                    <span class="[grid-area:1/1]" in:textIn out:out>{formatArabicDate(current.date)}</span>
                {/key}
            </span>
        </div>

        <!-- Text -->
        <div class="grid">
            {#key current.id}
                <button
                    type="button"
                    onclick={openCurrent}
                    class="[grid-area:1/1] block w-full px-5 pt-4 pb-5 min-h-[112px] text-start"
                    in:textIn
                    out:out
                >
                    <h3 class="text-title-2 text-on-surface line-clamp-2">{current.title}</h3>
                    <p class="mt-1.5 text-body text-on-surface-variant line-clamp-2">{current.description}</p>
                </button>
            {/key}
        </div>
    </section>
{/if}

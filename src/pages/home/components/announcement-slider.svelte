<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { ACCENT_BG } from "@/utils/accent.util";
    import { formatArabicDate } from "@/utils/format.util";
    import type { Announcement } from "@/types/content";

    interface Props {
        announcements: Announcement[];
    }
    const { announcements }: Props = $props();

    let active = $state(0);
    let track = $state<HTMLElement | null>(null);

    function onScroll() {
        if (!track) return;
        const width = track.clientWidth;
        if (width === 0) return;
        active = Math.round(Math.abs(track.scrollLeft) / width);
    }

    function goTo(index: number) {
        if (!track) return;
        const width = track.clientWidth;
        const dir = getComputedStyle(track).direction === "rtl" ? -1 : 1;
        track.scrollTo({ left: dir * index * width, behavior: "smooth" });
    }
</script>

<div>
    <div bind:this={track} onscroll={onScroll} class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3">
        {#each announcements as item (item.id)}
            <article
                class="snap-center shrink-0 w-full rounded-card {ACCENT_BG[
                    item.accent
                ]} text-on-primary p-5 shadow-soft"
            >
                <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold"
                >
                    <AppIcon name="megaphone" size={13} weight="fill" />
                    إعلان
                </span>
                <h3 class="mt-3 text-base font-extrabold leading-snug">{item.title}</h3>
                <p class="mt-1.5 text-[13px] leading-relaxed text-on-primary/90 line-clamp-2">{item.description}</p>
                <p class="mt-3 text-[11px] text-on-primary/80">{formatArabicDate(item.date)}</p>
            </article>
        {/each}
    </div>

    {#if announcements.length > 1}
        <div class="mt-3 flex items-center justify-center gap-1.5">
            {#each announcements as item, i (item.id)}
                <button
                    type="button"
                    aria-label={`الانتقال إلى الإعلان ${i + 1}`}
                    onclick={() => goTo(i)}
                    class="h-1.5 rounded-full transition-all {i === active ? 'w-5 bg-primary' : 'w-1.5 bg-outline'}"
                ></button>
            {/each}
        </div>
    {/if}
</div>

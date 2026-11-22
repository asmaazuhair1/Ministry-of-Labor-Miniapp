<script lang="ts">
    import { go } from "@/utils/navigation";
    import Card from "@/components/ui/card.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { formatArabicDate } from "@/utils/format.util";
    import type { NewsItem } from "@/types/content";

    /** Editorial snap carousel: one card at 85% width, the next one peeks in. */
    interface Props {
        news: NewsItem[];
    }
    const { news }: Props = $props();
</script>

<div class="-mx-gutter px-gutter flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-px-gutter pb-1">
    {#each news as item (item.id)}
        <div class="snap-start shrink-0 w-[85%]">
            <Card padding="none" class="h-full" onClick={() => go(`/news/${item.id}`)} ariaLabel={item.title}>
                <div class="relative h-32 bg-primary-container">
                    {#if item.image}
                        <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            draggable="false"
                            class="absolute inset-0 w-full h-full object-cover"
                            style="view-transition-name: news-photo-{item.id}"
                        />
                    {:else}
                        <LatticePattern tile={32} class="absolute inset-0 w-full h-full text-primary/10" />
                    {/if}
                    <IconFrame
                        icon={item.icon}
                        size="sm"
                        tone="primary"
                        class="absolute bottom-0 translate-y-1/2 start-4 bg-surface-container"
                    />
                </div>
                <div class="px-4 pt-8 pb-4">
                    <p class="text-headline text-on-surface line-clamp-2">{item.title}</p>
                    <p class="mt-2 text-caption text-on-surface-muted">{formatArabicDate(item.date)}</p>
                </div>
            </Card>
        </div>
    {/each}
</div>

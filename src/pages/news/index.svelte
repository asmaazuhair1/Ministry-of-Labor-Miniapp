<script lang="ts">
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import AppIcon from "@/components/app-icon.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { formatArabicDay, formatArabicMonth, readingLabel } from "@/utils/format.util";
    import { reducedMotion, rise, stagger } from "@/utils/motion";
    import { go } from "@/utils/navigation";
    import { getNews } from "./service";
    import type { NewsItem } from "@/types/content";

    /*
     * News as magazine cards that preview the article page: photo, a gold arch
     * date-stamp standing on the photo's edge, then title, summary and reading
     * time. Every story has equal weight (no featured hero). Photo, date and
     * title share view-transition names with the article, so they morph on open.
     */
    const newsQuery = createQuery<NewsItem[]>({ key: "news-list", fetcher: getNews });

    const news = $derived(
        (newsQuery.data ?? []).slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    );
</script>

<div class="px-gutter pt-5 pb-8">
    {#if newsQuery.isLoading}
        <div class="flex flex-col gap-5">
            {#each Array(3) as _, i (i)}
                <Skeleton class="h-[330px] rounded-hero" />
            {/each}
        </div>
    {:else if !news.length}
        <EmptyState
            icon="newspaper"
            title="لا توجد أخبار حالياً"
            description="تابعنا للاطّلاع على آخر أخبار الوزارة وفعالياتها."
        />
    {:else}
        <ul class="flex flex-col gap-5">
            {#each news as item, i (item.id)}
                <li in:rise|global={{ delay: reducedMotion() ? 0 : stagger(i) }}>
                    <button
                        type="button"
                        onclick={() => go(`/news/${item.id}`)}
                        class="pressable group w-full overflow-hidden rounded-hero bg-surface-container text-start shadow-e1 active:shadow-none"
                    >
                        <!-- Photo -->
                        <span class="relative block h-44 overflow-hidden bg-primary-container">
                            {#if item.image}
                                <img
                                    src={item.image}
                                    alt=""
                                    loading={i === 0 ? "eager" : "lazy"}
                                    draggable="false"
                                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] group-active:scale-[1.03]"
                                    style="view-transition-name: news-photo-{item.id}"
                                />
                            {:else}
                                <LatticePattern tile={32} class="absolute inset-0 w-full h-full text-primary/10" />
                                <span class="absolute inset-0 grid place-items-center">
                                    <IconFrame icon={item.icon} size="lg" class="bg-surface-container" />
                                </span>
                            {/if}
                        </span>

                        <!-- Body -->
                        <span class="relative block px-5 pt-5 pb-5">
                            <!-- Gold arch date stamp on the photo's edge -->
                            <span
                                class="absolute -top-12 end-5 grid w-14 h-[72px] place-content-center shape-arch bg-secondary text-center text-on-secondary ring-4 ring-surface-container shadow-e2"
                                style="view-transition-name: news-date-{item.id}"
                                aria-hidden="true"
                            >
                                <span class="absolute inset-1 shape-arch border border-on-secondary/30"></span>
                                <span class="relative mt-1.5 text-title-2 tabular-nums leading-none"
                                    >{formatArabicDay(item.date)}</span
                                >
                                <span class="relative mt-0.5 px-0.5 text-caption leading-4 text-on-secondary/90"
                                    >{formatArabicMonth(item.date)}</span
                                >
                            </span>

                            <span
                                class="block pe-16 text-headline text-on-surface"
                                style="view-transition-name: news-title-{item.id}"
                            >
                                {item.title}
                            </span>
                            <span class="mt-1.5 block text-body text-on-surface-variant line-clamp-2"
                                >{item.excerpt}</span
                            >

                            <span
                                class="mt-4 flex items-center justify-between gap-3 border-t border-outline-variant pt-3"
                            >
                                <span class="inline-flex items-center gap-1 text-caption text-on-surface-muted">
                                    <AppIcon name="clock" size={14} />
                                    {readingLabel(item.body)}
                                </span>
                                <span
                                    class="inline-flex items-center gap-1 rounded-pill bg-primary-container px-3 py-1.5 text-caption font-bold text-primary"
                                >
                                    اقرأ الخبر
                                    <AppIcon name="caret-left" size={14} weight="bold" />
                                </span>
                            </span>
                        </span>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

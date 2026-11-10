<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import NewsCard from "@/components/cards/news-card.svelte";
    import SectionHeader from "@/components/section-header.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { ACCENT_SOFT, ACCENT_TEXT } from "@/utils/accent.util";
    import { formatArabicDate } from "@/utils/format.util";
    import { getNews } from "./service";
    import type { NewsItem } from "@/types/content";

    const newsQuery = createQuery<NewsItem[]>({ key: "news-list", fetcher: getNews });

    // Latest news first; the newest becomes the featured hero card.
    const news = $derived(
        (newsQuery.data ?? []).slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    );
    const featured = $derived(news[0] ?? null);
    const rest = $derived(news.slice(1));

    function openNews(id: string) {
        push(`/news/${id}`);
    }
</script>

<div class="px-4 py-5 animate-fade-up">
    {#if newsQuery.isLoading}
        <Skeleton class="h-44 w-full rounded-card" />
        <div class="mt-5 flex flex-col gap-3">
            {#each Array(3) as _, i (i)}
                <Skeleton class="h-20 rounded-card" />
            {/each}
        </div>
    {:else if !news.length}
        <EmptyState title="لا توجد أخبار حالياً" description="تابعنا للاطّلاع على آخر أخبار الوزارة وفعالياتها." />
    {:else}
        {#if featured}
            <button
                type="button"
                onclick={() => openNews(featured.id)}
                class="w-full text-start rounded-card bg-surface-container border border-outline-variant p-5 shadow-card active:scale-[0.99] transition"
            >
                <div class="flex items-center gap-2.5">
                    <span class="grid place-items-center w-11 h-11 shrink-0 rounded-2xl {ACCENT_SOFT[featured.accent]}">
                        <AppIcon name={featured.icon} size={22} weight="fill" class={ACCENT_TEXT[featured.accent]} />
                    </span>
                    <span
                        class="rounded-full bg-primary-container px-2.5 py-1 text-[11px] font-bold text-on-primary-container"
                    >
                        آخر الأخبار
                    </span>
                </div>
                <h2 class="mt-3.5 text-lg font-extrabold leading-snug text-on-surface line-clamp-2">
                    {featured.title}
                </h2>
                <p class="mt-2 text-sm leading-relaxed text-on-surface-variant line-clamp-2">{featured.excerpt}</p>
                <div class="mt-4 flex items-center justify-between">
                    <span class="flex items-center gap-1.5 text-[11px] text-on-surface-muted">
                        <AppIcon name="calendar" size={13} />
                        {formatArabicDate(featured.date)}
                    </span>
                    <span class="flex items-center gap-1 text-[12px] font-bold text-primary">
                        اقرأ المزيد
                        <AppIcon name="caret-left" size={14} />
                    </span>
                </div>
            </button>
        {/if}

        {#if rest.length}
            <div class="mt-6">
                <SectionHeader title="كل الأخبار" />
                <div class="flex flex-col gap-3">
                    {#each rest as item (item.id)}
                        <NewsCard news={item} onClick={openNews} />
                    {/each}
                </div>
            </div>
        {/if}
    {/if}
</div>

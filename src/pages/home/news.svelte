<script lang="ts">
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import EditorialArticle from "@/components/editorial/editorial-article.svelte";
    import AppIcon from "@/components/app-icon.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { formatArabicDate, readingLabel } from "@/utils/format.util";
    import { go, goReplace } from "@/utils/navigation";
    import { getNews, getNewsById } from "./service";
    import type { NewsItem } from "@/types/content";

    interface Props {
        params?: { newsId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<NewsItem | null>({
        key: "news-details",
        fetcher: () => getNewsById(params?.newsId ?? ""),
    });
    const allQuery = createQuery<NewsItem[]>({ key: "news-related", fetcher: getNews });
    const news = $derived(query.data ?? null);
    const more = $derived((allQuery.data ?? []).filter((n) => n.id !== news?.id).slice(0, 3));
</script>

{#if query.isLoading}
    <Skeleton class="h-72 rounded-none" />
    <div class="px-gutter pt-6 flex flex-col gap-3">
        <Skeleton class="h-7 w-11/12" />
        <Skeleton class="h-7 w-2/3" />
        <Skeleton class="h-4 w-1/2" />
        <Skeleton class="mt-4 h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-4/5" />
    </div>
{:else if !news}
    <EmptyState
        icon="newspaper"
        title="الخبر غير موجود"
        description="ربما حُذف هذا الخبر أو تغيّر رابطه."
        actionLabel="كل الأخبار"
        onAction={() => goReplace("/news")}
    />
{:else}
    <EditorialArticle
        id={news.id}
        kind="news"
        title={news.title}
        date={news.date}
        lead={news.excerpt}
        body={news.body}
        image={news.image}
        icon={news.icon}
        kicker="أخبار الوزارة"
    >
        {#if more.length}
            <section>
                <h2 class="mb-3 text-title-2 text-on-surface">اقرأ أيضاً</h2>
                <ul class="flex flex-col gap-3">
                    {#each more as item (item.id)}
                        <li>
                            <button
                                type="button"
                                onclick={() => go(`/news/${item.id}`)}
                                class="pressable w-full flex items-center gap-3 rounded-card bg-surface-container p-2.5 text-start shadow-e1"
                            >
                                {#if item.image}
                                    <img
                                        src={item.image}
                                        alt=""
                                        loading="lazy"
                                        class="w-24 h-20 shrink-0 rounded-field object-cover"
                                    />
                                {/if}
                                <span class="flex-1 min-w-0">
                                    <span class="text-label text-on-surface line-clamp-2">{item.title}</span>
                                    <span class="mt-1 block text-caption text-on-surface-muted"
                                        >{formatArabicDate(item.date)} · {readingLabel(item.body)}</span
                                    >
                                </span>
                                <AppIcon name="caret-left" size={16} class="shrink-0 text-on-surface-muted" />
                            </button>
                        </li>
                    {/each}
                </ul>
            </section>
        {/if}
    </EditorialArticle>
{/if}

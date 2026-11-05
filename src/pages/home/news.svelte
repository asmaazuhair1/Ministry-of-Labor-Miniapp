<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import { ACCENT_SOFT, ACCENT_TEXT } from "@/utils/accent.util";
    import { formatArabicDate } from "@/utils/format.util";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getNewsById } from "./service";
    import type { NewsItem } from "@/types/content";

    interface Props {
        params?: { newsId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<NewsItem | null>({
        key: "news-details",
        fetcher: () => getNewsById(params?.newsId ?? ""),
    });
    const news = $derived(query.data ?? null);
</script>

{#if query.isLoading}
    <PageLoading />
{:else if !news}
    <EmptyState title="الخبر غير موجود" actionLabel="العودة للرئيسية" onAction={() => push("/")} />
{:else}
    <article class="px-4 py-5 animate-fade-up">
        <span class="grid place-items-center w-16 h-16 rounded-2xl {ACCENT_SOFT[news.accent]}">
            <AppIcon name={news.icon} size={34} weight="fill" class={ACCENT_TEXT[news.accent]} />
        </span>
        <h1 class="mt-4 text-xl font-extrabold text-on-surface leading-snug">{news.title}</h1>
        <p class="mt-1.5 flex items-center gap-1.5 text-[11px] text-on-surface-muted">
            <AppIcon name="calendar" size={13} />
            {formatArabicDate(news.date)}
        </p>
        <p class="mt-4 text-[15px] leading-loose text-on-surface-variant">{news.body}</p>
    </article>
{/if}

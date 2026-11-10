<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { ACCENT_SOFT, ACCENT_TEXT } from "@/utils/accent.util";
    import { formatArabicDate } from "@/utils/format.util";
    import type { NewsItem } from "@/types/content";

    interface Props {
        news: NewsItem;
        onClick: (id: string) => void;
    }
    const { news, onClick }: Props = $props();
</script>

<button
    type="button"
    onclick={() => onClick(news.id)}
    class="w-full flex items-center gap-3.5 rounded-card bg-surface-container border border-outline-variant p-3.5 text-start shadow-card active:scale-[0.99] transition"
>
    <span class="grid place-items-center w-14 h-14 shrink-0 rounded-2xl {ACCENT_SOFT[news.accent]}">
        <AppIcon name={news.icon} size={27} weight="fill" class={ACCENT_TEXT[news.accent]} />
    </span>
    <span class="flex-1 min-w-0">
        <span class="block text-sm font-extrabold text-on-surface leading-snug line-clamp-2">{news.title}</span>
        <span class="mt-1 block text-[11px] text-on-surface-muted">{formatArabicDate(news.date)}</span>
    </span>
    <AppIcon name="caret-left" size={18} class="shrink-0 text-on-surface-muted" />
</button>

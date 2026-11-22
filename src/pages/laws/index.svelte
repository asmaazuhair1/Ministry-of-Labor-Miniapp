<script lang="ts">
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import SearchInput from "@/components/search-input.svelte";
    import LawsList from "@/components/cards/laws-list.svelte";
    import Tabs from "@/components/ui/tabs.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getLaws } from "@/pages/home/service";
    import { arabicCountNoun } from "@/utils/format.util";
    import { rise, stagger } from "@/utils/motion";
    import type { LawDocument } from "@/types/content";

    const lawsQuery = createQuery<LawDocument[]>({ key: "laws-list", fetcher: getLaws });
    const laws = $derived(lawsQuery.data ?? []);

    type Kind = "all" | LawDocument["kind"];
    let kind = $state<Kind>("all");
    let search = $state("");

    const tabs = $derived([
        { id: "all", label: "الكل", count: laws.length },
        { id: "law", label: "قوانين", count: laws.filter((l) => l.kind === "law").length },
        { id: "instruction", label: "تعليمات", count: laws.filter((l) => l.kind === "instruction").length },
    ]);

    const visible = $derived.by(() => {
        const q = search.trim();
        return laws.filter((l) => (kind === "all" || l.kind === kind) && (!q || l.title.includes(q)));
    });

    const FORMS: [string, string, string, string] = ["وثيقة رسمية", "وثائق رسمية", "وثائق رسمية", "وثيقة رسمية"];
</script>

<div class="px-gutter pt-5 pb-8">
    {#if lawsQuery.isLoading}
        <Skeleton class="h-10 w-40" />
        <Skeleton shape="pill" class="mt-5 h-[52px] w-full" />
        <Skeleton shape="pill" class="mt-4 h-[52px] w-64" />
        <div class="mt-5 flex flex-col gap-3">
            {#each Array(4) as _, i (i)}
                <Skeleton class="h-[108px] rounded-card" />
            {/each}
        </div>
    {:else if !laws.length}
        <EmptyState
            icon="scales"
            title="لا توجد قوانين حالياً"
            description="سيتم نشر القوانين والتعليمات هنا عند توفرها."
        />
    {:else}
        <section class="flex items-end gap-3" in:rise>
            <span class="text-display text-primary leading-none"><CountUp value={visible.length} /></span>
            <span class="pb-0.5">
                <span class="block text-headline text-on-surface">{arabicCountNoun(visible.length, FORMS)}</span>
                <span class="block text-caption text-on-surface-variant">بصيغة PDF قابلة للتحميل</span>
            </span>
        </section>

        <div class="mt-5" in:rise={{ delay: stagger(1) }}>
            <SearchInput value={search} placeholder="ابحث برقم القانون أو عنوانه..." onInput={(v) => (search = v)} />
        </div>
        <div class="mt-4" in:rise={{ delay: stagger(2) }}>
            <Tabs items={tabs} value={kind} onChange={(id) => (kind = id as Kind)} label="نوع الوثيقة" />
        </div>

        <section class="mt-5" aria-live="polite" in:rise={{ delay: stagger(3) }}>
            {#if visible.length === 0}
                <EmptyState
                    icon="magnifying-glass"
                    title="لا نتائج"
                    description="لم نجد وثيقة تطابق بحثك. جرّب رقم القانون فقط."
                    actionLabel={search ? "مسح البحث" : undefined}
                    onAction={search ? () => (search = "") : undefined}
                />
            {:else}
                {#key kind}
                    <div in:rise>
                        <LawsList laws={visible} />
                    </div>
                {/key}
            {/if}
        </section>
    {/if}
</div>

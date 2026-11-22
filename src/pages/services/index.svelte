<script lang="ts">
    import { flip } from "svelte/animate";
    import SearchInput from "@/components/search-input.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import ServiceRow from "@/components/cards/service-row.svelte";
    import Tabs from "@/components/ui/tabs.svelte";
    import PageBanner from "@/components/ui/page-banner.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { duration, easing, fadeIn, reducedMotion, rise, stagger } from "@/utils/motion";
    import { go } from "@/utils/navigation";
    import { arabicCountNoun } from "@/utils/format.util";
    import { getCategories, getServices } from "./service";
    import type { ServiceCategory, ServiceSummary } from "@/types/services";

    const categoriesQuery = createQuery<ServiceCategory[]>({ key: "categories", fetcher: getCategories });
    const servicesQuery = createQuery<ServiceSummary[]>({ key: "services", fetcher: getServices });

    let search = $state("");
    let activeCategory = $state("all");

    const categories = $derived(categoriesQuery.data ?? []);
    const services = $derived(servicesQuery.data ?? []);
    const isLoading = $derived(categoriesQuery.isLoading || servicesQuery.isLoading);

    const tabs = $derived([
        { id: "all", label: "الكل", count: services.length },
        ...categories.map((c) => ({
            id: c.id,
            label: c.title,
            count: services.filter((s) => s.categoryId === c.id).length,
        })),
    ]);

    const inCategory = $derived(
        activeCategory === "all" ? services : services.filter((s) => s.categoryId === activeCategory),
    );
    const visible = $derived.by(() => {
        const q = search.trim();
        return q ? inCategory.filter((s) => s.title.includes(q) || s.description.includes(q)) : inCategory;
    });
    const availableCount = $derived(inCategory.filter((s) => s.availability === "available").length);
    const pausedCount = $derived(inCategory.length - availableCount);
    const scopeLabel = $derived(
        activeCategory === "all"
            ? "في جميع التصنيفات"
            : `ضمن ${categories.find((c) => c.id === activeCategory)?.title ?? ""}`,
    );

    const SERVICE_FORMS: [string, string, string, string] = ["خدمة متاحة", "خدمات متاحة", "خدمات متاحة", "خدمة متاحة"];

    const categoryTitle = (id: string) => categories.find((c) => c.id === id)?.title;
    const flipOptions = () => ({ duration: reducedMotion() ? 0 : duration("base"), easing: easing("standard") });
</script>

<div class="px-gutter pt-5 pb-6">
    <PageBanner
        count={availableCount}
        loading={isLoading}
        title="{arabicCountNoun(availableCount, SERVICE_FORMS)} الآن"
        summary="{availableCount} متاحة · {pausedCount} متوقفة"
        label="{availableCount} من {inCategory.length} خدمات متاحة {scopeLabel}"
    />

    <div class="mt-5" in:rise={{ delay: stagger(1) }}>
        <SearchInput value={search} placeholder="ابحث عن خدمة..." onInput={(v) => (search = v)} />
    </div>

    <div class="mt-4" in:rise={{ delay: stagger(2) }}>
        {#if isLoading}
            <Skeleton shape="pill" class="h-[52px] w-full" />
        {:else}
            <Tabs items={tabs} value={activeCategory} onChange={(id) => (activeCategory = id)} />
        {/if}
    </div>

    <section class="mt-5" aria-live="polite">
        {#if isLoading}
            <div class="flex flex-col gap-3">
                {#each Array(3) as _, i (i)}
                    <div class="flex items-center gap-4 rounded-card bg-surface-container p-4 shadow-e1">
                        <Skeleton shape="arch" class="w-14 h-[72px]" />
                        <div class="flex-1 flex flex-col gap-2">
                            <Skeleton class="h-4 w-2/3" />
                            <Skeleton class="h-3 w-full" />
                            <Skeleton class="h-3 w-1/3" />
                        </div>
                    </div>
                {/each}
            </div>
        {:else if visible.length === 0}
            <EmptyState
                icon={search.trim() ? "magnifying-glass" : "squares-four"}
                title={search.trim() ? "لا نتائج لبحثك" : "لا توجد خدمات هنا بعد"}
                description={search.trim()
                    ? `لم نجد خدمة تطابق «${search.trim()}». جرّب كلمة أقصر أو تصنيفاً آخر.`
                    : "سنضيف خدمات هذا التصنيف قريباً."}
                actionLabel={search.trim() ? "مسح البحث" : undefined}
                onAction={search.trim() ? () => (search = "") : undefined}
            />
        {:else}
            <ul class="flex flex-col gap-3">
                {#each visible as service, i (service.id)}
                    <li
                        animate:flip={flipOptions()}
                        in:rise={{ delay: stagger(i) }}
                        out:fadeIn={{ duration: duration("fast") }}
                    >
                        <ServiceRow
                            {service}
                            categoryTitle={activeCategory === "all" ? categoryTitle(service.categoryId) : undefined}
                            onClick={(id) => go(`/services/${id}`)}
                        />
                    </li>
                {/each}
            </ul>
        {/if}
    </section>
</div>

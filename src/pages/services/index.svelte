<script lang="ts">
    import { flip } from "svelte/animate";
    import SearchInput from "@/components/search-input.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import ServiceRow from "@/components/cards/service-row.svelte";
    import Tabs from "@/components/ui/tabs.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
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
    /** Share of services open now — drives the ring gauge (0 while loading). */
    const ratio = $derived(isLoading || !inCategory.length ? 0 : availableCount / inCategory.length);
    const RING_R = 31;
    const RING_C = 2 * Math.PI * RING_R;
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
    <!--
        "Service Gauge" header — a light card with a faint shanasheel watermark. A ring
        gauge fills to the share of services open right now (count counts up inside it),
        beside the headline, the current scope and a small open/paused legend.
    -->
    <section
        class="relative overflow-hidden rounded-card border border-outline-variant bg-surface-container p-4 shadow-e1"
        in:rise
    >
        <span class="pointer-events-none absolute inset-y-0 end-0 w-28 text-primary opacity-[0.07]" aria-hidden="true">
            <LatticePattern tile={22} class="absolute inset-0 w-full h-full" />
        </span>

        <div class="relative flex items-center gap-4">
            <!-- Ring gauge -->
            <span class="relative grid shrink-0 place-items-center w-[72px] h-[72px]" aria-hidden="true">
                <svg viewBox="0 0 72 72" class="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="36" cy="36" r={RING_R} fill="none" stroke-width="6" class="stroke-primary-container" />
                    <circle
                        cx="36"
                        cy="36"
                        r={RING_R}
                        fill="none"
                        stroke-width="6"
                        stroke-linecap="round"
                        class="stroke-primary gauge"
                        stroke-dasharray={RING_C}
                        stroke-dashoffset={RING_C * (1 - ratio)}
                    />
                </svg>
                <span class="text-title-1 text-primary leading-none tabular-nums">
                    {#if isLoading}0{:else}<CountUp value={availableCount} />{/if}
                </span>
            </span>

            <span class="min-w-0 flex-1">
                <span class="block text-headline text-on-surface"
                    >{arabicCountNoun(availableCount, SERVICE_FORMS)} الآن</span
                >
                <span class="mt-0.5 block truncate text-caption text-on-surface-variant">{scopeLabel}</span>
                <span class="mt-2 flex flex-wrap items-center gap-1.5 text-caption">
                    <span
                        class="inline-flex items-center gap-1 rounded-pill bg-primary-container px-2 py-0.5 text-primary"
                    >
                        <span class="h-1.5 w-1.5 rounded-full bg-success"></span>
                        متاحة <span class="tabular-nums">{availableCount}</span>
                    </span>
                    <span
                        class="inline-flex items-center gap-1 rounded-pill bg-surface-container-high px-2 py-0.5 text-on-surface-variant"
                    >
                        <span class="h-1.5 w-1.5 rounded-full bg-outline"></span>
                        متوقفة <span class="tabular-nums">{pausedCount}</span>
                    </span>
                </span>
            </span>
        </div>
        <span class="sr-only">{availableCount} من {inCategory.length} خدمات متاحة {scopeLabel}</span>
    </section>

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

<style>
    .gauge {
        transition: stroke-dashoffset var(--duration-hero) var(--ease-decelerate);
    }
    @media (prefers-reduced-motion: reduce) {
        .gauge {
            transition: none;
        }
    }
</style>

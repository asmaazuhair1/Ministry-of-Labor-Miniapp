<script lang="ts">
    import { flip } from "svelte/animate";
    import SearchInput from "@/components/search-input.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import ServiceRow from "@/components/cards/service-row.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { duration, easing, fadeIn, reducedMotion, rise, stagger } from "@/utils/motion";
    import { back, go } from "@/utils/navigation";
    import { arabicCountNoun } from "@/utils/format.util";
    import { getCategoryById, getServicesByCategory } from "./service";
    import type { ServiceCategory, ServiceSummary } from "@/types/services";

    interface Props {
        params?: { categoryId?: string };
    }
    const { params }: Props = $props();

    const categoryQuery = createQuery<ServiceCategory | null>({
        key: "category-details",
        fetcher: () => getCategoryById(params?.categoryId ?? ""),
    });
    const servicesQuery = createQuery<ServiceSummary[]>({
        key: "category-services",
        fetcher: () => getServicesByCategory(params?.categoryId ?? ""),
    });

    const category = $derived(categoryQuery.data ?? null);
    const services = $derived(servicesQuery.data ?? []);
    const isLoading = $derived(categoryQuery.isLoading || servicesQuery.isLoading);

    let search = $state("");
    const availableCount = $derived(services.filter((s) => s.availability === "available").length);
    const visible = $derived.by(() => {
        const q = search.trim();
        return q ? services.filter((s) => s.title.includes(q) || s.description.includes(q)) : services;
    });

    const FORMS: [string, string, string, string] = ["خدمة متاحة", "خدمات متاحة", "خدمات متاحة", "خدمة متاحة"];
    const flipOptions = () => ({ duration: reducedMotion() ? 0 : duration("base"), easing: easing("standard") });
</script>

{#if isLoading}
    <div class="px-gutter pt-5">
        <Skeleton class="h-[212px] rounded-hero" />
        <Skeleton shape="pill" class="mt-5 h-[52px] w-full" />
        <div class="mt-5 flex flex-col gap-3">
            {#each Array(2) as _, i (i)}
                <Skeleton class="h-[104px] rounded-card" />
            {/each}
        </div>
    </div>
{:else if !category}
    <EmptyState
        icon="squares-four"
        title="التصنيف غير موجود"
        description="ربما نُقل أو أُزيل. عُد لتصفح كل الخدمات."
        actionLabel="العودة"
        onAction={back}
    />
{:else}
    <div class="px-gutter pt-5 pb-6">
        <!-- Hero -->
        <header class="relative overflow-hidden rounded-hero bg-primary-container p-5" in:rise>
            <LatticePattern tile={36} class="absolute inset-0 w-full h-full text-primary/10" />
            <div class="relative flex items-start justify-between gap-4">
                <div class="min-w-0">
                    <h1 class="text-title-1 text-on-surface">{category.title}</h1>
                    <p class="mt-2 text-body text-on-surface-variant">تصفح خدمات هذا التصنيف والتقديم عليها مباشرة.</p>
                </div>
                <IconFrame icon={category.icon} size="lg" class="bg-surface-container" />
            </div>
            <div class="relative mt-5 flex items-center gap-3">
                <span class="w-14 h-1 shrink-0 rounded-pill bg-primary"></span>
                <span class="flex items-baseline gap-1.5">
                    <span class="text-title-1 text-primary tabular-nums"><CountUp value={availableCount} /></span>
                    <span class="text-label text-on-surface">{arabicCountNoun(availableCount, FORMS)}</span>
                </span>
            </div>
        </header>

        <div class="mt-5" in:rise={{ delay: stagger(1) }}>
            <SearchInput value={search} placeholder="ابحث عن خدمة" onInput={(v) => (search = v)} />
        </div>

        <section class="mt-5" aria-live="polite">
            {#if visible.length === 0}
                <EmptyState
                    icon={search.trim() ? "magnifying-glass" : category.icon}
                    title={search.trim() ? "لا نتائج لبحثك" : "لا توجد خدمات بعد"}
                    description={search.trim()
                        ? `لم نجد خدمة تطابق «${search.trim()}» في هذا التصنيف.`
                        : "سنضيف خدمات هذا التصنيف قريباً."}
                    actionLabel={search.trim() ? "مسح البحث" : undefined}
                    onAction={search.trim() ? () => (search = "") : undefined}
                />
            {:else}
                <ul class="flex flex-col gap-3">
                    {#each visible as service, i (service.id)}
                        <li
                            animate:flip={flipOptions()}
                            in:rise={{ delay: stagger(i + 2) }}
                            out:fadeIn={{ duration: duration("fast") }}
                        >
                            <ServiceRow {service} onClick={(id) => go(`/services/${id}`)} />
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
    </div>
{/if}

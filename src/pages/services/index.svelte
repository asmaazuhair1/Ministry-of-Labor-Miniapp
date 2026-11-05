<script lang="ts">
    import { push } from "svelte-spa-router";
    import SearchInput from "@/components/search-input.svelte";
    import SectionHeader from "@/components/section-header.svelte";
    import CategoryCard from "@/components/cards/category-card.svelte";
    import ServiceCard from "@/components/cards/service-card.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getCategories, getServices } from "./service";
    import { countByCategory } from "./helpers";
    import type { ServiceCategory, ServiceSummary } from "@/types/services";

    const categoriesQuery = createQuery<ServiceCategory[]>({ key: "categories", fetcher: getCategories });
    const servicesQuery = createQuery<ServiceSummary[]>({ key: "services", fetcher: getServices });

    let search = $state("");

    const categories = $derived(categoriesQuery.data ?? []);
    const services = $derived(servicesQuery.data ?? []);
    const counts = $derived(countByCategory(services));
    const isLoading = $derived(categoriesQuery.isLoading || servicesQuery.isLoading);

    const categoryTitle = (id: string) => categories.find((c) => c.id === id)?.title;

    const results = $derived.by(() => {
        const q = search.trim();
        if (!q) return [];
        return services.filter((s) => s.title.includes(q) || s.description.includes(q));
    });

    function openCategory(id: string) {
        push(`/services/category/${id}`);
    }
    function openService(id: string) {
        push(`/services/${id}`);
    }
</script>

<div class="px-4 py-4 animate-fade-up">
    <SearchInput value={search} placeholder="ابحث عن خدمة..." onInput={(v) => (search = v)} />

    {#if isLoading}
        <PageLoading />
    {:else if search.trim()}
        <div class="mt-5">
            <SectionHeader title={`نتائج البحث (${results.length})`} />
            {#if results.length === 0}
                <EmptyState title="لا توجد نتائج" description="لم نعثر على خدمة تطابق بحثك. جرّب كلمات مختلفة." />
            {:else}
                <div class="flex flex-col gap-3">
                    {#each results as service (service.id)}
                        <ServiceCard
                            {service}
                            categoryTitle={categoryTitle(service.categoryId)}
                            onClick={openService}
                        />
                    {/each}
                </div>
            {/if}
        </div>
    {:else}
        <div class="mt-6">
            <SectionHeader title="تصنيفات الخدمات" />
            <div class="grid grid-cols-3 gap-3">
                {#each categories as category (category.id)}
                    <CategoryCard {category} count={counts[category.id] ?? 0} onClick={openCategory} />
                {/each}
            </div>
        </div>

        <div class="mt-7">
            <SectionHeader title="الخدمات الأكثر طلباً" />
            <div class="flex flex-col gap-3">
                {#each services
                    .slice()
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 5) as service (service.id)}
                    <ServiceCard {service} categoryTitle={categoryTitle(service.categoryId)} onClick={openService} />
                {/each}
            </div>
        </div>
    {/if}
</div>

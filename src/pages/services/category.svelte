<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import ServiceCard from "@/components/cards/service-card.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import { ACCENT_SOFT, ACCENT_TEXT } from "@/utils/accent.util";
    import { createQuery } from "@/hooks/create-query.svelte";
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

    function openService(id: string) {
        push(`/services/${id}`);
    }
</script>

{#if isLoading}
    <PageLoading />
{:else if !category}
    <EmptyState
        title="التصنيف غير موجود"
        description="تعذّر العثور على هذا التصنيف."
        actionLabel="العودة إلى الخدمات"
        onAction={() => push("/services")}
    />
{:else}
    <div class="px-4 py-5 animate-fade-up">
        <div class="flex items-center gap-3.5">
            <span class="grid place-items-center w-14 h-14 rounded-2xl {ACCENT_SOFT[category.accent]}">
                <AppIcon name={category.icon} size={30} weight="fill" class={ACCENT_TEXT[category.accent]} />
            </span>
            <div class="min-w-0">
                <h1 class="text-lg font-extrabold text-on-surface">{category.title}</h1>
                <p class="mt-0.5 text-xs leading-snug text-on-surface-variant">{category.description}</p>
            </div>
        </div>

        <div class="mt-6 flex flex-col gap-3">
            {#if services.length === 0}
                <EmptyState title="لا توجد خدمات" description="لا توجد خدمات متاحة ضمن هذا التصنيف حالياً." />
            {:else}
                {#each services as service (service.id)}
                    <ServiceCard {service} accent={category.accent} onClick={openService} />
                {/each}
            {/if}
        </div>
    </div>
{/if}

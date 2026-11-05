<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import { ACCENT_SOFT, ACCENT_TEXT } from "@/utils/accent.util";
    import { formatCurrencyIQD } from "@/utils/format.util";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getServiceById } from "./service";
    import type { ServiceDetail } from "@/types/services";

    interface Props {
        params?: { serviceId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<ServiceDetail | null>({
        key: "service-details",
        fetcher: () => getServiceById(params?.serviceId ?? ""),
    });

    const service = $derived(query.data ?? null);
    const canApply = $derived(service?.availability === "available");

    const availabilityNote: Record<string, string> = {
        soon: "هذه الخدمة ستتوفر قريباً.",
        unavailable: "هذه الخدمة غير متاحة حالياً.",
    };
</script>

{#if query.isLoading}
    <PageLoading />
{:else if !service}
    <EmptyState
        title="الخدمة غير موجودة"
        description="تعذّر العثور على هذه الخدمة."
        actionLabel="العودة إلى الخدمات"
        onAction={() => push("/services")}
    />
{:else}
    <div class="px-4 py-5 pb-28 animate-fade-up">
        <div class="flex items-start gap-3.5">
            <span class="grid place-items-center w-14 h-14 shrink-0 rounded-2xl {ACCENT_SOFT.primary}">
                <AppIcon name={service.icon} size={30} weight="fill" class={ACCENT_TEXT.primary} />
            </span>
            <div class="min-w-0">
                <h1 class="text-lg font-extrabold text-on-surface leading-snug">{service.title}</h1>
                <p class="mt-1 text-sm leading-relaxed text-on-surface-variant">{service.description}</p>
            </div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3">
            <div class="rounded-card bg-surface-container border border-outline-variant p-3.5 shadow-card">
                <span class="flex items-center gap-1.5 text-[11px] text-on-surface-muted">
                    <AppIcon name="clock" size={14} /> مدة الإنجاز
                </span>
                <p class="mt-1 text-[13px] font-bold text-on-surface leading-snug">{service.processingTime}</p>
            </div>
            <div class="rounded-card bg-surface-container border border-outline-variant p-3.5 shadow-card">
                <span class="flex items-center gap-1.5 text-[11px] text-on-surface-muted">
                    <AppIcon name="wallet" size={14} /> الرسوم
                </span>
                <p class="mt-1 text-[13px] font-bold text-on-surface leading-snug">
                    {#if service.fee}
                        {formatCurrencyIQD(service.fee.amount)}
                    {:else}
                        بدون رسوم
                    {/if}
                </p>
            </div>
        </div>

        {#if service.fee}
            <p class="mt-2 text-[11px] text-on-surface-muted">{service.fee.label}</p>
        {/if}

        {#if service.eligibility.length}
            <section class="mt-6">
                <h2 class="text-base font-extrabold text-on-surface mb-2.5">شروط الاستحقاق</h2>
                <ul class="flex flex-col gap-2">
                    {#each service.eligibility as item (item)}
                        <li class="flex items-start gap-2 text-sm text-on-surface-variant leading-relaxed">
                            <AppIcon name="check-circle" size={17} weight="fill" class="mt-0.5 shrink-0 text-success" />
                            {item}
                        </li>
                    {/each}
                </ul>
            </section>
        {/if}

        {#if service.requiredDocuments.length}
            <section class="mt-6">
                <h2 class="text-base font-extrabold text-on-surface mb-2.5">المستندات المطلوبة</h2>
                <ul class="flex flex-col gap-2">
                    {#each service.requiredDocuments as doc (doc)}
                        <li class="flex items-start gap-2 text-sm text-on-surface-variant leading-relaxed">
                            <AppIcon name="file-text" size={17} weight="fill" class="mt-0.5 shrink-0 text-tertiary" />
                            {doc}
                        </li>
                    {/each}
                </ul>
            </section>
        {/if}

        <section class="mt-6">
            <h2 class="text-base font-extrabold text-on-surface mb-2.5">مراحل المعاملة</h2>
            <div class="flex flex-col gap-2">
                {#each service.workflow as stage, i (stage.key)}
                    <div class="flex items-center gap-3 rounded-field bg-surface-container-high px-3.5 py-2.5">
                        <span
                            class="grid place-items-center w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-bold"
                        >
                            {i + 1}
                        </span>
                        <span class="text-[13px] font-bold text-on-surface">{stage.title}</span>
                    </div>
                {/each}
            </div>
        </section>
    </div>

    <div class="fixed bottom-0 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div
            class="pointer-events-auto w-full max-w-[480px] bg-surface-container border-t border-outline-variant px-4 py-3"
        >
            {#if canApply}
                <button
                    type="button"
                    onclick={() => push(`/services/${service.id}/apply`)}
                    class="w-full rounded-field bg-primary py-3.5 text-sm font-bold text-on-primary active:bg-primary-hover transition"
                >
                    تقديم الطلب
                </button>
            {:else}
                <div
                    class="flex items-center justify-center gap-2 rounded-field bg-surface-container-high py-3.5 text-sm font-bold text-on-surface-muted"
                >
                    <AppIcon name="clock" size={17} />
                    {availabilityNote[service.availability] ?? "غير متاحة"}
                </div>
            {/if}
        </div>
    </div>
{/if}

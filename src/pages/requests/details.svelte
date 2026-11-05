<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import StatusBadge from "@/components/status-badge.svelte";
    import StagesTimeline from "@/components/requests/stages-timeline.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import { formatArabicDateTime, formatCurrencyIQD } from "@/utils/format.util";
    import { showAlert } from "@/store/alert-state";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getRequestById } from "./service";
    import type { RequestDetail } from "@/types/requests";

    interface Props {
        params?: { requestId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<RequestDetail | null>({
        key: "request-details",
        fetcher: () => getRequestById(params?.requestId ?? ""),
    });
    const request = $derived(query.data ?? null);

    function payNow() {
        if (!request?.payment) return;
        showAlert({
            variant: "info",
            title: "إتمام الدفع (تجريبي)",
            message: `سيتم تسديد ${formatCurrencyIQD(request.payment.amount)} ضمن النسخة التجريبية دون أي دفع فعلي.`,
            confirmLabel: "تأكيد الدفع",
            cancelLabel: "إلغاء",
        });
    }
</script>

{#if query.isLoading}
    <PageLoading />
{:else if !request}
    <EmptyState
        title="الطلب غير موجود"
        description="تعذّر العثور على هذه المعاملة."
        actionLabel="العودة إلى طلباتي"
        onAction={() => push("/requests")}
    />
{:else}
    <div class="px-4 py-5 animate-fade-up flex flex-col gap-5">
        <header class="rounded-card bg-surface-container border border-outline-variant p-4 shadow-card">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h1 class="text-base font-extrabold text-on-surface leading-snug">{request.serviceTitle}</h1>
                    <p class="mt-1 flex items-center gap-1.5 text-[11px] text-on-surface-muted">
                        <AppIcon name="scroll" size={13} />
                        <span class="font-mono tracking-tight">{request.reference}</span>
                    </p>
                </div>
                <StatusBadge status={request.status} size="sm" />
            </div>
            <p
                class="mt-3 pt-3 border-t border-outline-variant flex items-center gap-1.5 text-[11px] text-on-surface-muted"
            >
                <AppIcon name="calendar" size={13} />
                تاريخ التقديم: {formatArabicDateTime(request.submittedAt)}
            </p>
        </header>

        {#if request.payment && !request.payment.paid}
            <section class="rounded-card bg-payment-container border border-payment/20 p-4">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <p class="flex items-center gap-1.5 text-[13px] font-extrabold text-payment">
                            <AppIcon name="wallet" size={16} weight="fill" /> مطلوب دفع الرسوم
                        </p>
                        <p class="mt-1 text-[11px] text-on-surface-variant">{request.payment.label}</p>
                    </div>
                    <span class="text-base font-extrabold text-payment"
                        >{formatCurrencyIQD(request.payment.amount)}</span
                    >
                </div>
                <button
                    type="button"
                    onclick={payNow}
                    class="mt-3 w-full rounded-field bg-payment py-3 text-sm font-bold text-on-primary active:opacity-90 transition"
                >
                    ادفع الآن
                </button>
            </section>
        {/if}

        <section>
            <h2 class="text-base font-extrabold text-on-surface mb-3">مراحل المعاملة</h2>
            <div class="rounded-card bg-surface-container border border-outline-variant p-4 shadow-card">
                <StagesTimeline stages={request.stages} status={request.status} />
            </div>
        </section>

        {#if request.messages.length}
            <section>
                <h2 class="text-base font-extrabold text-on-surface mb-3">التحديثات</h2>
                <div class="flex flex-col gap-2.5">
                    {#each request.messages as message (message.id)}
                        <div class="rounded-card bg-surface-container border border-outline-variant p-3.5 shadow-card">
                            <p class="text-[13px] font-bold text-on-surface">{message.title}</p>
                            <p class="mt-1 text-[13px] leading-relaxed text-on-surface-variant">{message.body}</p>
                            <p class="mt-2 text-[11px] text-on-surface-muted">{formatArabicDateTime(message.date)}</p>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if request.formData.length}
            <section>
                <h2 class="text-base font-extrabold text-on-surface mb-3">بيانات الطلب</h2>
                <dl
                    class="rounded-card bg-surface-container border border-outline-variant divide-y divide-outline-variant shadow-card overflow-hidden"
                >
                    {#each request.formData as row (row.label)}
                        <div class="flex items-center justify-between gap-4 px-4 py-3">
                            <dt class="text-[12.5px] text-on-surface-muted">{row.label}</dt>
                            <dd class="text-[13px] font-bold text-on-surface text-end">{row.value}</dd>
                        </div>
                    {/each}
                </dl>
            </section>
        {/if}

        {#if request.documents.length}
            <section>
                <h2 class="text-base font-extrabold text-on-surface mb-3">المستندات المرفقة</h2>
                <div class="flex flex-col gap-2.5">
                    {#each request.documents as doc (doc.fileName)}
                        <div class="flex items-center gap-3 rounded-field bg-surface-container-high px-3.5 py-3">
                            <AppIcon name="file-text" size={20} class="text-tertiary shrink-0" />
                            <div class="min-w-0 flex-1">
                                <p class="text-[13px] font-bold text-on-surface truncate">{doc.name}</p>
                                <p class="text-[11px] text-on-surface-muted truncate">{doc.fileName}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    </div>
{/if}

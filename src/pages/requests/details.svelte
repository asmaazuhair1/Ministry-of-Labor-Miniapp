<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import StatusBadge from "@/components/status-badge.svelte";
    import StagesTimeline from "@/components/requests/stages-timeline.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import SectionHeader from "@/components/section-header.svelte";
    import Button from "@/components/ui/button.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import Sheet from "@/components/ui/sheet.svelte";
    import { formatArabicDateTime, formatArabicDate } from "@/utils/format.util";
    import { pop, rise, stagger } from "@/utils/motion";
    import { goReplace } from "@/utils/navigation";
    import { haptic } from "@/utils/superqi.util";
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

    // Reference copy feedback.
    let copied = $state(false);
    async function copyReference() {
        if (!request) return;
        try {
            await navigator.clipboard?.writeText(request.reference);
            haptic("light");
            copied = true;
            setTimeout(() => (copied = false), 1600);
        } catch {
            // Clipboard unavailable — silently ignore.
        }
    }

    // Demo payment (no real money moves).
    let payOpen = $state(false);
    let paying = $state(false);
    let paidNow = $state(false);
    const needsPayment = $derived(!!request?.payment && !request.payment.paid && !paidNow);

    async function confirmPayment() {
        paying = true;
        await new Promise((r) => setTimeout(r, 700));
        paying = false;
        payOpen = false;
        paidNow = true;
        haptic("success");
    }

    const latestMessage = $derived(request?.messages[request.messages.length - 1]);
</script>

{#if query.isLoading}
    <div class="px-gutter pt-5 flex flex-col gap-4">
        <div class="flex items-start gap-4">
            <Skeleton shape="arch" class="w-[72px] h-[92px]" />
            <div class="flex-1 flex flex-col gap-2 pt-2">
                <Skeleton class="h-6 w-4/5" />
                <Skeleton shape="pill" class="h-7 w-28" />
            </div>
        </div>
        <Skeleton class="h-[260px] rounded-hero" />
        <Skeleton class="h-[160px] rounded-card" />
    </div>
{:else if !request}
    <EmptyState
        icon="files"
        title="الطلب غير موجود"
        description="تعذّر العثور على هذه المعاملة."
        actionLabel="العودة إلى طلباتي"
        onAction={() => goReplace("/requests")}
    />
{:else}
    <div class="px-gutter pt-5 pb-8 flex flex-col gap-section">
        <!-- Hero -->
        <header in:rise>
            <div class="flex items-start gap-4">
                <IconFrame icon={request.serviceIcon} size="lg" transitionName="request-icon-{request.id}" />
                <div class="min-w-0 flex-1 pt-1">
                    <h1 class="text-title-1 text-on-surface">{request.serviceTitle}</h1>
                    <div class="mt-3"><StatusBadge status={request.status} /></div>
                </div>
            </div>
            <div class="mt-5 flex items-center gap-2 rounded-field bg-surface-container ps-4 pe-1 shadow-e1">
                <span class="min-w-0 flex-1 py-3">
                    <span class="block text-caption text-on-surface-muted">الرقم المرجعي</span>
                    <span class="block text-label text-on-surface tracking-wide" dir="ltr">{request.reference}</span>
                </span>
                <button
                    type="button"
                    onclick={copyReference}
                    aria-label="نسخ الرقم المرجعي"
                    class="pressable inline-flex items-center gap-1.5 h-11 shrink-0 rounded-pill px-3 text-label text-primary active:bg-primary-container"
                >
                    {#if copied}
                        <span class="inline-flex items-center gap-1" in:pop>
                            <AppIcon name="check" size={16} weight="bold" /> تم النسخ
                        </span>
                    {:else}
                        <AppIcon name="files" size={16} /> نسخ
                    {/if}
                </button>
            </div>
            <p class="mt-3 flex items-center gap-1.5 text-caption text-on-surface-muted">
                <AppIcon name="calendar" size={14} />
                قُدّم في {formatArabicDate(request.submittedAt)}
            </p>
        </header>

        <!-- What needs the citizen (one primary action) -->
        {#if needsPayment && request.payment}
            <section class="rounded-hero bg-payment-container p-5" in:rise={{ delay: stagger(1) }}>
                <p class="flex items-center gap-1.5 text-label text-payment">
                    <AppIcon name="wallet" size={18} weight="fill" /> مطلوب دفع الرسوم
                </p>
                <p class="mt-3 text-display text-on-surface">
                    <CountUp value={request.payment.amount} />
                    <span class="text-headline">د.ع</span>
                </p>
                <p class="mt-1 text-caption text-on-surface-variant">{request.payment.label}</p>
                <Button size="lg" block class="mt-5" onclick={() => (payOpen = true)}>ادفع الآن</Button>
            </section>
        {:else if paidNow}
            <section class="flex items-center gap-3 rounded-hero bg-success-container p-5" in:pop>
                <AppIcon name="check-circle" size={28} weight="fill" class="text-success" />
                <div>
                    <p class="text-label text-on-surface">تم الدفع بنجاح</p>
                    <p class="text-caption text-on-surface-variant">ستنتقل معاملتك للمرحلة التالية قريباً.</p>
                </div>
            </section>
        {:else if request.status === "action-required" && latestMessage}
            <section class="rounded-hero bg-warning-container p-5" in:rise={{ delay: stagger(1) }}>
                <p class="flex items-center gap-1.5 text-label text-warning">
                    <AppIcon name="warning-circle" size={18} weight="fill" /> مطلوب إجراء منك
                </p>
                <p class="mt-2 text-headline text-on-surface">{latestMessage.title}</p>
                <p class="mt-1 text-body text-on-surface-variant">{latestMessage.body}</p>
            </section>
        {/if}

        <!-- Stages -->
        <section in:rise={{ delay: stagger(2) }}>
            <SectionHeader title="مراحل المعاملة" />
            <div class="rounded-hero bg-surface-container p-5 shadow-e1">
                <StagesTimeline stages={request.stages} status={request.status} />
            </div>
        </section>

        <!-- Updates feed -->
        {#if request.messages.length}
            <section in:rise={{ delay: stagger(3) }}>
                <SectionHeader title="التحديثات" />
                <ol
                    class="relative flex flex-col gap-4 ps-5 before:absolute before:inset-y-2 before:start-1 before:w-px before:bg-outline-variant"
                >
                    {#each request.messages.slice().reverse() as message, i (message.id)}
                        <li class="relative">
                            <span
                                class="absolute top-2 -start-5 w-2.5 h-2.5 rounded-full ring-4 ring-surface {i === 0
                                    ? 'bg-primary'
                                    : 'bg-outline'}"
                            ></span>
                            <p class="text-label text-on-surface">{message.title}</p>
                            <p class="mt-1 text-body text-on-surface-variant">{message.body}</p>
                            <p class="mt-1 text-caption text-on-surface-muted">{formatArabicDateTime(message.date)}</p>
                        </li>
                    {/each}
                </ol>
            </section>
        {/if}

        <!-- Submitted data -->
        {#if request.formData.length}
            <section in:rise={{ delay: stagger(4) }}>
                <SectionHeader title="بيانات الطلب" />
                <dl class="rounded-card bg-surface-container shadow-e1 divide-y divide-outline-variant">
                    {#each request.formData as row (row.label)}
                        <div class="flex items-start justify-between gap-4 px-4 py-3.5">
                            <dt class="text-caption text-on-surface-muted">{row.label}</dt>
                            <dd class="text-label text-on-surface text-end">{row.value}</dd>
                        </div>
                    {/each}
                </dl>
            </section>
        {/if}

        {#if request.documents.length}
            <section in:rise={{ delay: stagger(5) }}>
                <SectionHeader title="المستندات المرفقة" />
                <ul class="rounded-card bg-surface-container shadow-e1 divide-y divide-outline-variant">
                    {#each request.documents as doc (doc.fileName)}
                        <li class="flex items-center gap-3 px-4 py-3">
                            <span
                                class="grid place-items-center w-10 h-10 shrink-0 rounded-chip bg-primary-container text-primary"
                            >
                                <AppIcon name="file-text" size={20} weight="fill" />
                            </span>
                            <span class="min-w-0 flex-1">
                                <span class="block text-label text-on-surface truncate">{doc.name}</span>
                                <span class="block text-caption text-on-surface-muted truncate" dir="ltr"
                                    >{doc.fileName}</span
                                >
                            </span>
                        </li>
                    {/each}
                </ul>
            </section>
        {/if}
    </div>

    {#if request.payment}
        <Sheet open={payOpen} title="تأكيد الدفع" onClose={() => (payOpen = false)}>
            <div class="flex items-center justify-between rounded-field bg-surface-container-high px-4 py-3.5">
                <span class="text-body text-on-surface-variant">{request.payment.label}</span>
                <span class="text-headline text-on-surface tabular-nums"
                    >{request.payment.amount.toLocaleString("en-US")} د.ع</span
                >
            </div>
            <p class="mt-3 text-caption text-on-surface-muted">نسخة تجريبية — لن يتم خصم أي مبلغ حقيقي.</p>
            <div class="mt-5 flex flex-col gap-2">
                <Button size="lg" block loading={paying} onclick={confirmPayment}>تأكيد الدفع</Button>
                <Button variant="ghost" block onclick={() => (payOpen = false)}>إلغاء</Button>
            </div>
        </Sheet>
    {/if}
{/if}

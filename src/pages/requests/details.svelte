<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import Button from "@/components/ui/button.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import Sheet from "@/components/ui/sheet.svelte";
    import { STATUS_DEFINITIONS, STATUS_TOKEN_BG, STATUS_TOKEN_TEXT } from "@/config/status.config";
    import { formatArabicDate } from "@/utils/format.util";
    import { pop, rise, stagger } from "@/utils/motion";
    import { go, goReplace } from "@/utils/navigation";
    import { haptic } from "@/utils/superqi.util";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getRequestById } from "./service";
    import type { RequestDetail, RequestDocument } from "@/types/requests";

    interface Props {
        params?: { requestId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<RequestDetail | null>({
        key: "request-details",
        fetcher: () => getRequestById(params?.requestId ?? ""),
    });
    const request = $derived(query.data ?? null);
    const def = $derived(request ? STATUS_DEFINITIONS[request.status] : null);
    const latestMessage = $derived(request?.messages[request.messages.length - 1]);
    const isOpen = $derived(!!request && request.status !== "completed" && request.status !== "rejected");

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
    const hasReceipt = $derived(!!request?.payment && (request.payment.paid || paidNow));

    async function confirmPayment() {
        paying = true;
        await new Promise((r) => setTimeout(r, 700));
        paying = false;
        payOpen = false;
        paidNow = true;
        haptic("success");
    }

    // Sheets: attachment preview, receipt, help.
    let previewDoc = $state<RequestDocument | null>(null);
    let receiptOpen = $state(false);
    let helpOpen = $state(false);

    // Long values take the full row so they never squeeze into half a tile.
    const isWide = (value: string) => value.length > 18;
</script>

{#if query.isLoading}
    <div class="px-gutter pt-5 flex flex-col gap-4">
        <Skeleton class="h-[176px] rounded-card" />
        <Skeleton class="h-[52px] rounded-card" />
        <Skeleton class="h-[72px] rounded-card" />
        <Skeleton class="h-[260px] rounded-card" />
    </div>
{:else if !request || !def}
    <EmptyState
        icon="files"
        title="الطلب غير موجود"
        description="تعذّر العثور على هذه المعاملة."
        actionLabel="العودة إلى طلباتي"
        onAction={() => goReplace("/requests")}
    />
{:else}
    <div class="px-gutter pt-5 pb-8 flex flex-col gap-4">
        <!-- Summary: service, date, reference and the stage stepper -->
        <header class="rounded-card border border-outline-variant bg-surface-container p-4 shadow-e1" in:rise>
            <div class="flex items-start gap-3">
                <IconFrame icon={request.serviceIcon} size="md" transitionName="request-icon-{request.id}" />
                <div class="min-w-0 flex-1">
                    <p class="text-caption text-on-surface-muted">{formatArabicDate(request.submittedAt)}</p>
                    <h1 class="mt-0.5 text-headline text-on-surface">{request.serviceTitle}</h1>
                    <button
                        type="button"
                        onclick={copyReference}
                        aria-label="نسخ الرقم المرجعي {request.reference}"
                        class="pressable mt-1 inline-flex items-center gap-1.5 rounded-chip text-label tracking-wide text-on-surface-variant"
                    >
                        <span dir="ltr">{request.reference}</span>
                        {#if copied}
                            <span class="inline-flex text-success" in:pop
                                ><AppIcon name="check" size={14} weight="bold" /></span
                            >
                        {:else}
                            <AppIcon name="files" size={14} class="text-on-surface-muted" />
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Stepper -->
            <ol class="mt-5 flex items-start" aria-label="مراحل المعاملة">
                {#each request.stages as stage, s (stage.key)}
                    <li
                        class="relative flex flex-1 flex-col items-center text-center"
                        aria-current={stage.state === "current" ? "step" : undefined}
                    >
                        {#if s > 0}
                            <span
                                class="absolute top-3.5 end-1/2 w-full h-0.5 -translate-y-1/2 {stage.state ===
                                'upcoming'
                                    ? 'bg-outline-variant'
                                    : 'bg-primary'}"
                                aria-hidden="true"
                            ></span>
                        {/if}
                        {#if stage.state === "done"}
                            <span
                                class="relative z-[1] grid w-7 h-7 place-items-center rounded-full bg-primary text-on-primary"
                            >
                                <AppIcon name="check" size={14} weight="bold" />
                            </span>
                        {:else if stage.state === "current"}
                            <span class="relative z-[1] grid w-7 h-7 place-items-center">
                                <span class="halo absolute inset-0 rounded-full bg-secondary"></span>
                                <span
                                    class="relative grid w-7 h-7 place-items-center rounded-full bg-secondary text-label text-on-primary ring-4 ring-secondary-container"
                                    >{s + 1}</span
                                >
                            </span>
                        {:else}
                            <span
                                class="relative z-[1] grid w-7 h-7 place-items-center rounded-full border-2 border-outline-variant bg-surface-container text-label text-on-surface-muted"
                                >{s + 1}</span
                            >
                        {/if}
                        <span
                            class="mt-2 px-0.5 text-caption line-clamp-2 {stage.state === 'current'
                                ? 'font-bold text-secondary'
                                : stage.state === 'done'
                                  ? 'text-on-surface'
                                  : 'text-on-surface-muted'}">{stage.title}</span
                        >
                    </li>
                {/each}
            </ol>
        </header>

        <!-- Where the request stands now -->
        {#if paidNow}
            <section class="flex items-center gap-3 rounded-card bg-success-container px-4 py-3.5" in:pop>
                <AppIcon name="check-circle" size={22} weight="fill" class="shrink-0 text-success" />
                <p class="text-label text-on-surface">تم الدفع بنجاح، ستنتقل معاملتك للمرحلة التالية قريباً.</p>
            </section>
        {:else if latestMessage}
            <section
                class="flex items-start gap-3 rounded-card px-4 py-3.5 {STATUS_TOKEN_BG[def.token]}"
                in:rise={{ delay: stagger(1) }}
            >
                <AppIcon name="info" size={20} weight="fill" class="mt-0.5 shrink-0 {STATUS_TOKEN_TEXT[def.token]}" />
                <div class="min-w-0">
                    <p class="text-label {STATUS_TOKEN_TEXT[def.token]}">{latestMessage.title}</p>
                    <p class="mt-0.5 text-body text-on-surface-variant">{latestMessage.body}</p>
                </div>
            </section>
        {/if}

        <!-- Payment due (one primary action) -->
        {#if needsPayment && request.payment}
            <section
                class="flex items-center gap-3 rounded-card border border-outline-variant bg-surface-container p-4 shadow-e1"
                in:rise={{ delay: stagger(2) }}
            >
                <span
                    class="grid w-12 h-12 shrink-0 place-items-center rounded-frame bg-payment-container text-payment"
                >
                    <AppIcon name="wallet" size={24} weight="fill" />
                </span>
                <div class="min-w-0 flex-1">
                    <p class="text-headline text-on-surface tabular-nums">
                        <CountUp value={request.payment.amount} /> <span class="text-caption">د.ع</span>
                    </p>
                    <p class="text-caption text-on-surface-muted truncate">{request.payment.label}</p>
                </div>
                <Button onclick={() => (payOpen = true)}>ادفع الآن</Button>
            </section>
        {/if}

        <!-- Receipt -->
        {#if hasReceipt}
            <button
                type="button"
                onclick={() => (receiptOpen = true)}
                class="pressable flex items-center gap-3 rounded-card border border-outline-variant bg-surface-container p-4 text-start shadow-e1"
                in:rise={{ delay: stagger(2) }}
            >
                <span
                    class="relative grid w-12 h-12 shrink-0 place-items-center rounded-frame border border-secondary/30 bg-secondary-container text-secondary"
                >
                    <AppIcon name="file-text" size={22} />
                    <span
                        class="absolute -bottom-1.5 -start-1.5 rounded-chip bg-secondary px-1 text-[9px] font-bold leading-4 text-on-primary"
                        >PDF</span
                    >
                </span>
                <span class="min-w-0 flex-1">
                    <span class="block text-headline text-on-surface">تحميل الوصل</span>
                    <span class="block text-caption text-on-surface-muted">وصل الدفع بصيغة PDF</span>
                </span>
                <span
                    class="grid w-11 h-11 shrink-0 place-items-center rounded-full bg-secondary text-on-primary shadow-e2"
                >
                    <AppIcon name="download" size={20} weight="bold" />
                </span>
            </button>
        {/if}

        <!-- Submitted data -->
        {#if request.formData.length || request.documents.length}
            <section in:rise={{ delay: stagger(3) }}>
                <h2 class="mb-3 mt-2 text-headline text-on-surface">البيانات المقدمة</h2>
                <div class="rounded-card border border-outline-variant bg-surface-container shadow-e1">
                    {#if request.formData.length}
                        <h3 class="px-4 py-3.5 text-label text-on-surface">المعلومات الشخصية</h3>
                        <dl class="grid grid-cols-2 gap-2.5 px-4 pb-4">
                            {#each request.formData as row (row.label)}
                                <div
                                    class="rounded-field border border-outline-variant bg-surface px-3 py-2.5 {isWide(
                                        row.value,
                                    )
                                        ? 'col-span-2'
                                        : ''}"
                                >
                                    <dt class="text-caption text-on-surface-muted line-clamp-1">{row.label}</dt>
                                    <dd class="mt-1 text-label text-on-surface">{row.value}</dd>
                                </div>
                            {/each}
                        </dl>
                    {/if}

                    {#if request.documents.length}
                        <h3
                            class="px-4 py-3.5 text-label text-on-surface {request.formData.length
                                ? 'border-t border-outline-variant'
                                : ''}"
                        >
                            المرفقات
                        </h3>
                        <ul class="flex flex-col gap-2.5 px-4 pb-4">
                            {#each request.documents as doc (doc.fileName)}
                                <li
                                    class="flex items-center gap-3 rounded-field border border-outline-variant bg-surface ps-3 pe-2 py-2"
                                >
                                    <AppIcon name="file-text" size={18} class="shrink-0 text-primary" />
                                    <span class="min-w-0 flex-1 truncate text-label text-on-surface">{doc.name}</span>
                                    <button
                                        type="button"
                                        onclick={() => (previewDoc = doc)}
                                        aria-label="عرض {doc.name}"
                                        class="pressable h-9 shrink-0 rounded-pill border border-secondary/40 bg-secondary-container px-4 text-label text-secondary"
                                        >عرض</button
                                    >
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            </section>
        {/if}

        <!-- Actions -->
        <div class="mt-2 flex flex-col gap-3" in:rise={{ delay: stagger(4) }}>
            {#if isOpen}
                <button
                    type="button"
                    onclick={() => go(`/services/${request.serviceId}`)}
                    class="pressable flex items-center gap-3 rounded-card border border-outline-variant bg-surface-container p-4 text-start shadow-e1"
                >
                    <span
                        class="grid w-11 h-11 shrink-0 place-items-center rounded-frame border border-secondary/30 bg-secondary-container text-secondary"
                    >
                        <AppIcon name="pencil" size={20} />
                    </span>
                    <span class="min-w-0 flex-1">
                        <span class="block text-headline text-on-surface">تحديث الطلب</span>
                        <span class="block text-caption text-on-surface-muted">تعديل البيانات المقدمة</span>
                    </span>
                    <span
                        class="grid w-9 h-9 shrink-0 place-items-center rounded-full bg-secondary-container text-secondary"
                    >
                        <AppIcon name="arrow-left" size={16} weight="bold" />
                    </span>
                </button>
            {/if}
            <button
                type="button"
                onclick={() => (helpOpen = true)}
                class="pressable flex items-center gap-3 rounded-card border border-outline-variant bg-surface-container p-4 text-start shadow-e1"
            >
                <span
                    class="grid w-11 h-11 shrink-0 place-items-center rounded-frame border border-primary/25 bg-primary-container text-primary"
                >
                    <AppIcon name="headset" size={20} />
                </span>
                <span class="min-w-0 flex-1">
                    <span class="block text-headline text-on-surface">تواجه مشكلة؟</span>
                    <span class="block text-caption text-on-surface-muted">فريق الدعم جاهز على مدار الساعة</span>
                </span>
                <span class="grid w-9 h-9 shrink-0 place-items-center rounded-full bg-primary-container text-primary">
                    <AppIcon name="arrow-left" size={16} weight="bold" />
                </span>
            </button>
        </div>

        <!-- Notice -->
        {#if isOpen}
            <section
                class="mt-2 flex items-start gap-3 rounded-card border border-danger/20 bg-danger-container px-4 py-3.5"
                in:rise={{ delay: stagger(5) }}
            >
                <AppIcon name="warning-circle" size={20} weight="fill" class="mt-0.5 shrink-0 text-danger" />
                <p class="text-body text-on-surface-variant">
                    إذا كانت معلومات طلبك غير صحيحة، يمكنك تحديثها من «تحديث الطلب» قبل انتهاء مرحلة التدقيق.
                </p>
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

        <Sheet open={receiptOpen} title="وصل الدفع" onClose={() => (receiptOpen = false)}>
            <dl class="rounded-field bg-surface-container-high divide-y divide-outline-variant">
                <div class="flex justify-between gap-4 px-4 py-3">
                    <dt class="text-caption text-on-surface-muted">الرقم المرجعي</dt>
                    <dd class="text-label text-on-surface" dir="ltr">{request.reference}</dd>
                </div>
                <div class="flex justify-between gap-4 px-4 py-3">
                    <dt class="text-caption text-on-surface-muted">{request.payment.label}</dt>
                    <dd class="text-label text-on-surface tabular-nums">
                        {request.payment.amount.toLocaleString("en-US")} د.ع
                    </dd>
                </div>
            </dl>
            <p class="mt-3 text-caption text-on-surface-muted">نسخة تجريبية — تحميل الوصل غير متاح في العرض.</p>
            <Button variant="ghost" block class="mt-4" onclick={() => (receiptOpen = false)}>إغلاق</Button>
        </Sheet>
    {/if}

    <Sheet open={!!previewDoc} title={previewDoc?.name ?? ""} onClose={() => (previewDoc = null)}>
        <div
            class="grid h-40 place-items-center rounded-field border border-dashed border-outline-variant bg-surface-container-high text-on-surface-muted"
        >
            <span class="flex flex-col items-center gap-2">
                <AppIcon name="file-text" size={32} />
                <span class="text-caption" dir="ltr">{previewDoc?.fileName}</span>
            </span>
        </div>
        <p class="mt-3 text-caption text-on-surface-muted">نسخة تجريبية — معاينة الملف غير متاحة في العرض.</p>
        <Button variant="ghost" block class="mt-4" onclick={() => (previewDoc = null)}>إغلاق</Button>
    </Sheet>

    <Sheet open={helpOpen} title="تواجه مشكلة؟" onClose={() => (helpOpen = false)}>
        <p class="text-body text-on-surface-variant">
            فريق الدعم في وزارة العمل والشؤون الاجتماعية جاهز لمساعدتك في أي استفسار يخص هذا الطلب. احتفظ بالرقم المرجعي <span
                class="font-bold"
                dir="ltr">{request.reference}</span
            > عند التواصل.
        </p>
        <p class="mt-3 text-caption text-on-surface-muted">نسخة تجريبية — قنوات التواصل ستُضاف لاحقاً.</p>
        <Button variant="ghost" block class="mt-4" onclick={() => (helpOpen = false)}>إغلاق</Button>
    </Sheet>
{/if}

<style>
    .halo {
        animation: halo 1.8s var(--ease-standard) infinite;
    }
    @keyframes halo {
        0% {
            transform: scale(1);
            opacity: 0.4;
        }
        100% {
            transform: scale(1.9);
            opacity: 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .halo {
            animation: none;
        }
    }
</style>

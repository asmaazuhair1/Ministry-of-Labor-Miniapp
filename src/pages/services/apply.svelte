<script lang="ts">
    import { push, replace } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import FormField from "./components/form-field.svelte";
    import { formatCurrencyIQD } from "@/utils/format.util";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { showAlert } from "@/store/alert-state";
    import { getServiceById, submitApplication, type ApplicationResult } from "./service";
    import { useFormState } from "./use-form-state.svelte";
    import { buildApplicationPayload } from "./helpers";
    import type { ServiceDetail } from "@/types/services";

    interface Props {
        params?: { serviceId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<ServiceDetail | null>({
        key: "service-apply",
        fetcher: () => getServiceById(params?.serviceId ?? ""),
    });
    const service = $derived(query.data ?? null);

    type Step = "form" | "payment" | "done";
    let step = $state<Step>("form");
    let submitting = $state(false);
    let accepted = $state<boolean[]>([]);
    let declarationError = $state(false);
    let result = $state<ApplicationResult | null>(null);

    let form = $state<ReturnType<typeof useFormState> | null>(null);

    $effect(() => {
        if (service && !form) {
            form = useFormState(service.schema);
            accepted = service.declarations.map(() => false);
        }
    });

    const allAccepted = $derived(accepted.length > 0 && accepted.every(Boolean));

    function toggleDeclaration(index: number) {
        accepted[index] = !accepted[index];
        if (allAccepted) declarationError = false;
    }

    async function handleSubmit() {
        if (!service || !form) return;
        const valid = form.validateAll();
        if (!allAccepted) declarationError = true;
        if (!valid || !allAccepted) return;

        if (service.fee) {
            step = "payment";
            return;
        }
        await finalize();
    }

    async function finalize() {
        if (!service || !form) return;
        submitting = true;
        const payload = buildApplicationPayload(service.schema, form.values);
        const response = await submitApplication(service.id, payload, Boolean(service.fee));
        submitting = false;
        result = response.data;
        step = "done";
    }

    function confirmPayment() {
        showAlert({
            variant: "info",
            title: "تأكيد الدفع (تجريبي)",
            message: service?.fee
                ? `سيتم خصم ${formatCurrencyIQD(service.fee.amount)} ضمن النسخة التجريبية دون أي دفع حقيقي.`
                : "",
            confirmLabel: "تأكيد الدفع",
            cancelLabel: "إلغاء",
            onConfirm: finalize,
        });
    }
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
{:else if step === "done"}
    <div class="px-6 py-14 flex flex-col items-center text-center animate-fade-up">
        <span class="grid place-items-center w-20 h-20 rounded-full bg-success-container text-success">
            <AppIcon name="check-circle" size={44} weight="fill" />
        </span>
        <h1 class="mt-5 text-xl font-extrabold text-on-surface">تم تقديم طلبك بنجاح</h1>
        <p class="mt-2 text-sm leading-relaxed text-on-surface-variant max-w-xs">
            يمكنك متابعة مراحل معاملتك من قسم «طلباتي».
        </p>
        {#if result}
            <div class="mt-4 rounded-field bg-surface-container-high px-5 py-3">
                <span class="text-[11px] text-on-surface-muted">الرقم المرجعي</span>
                <p class="font-mono text-base font-bold text-primary tracking-tight">{result.reference}</p>
            </div>
        {/if}
        <div class="mt-7 flex flex-col gap-2.5 w-full max-w-xs">
            <button
                type="button"
                onclick={() => push("/requests")}
                class="w-full rounded-field bg-primary py-3.5 text-sm font-bold text-on-primary active:bg-primary-hover transition"
            >
                متابعة طلباتي
            </button>
            <button
                type="button"
                onclick={() => replace("/services")}
                class="w-full rounded-field bg-surface-container-high py-3.5 text-sm font-bold text-on-surface transition"
            >
                العودة إلى الخدمات
            </button>
        </div>
    </div>
{:else if step === "payment" && service.fee}
    <div class="px-4 py-6 animate-fade-up">
        <div class="rounded-card bg-surface-container border border-outline-variant p-5 shadow-card text-center">
            <span class="mx-auto grid place-items-center w-16 h-16 rounded-full bg-payment-container text-payment">
                <AppIcon name="wallet" size={34} weight="fill" />
            </span>
            <h1 class="mt-4 text-lg font-extrabold text-on-surface">إتمام الدفع</h1>
            <p class="mt-1 text-sm text-on-surface-variant">{service.title}</p>
            <div class="mt-5 flex items-center justify-between rounded-field bg-surface-container-high px-4 py-3.5">
                <span class="text-sm font-bold text-on-surface">{service.fee.label}</span>
                <span class="text-base font-extrabold text-payment">{formatCurrencyIQD(service.fee.amount)}</span>
            </div>
            <p class="mt-3 text-[11px] text-on-surface-muted leading-relaxed">
                هذه عملية دفع تجريبية لأغراض العرض فقط ولا يتم خصم أي مبلغ فعلي.
            </p>
        </div>

        <div class="mt-6 flex flex-col gap-2.5">
            <button
                type="button"
                onclick={confirmPayment}
                disabled={submitting}
                class="w-full rounded-field bg-primary py-3.5 text-sm font-bold text-on-primary active:bg-primary-hover transition disabled:opacity-60"
            >
                {submitting ? "جارٍ المعالجة..." : "ادفع الآن"}
            </button>
            <button
                type="button"
                onclick={() => (step = "form")}
                class="w-full rounded-field bg-surface-container-high py-3.5 text-sm font-bold text-on-surface transition"
            >
                رجوع
            </button>
        </div>
    </div>
{:else if form}
    <div class="px-4 py-5 animate-fade-up">
        <div class="rounded-card bg-primary-container/60 border border-primary-container px-4 py-3 mb-5">
            <p class="text-[13px] font-bold text-on-surface">{service.title}</p>
            <p class="mt-0.5 text-[11px] text-on-surface-variant">
                أكمل الحقول التالية ثم وافق على الإقرارات لإتمام التقديم.
            </p>
        </div>

        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            class="flex flex-col gap-6"
        >
            {#each service.schema as section (section.title)}
                <fieldset class="flex flex-col gap-4">
                    <legend class="text-sm font-extrabold text-primary mb-1">{section.title}</legend>
                    {#each section.fields as field (field.name)}
                        <FormField
                            {field}
                            value={form.values[field.name] ?? ""}
                            error={form.touched[field.name] ? form.errors[field.name] : undefined}
                            onInput={(v) => form?.setValue(field.name, v)}
                            onBlur={() => form?.blurField(field.name)}
                        />
                    {/each}
                </fieldset>
            {/each}

            <fieldset class="flex flex-col gap-3 rounded-card bg-surface-container-high p-4">
                <legend class="flex items-center gap-1.5 text-sm font-extrabold text-on-surface px-1">
                    <AppIcon name="shield-check" size={17} weight="fill" class="text-primary" />
                    الإقرارات والتعهدات
                </legend>
                {#each service.declarations as declaration, i (declaration)}
                    <label class="flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={accepted[i]}
                            onchange={() => toggleDeclaration(i)}
                            class="mt-0.5 w-5 h-5 shrink-0 accent-primary"
                        />
                        <span class="text-[13px] leading-relaxed text-on-surface-variant">{declaration}</span>
                    </label>
                {/each}
                {#if declarationError}
                    <p class="flex items-center gap-1 text-[11px] font-bold text-danger px-1">
                        <AppIcon name="warning-circle" size={13} weight="fill" />
                        يجب الموافقة على جميع الإقرارات للمتابعة.
                    </p>
                {/if}
            </fieldset>

            <button
                type="submit"
                disabled={submitting}
                class="w-full rounded-field bg-primary py-3.5 text-sm font-bold text-on-primary active:bg-primary-hover transition disabled:opacity-60"
            >
                {#if service.fee}
                    المتابعة إلى الدفع
                {:else}
                    تقديم الطلب
                {/if}
            </button>
        </form>
    </div>
{:else}
    <PageLoading />
{/if}

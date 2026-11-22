<script lang="ts">
    import { tick } from "svelte";
    import AppIcon from "@/components/app-icon.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import SafeArea from "@/components/safe-area.svelte";
    import Button from "@/components/ui/button.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import Sheet from "@/components/ui/sheet.svelte";
    import SuccessMark from "@/components/ui/success-mark.svelte";
    import { fieldClass } from "./components/field-styles";
    import FileUpload from "./components/file-upload.svelte";
    import SearchableSelect from "./components/searchable-select.svelte";
    import ChoiceOption from "./components/choice-option.svelte";
    import LocationPicker, { type PickedLocation } from "./components/location-picker.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { rise, stagger } from "@/utils/motion";
    import { back, go, goReplace } from "@/utils/navigation";
    import { haptic } from "@/utils/superqi.util";
    import { convertArabicToEnglishNumbers } from "@/utils/arabic-to-english-numbers";
    import { getCategories, getServiceById, submitApplication, type ApplicationResult } from "./service";
    import {
        BASE_FEE,
        EDUCATION_OPTIONS,
        LEGAL_PLEDGE_TEXT,
        PRIOR_PLEDGE_OPTIONS,
        SPECIALTIES,
        WORKERS_OPTION,
    } from "@/config/demo/application-form.demo";
    import type { ServiceCategory, ServiceDetail } from "@/types/services";

    interface Props {
        params?: { serviceId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<ServiceDetail | null>({
        key: "service-apply",
        fetcher: () => getServiceById(params?.serviceId ?? ""),
    });
    const categoriesQuery = createQuery<ServiceCategory[]>({ key: "categories", fetcher: getCategories });
    const service = $derived(query.data ?? null);
    const categoryTitle = $derived((categoriesQuery.data ?? []).find((c) => c.id === service?.categoryId)?.title ?? "");

    // ---- Form definition -------------------------------------------------
    const PROJECT_ADDRESS = [
        { name: "projectArea", label: "عنوان المشروع / اسم المنطقة", placeholder: "" },
        { name: "projectMahalla", label: "عنوان المشروع / المحلة", placeholder: "محلة" },
        { name: "projectZuqaq", label: "عنوان المشروع / الزقاق", placeholder: "زقاق" },
        { name: "projectNumber", label: "عنوان المشروع / رقم", placeholder: "رقم" },
    ];
    const OWNER_ADDRESS = [
        { name: "ownerArea", label: "عنوان صاحب المشروع / المنطقة", placeholder: "" },
        { name: "ownerMahalla", label: "عنوان صاحب المشروع / المحلة", placeholder: "محلة" },
        { name: "ownerZuqaq", label: "عنوان صاحب المشروع / الزقاق", placeholder: "زقاق" },
        { name: "ownerNumber", label: "عنوان صاحب المشروع / رقم", placeholder: "رقم" },
    ];
    const ID_FILES = [
        { name: "nationalIdFront", label: "البطاقة الوطنية وجه امامي" },
        { name: "nationalIdBack", label: "البطاقة الوطنية وجه خلفي" },
        { name: "residenceFront", label: "بطاقة السكن وجه امامي" },
        { name: "residenceBack", label: "بطاقة السكن وجه خلفي" },
        { name: "leaseContract", label: "عقد الايجار او وصل جباية" },
    ];
    const TEXT_FIELDS = ["phone", "projectName", "specialty", "ownerName", "birthDate"].concat(
        PROJECT_ADDRESS.map((f) => f.name),
        OWNER_ADDRESS.map((f) => f.name),
    );
    const FILE_FIELDS = [...ID_FILES.map((f) => f.name), "educationProof"];

    // ---- Form state ------------------------------------------------------
    let values = $state<Record<string, string>>(Object.fromEntries(TEXT_FIELDS.map((n) => [n, ""])));
    let files = $state<Record<string, File | null>>(Object.fromEntries(FILE_FIELDS.map((n) => [n, null])));
    let location = $state<PickedLocation | null>(null);
    let priorPledge = $state("");
    let education = $state("");
    let hasWorkers = $state(false);
    let legalPledge = $state(false);
    let errors = $state<Record<string, string>>({});

    const total = $derived(
        BASE_FEE +
            (PRIOR_PLEDGE_OPTIONS.find((o) => o.value === priorPledge)?.fee ?? 0) +
            (EDUCATION_OPTIONS.find((o) => o.value === education)?.fee ?? 0) +
            (hasWorkers ? (WORKERS_OPTION.fee ?? 0) : 0),
    );

    function setValue(name: string, value: string) {
        values[name] = value;
        if (errors[name]) delete errors[name];
    }

    function setFile(name: string, file: File | null) {
        files[name] = file;
        if (errors[name]) delete errors[name];
    }

    function validate(): Record<string, string> {
        const next: Record<string, string> = {};
        const required = "هذا الحقل مطلوب";
        for (const name of TEXT_FIELDS) {
            if (!values[name].trim()) next[name] = required;
        }
        const phone = convertArabicToEnglishNumbers(values.phone).replace(/\s/g, "").replace(/^0/, "");
        if (phone && !/^7\d{9}$/.test(phone)) next.phone = "رقم هاتف غير صحيح (مثال: 7XXXXXXXXX)";
        for (const name of FILE_FIELDS) {
            if (!files[name]) next[name] = "يرجى إرفاق الملف";
        }
        if (!location) next.location = "يرجى تحديد موقع المشروع على الخريطة";
        if (!priorPledge) next.priorPledge = "يرجى اختيار أحد الخيارات";
        if (!education) next.education = "يرجى اختيار أحد الخيارات";
        if (!legalPledge) next.legalPledge = "يجب الموافقة على التعهد القانوني";
        return next;
    }

    const breakdown = $derived(
        [
            { label: "رسم الخدمة", amount: BASE_FEE },
            { label: "لا يوجد تعهد سابق", amount: PRIOR_PLEDGE_OPTIONS.find((o) => o.value === priorPledge)?.fee ?? 0 },
            { label: "شهادة اخرى", amount: EDUCATION_OPTIONS.find((o) => o.value === education)?.fee ?? 0 },
            { label: "يوجد عمال", amount: hasWorkers ? (WORKERS_OPTION.fee ?? 0) : 0 },
        ].filter((line) => line.amount > 0),
    );

    // ---- Submit ----------------------------------------------------------
    let submitting = $state(false);
    let confirmOpen = $state(false);
    let shake = $state(false);
    let result = $state<ApplicationResult | null>(null);

    async function handleSubmit() {
        errors = validate();
        if (Object.keys(errors).length) {
            haptic("error");
            shake = false;
            requestAnimationFrame(() => (shake = true));
            await tick();
            document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        confirmOpen = true;
    }

    async function finalize() {
        if (!service) return;
        submitting = true;
        const payload: Record<string, string | number> = { ...values, priorPledge, education, total };
        if (hasWorkers) payload.workers = WORKERS_OPTION.value;
        if (location) {
            payload.lat = location.lat;
            payload.lng = location.lng;
        }
        const response = await submitApplication(service.id, payload, true);
        submitting = false;
        confirmOpen = false;
        result = response.data;
        window.scrollTo({ top: 0 });
    }

    const money = (n: number) => `${n.toLocaleString("en-US")} د.ع`;
</script>

{#snippet label(text: string, forId?: string)}
    <label for={forId} class="block mb-2 text-label text-on-surface">
        {text}
        <span class="text-danger" aria-hidden="true">*</span>
    </label>
{/snippet}

{#snippet fieldError(name: string)}
    {#if errors[name]}
        <p class="mt-2 flex items-center gap-1 text-caption font-bold text-danger" in:rise={{ y: -4 }}>
            <AppIcon name="warning-circle" size={14} weight="fill" />
            {errors[name]}
        </p>
    {/if}
{/snippet}

{#if query.isLoading}
    <div class="px-gutter pt-5 flex flex-col gap-4">
        <div class="flex flex-col items-center gap-4 py-4">
            <Skeleton shape="arch" class="w-24 h-[120px]" />
            <Skeleton class="h-7 w-3/4" />
            <Skeleton class="h-4 w-full" />
        </div>
        <Skeleton class="h-[420px] rounded-frame" />
    </div>
{:else if !service}
    <EmptyState
        icon="file-text"
        title="الخدمة غير موجودة"
        description="تعذّر العثور على هذه الخدمة."
        actionLabel="العودة إلى الخدمات"
        onAction={() => goReplace("/services")}
    />
{:else if result}
    <!-- Success moment -->
    <div class="px-gutter py-12 flex flex-col items-center text-center">
        <SuccessMark size={96} />
        <h1 class="mt-7 text-title-1 text-on-surface" in:rise={{ delay: stagger(4) }}>تم تقديم طلبك</h1>
        <p class="mt-2 max-w-xs text-body text-on-surface-variant" in:rise={{ delay: stagger(5) }}>
            وصل طلب «{service.title}». ستصلك إشعارات مع كل مرحلة.
        </p>
        <div class="mt-6 w-full rounded-frame bg-surface-container p-4 shadow-e1" in:rise={{ delay: stagger(6) }}>
            <p class="text-caption text-on-surface-muted">الرقم المرجعي</p>
            <p class="mt-1 text-title-2 text-primary tracking-wide" dir="ltr">{result.reference}</p>
        </div>
        <div class="mt-8 w-full flex flex-col gap-2" in:rise={{ delay: stagger(7) }}>
            <Button class="rounded-frame" size="lg" block onclick={() => go("/requests")}>متابعة طلباتي</Button>
            <Button class="rounded-frame" variant="ghost" block onclick={() => goReplace("/services")}
                >العودة إلى الخدمات</Button
            >
        </div>
    </div>
{:else}
    <div class="px-gutter pt-4 pb-40">
        <!-- Service summary card -->
        <header
            class="mb-4 overflow-hidden rounded-frame bg-surface-container shadow-e1 border-t-4 border-primary"
            in:rise
        >
            <div class="flex items-start gap-4 p-4">
                <IconFrame icon={service.icon} size="md" transitionName="service-icon-{service.id}" />
                <div class="min-w-0 flex-1">
                    <h1 class="text-title-2 text-on-surface">{service.title}</h1>
                    <p class="mt-1.5 text-body text-on-surface-variant">{service.description}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 border-t border-outline-variant bg-surface-container-high/60 px-4 py-3">
                {#if categoryTitle}
                    <span class="flex min-w-0 flex-1 items-center gap-1.5 text-label text-on-surface">
                        <AppIcon name="tag" size={18} weight="fill" class="shrink-0 text-primary" />
                        <span class="truncate">{categoryTitle}</span>
                    </span>
                    <span class="h-6 w-px shrink-0 bg-outline" aria-hidden="true"></span>
                {/if}
                <span class="flex shrink-0 items-center gap-1.5 text-label text-on-surface">
                    <AppIcon name="money" size={20} weight="fill" class="text-primary" />
                    <span class="tabular-nums">{money(BASE_FEE)}</span>
                </span>
            </div>
        </header>

        <form
            novalidate
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            class="flex flex-col gap-4"
        >
            <!-- One form card, no sub-sections -->
            <section
                class="rounded-frame bg-surface-container p-5 shadow-e1 flex flex-col gap-5"
                in:rise={{ delay: stagger(1) }}
            >
                <div data-invalid={!!errors.phone}>
                    {@render label("رقم الهاتف", "phone")}
                    <div class="flex gap-2">
                        <input
                            id="phone"
                            type="tel"
                            inputmode="numeric"
                            autocomplete="tel"
                            placeholder="ادخل رقم الهاتف"
                            value={values.phone}
                            oninput={(e) => setValue("phone", e.currentTarget.value)}
                            class={fieldClass(!!errors.phone, "flex-1")}
                        />
                        <span
                            class="grid place-items-center h-14 px-4 shrink-0 rounded-frame bg-surface-container-high text-label text-on-surface"
                            dir="ltr">+964</span
                        >
                    </div>
                    {@render fieldError("phone")}
                </div>

                <div data-invalid={!!errors.projectName}>
                    {@render label("اسم المشروع", "projectName")}
                    <input
                        id="projectName"
                        type="text"
                        value={values.projectName}
                        oninput={(e) => setValue("projectName", e.currentTarget.value)}
                        class={fieldClass(!!errors.projectName)}
                    />
                    {@render fieldError("projectName")}
                </div>

                <div data-invalid={!!errors.specialty}>
                    {@render label("الاختصاص", "specialty")}
                    <SearchableSelect
                        id="specialty"
                        value={values.specialty}
                        options={SPECIALTIES}
                        invalid={!!errors.specialty}
                        onChange={(v) => setValue("specialty", v)}
                    />
                    {@render fieldError("specialty")}
                </div>

                <div data-invalid={!!errors.ownerName}>
                    {@render label("اسم صاحب المشروع الكامل", "ownerName")}
                    <input
                        id="ownerName"
                        type="text"
                        autocomplete="name"
                        value={values.ownerName}
                        oninput={(e) => setValue("ownerName", e.currentTarget.value)}
                        class={fieldClass(!!errors.ownerName)}
                    />
                    {@render fieldError("ownerName")}
                </div>

                <div data-invalid={!!errors.birthDate}>
                    {@render label("تاريخ الميلاد", "birthDate")}
                    <div class="relative {fieldClass(!!errors.birthDate, 'flex items-center gap-3')}">
                        <AppIcon name="calendar" size={18} class="shrink-0 text-on-surface-variant" />
                        <span class="flex-1 {values.birthDate ? 'text-on-surface' : 'text-on-surface-muted'}">
                            {values.birthDate
                                ? new Date(values.birthDate).toLocaleDateString("ar-IQ", { dateStyle: "long" })
                                : "يرجى اختيار التاريخ"}
                        </span>
                        <AppIcon name="caret-down" size={16} class="shrink-0 text-on-surface-muted" />
                        <input
                            id="birthDate"
                            type="date"
                            max={new Date().toISOString().slice(0, 10)}
                            value={values.birthDate}
                            onclick={(e) => e.currentTarget.showPicker?.()}
                            onchange={(e) => setValue("birthDate", e.currentTarget.value)}
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    {@render fieldError("birthDate")}
                </div>
                <div data-invalid={!!errors.location}>
                    {@render label("العنوان المفصل للمشروع")}
                    <LocationPicker
                        value={location}
                        invalid={!!errors.location}
                        onChange={(v) => {
                            location = v;
                            delete errors.location;
                        }}
                    />
                    {@render fieldError("location")}
                </div>

                {#each [{ title: "عنوان المشروع", fields: PROJECT_ADDRESS }, { title: "عنوان صاحب المشروع", fields: OWNER_ADDRESS }] as group (group.title)}
                    <fieldset class="contents">
                        <legend class="sr-only">{group.title}</legend>
                        {#each group.fields as field (field.name)}
                            <div data-invalid={!!errors[field.name]}>
                                {@render label(field.label, field.name)}
                                <input
                                    id={field.name}
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={values[field.name]}
                                    oninput={(e) => setValue(field.name, e.currentTarget.value)}
                                    class={fieldClass(!!errors[field.name])}
                                />
                                {@render fieldError(field.name)}
                            </div>
                        {/each}
                    </fieldset>
                {/each}
                {#each ID_FILES as field (field.name)}
                    <div data-invalid={!!errors[field.name]}>
                        {@render label(field.label, field.name)}
                        <FileUpload
                            id={field.name}
                            file={files[field.name]}
                            error={errors[field.name]}
                            onChange={(f) => setFile(field.name, f)}
                        />
                    </div>
                {/each}
                <div data-invalid={!!errors.priorPledge}>
                    {@render label("هل يوجد تعهد قانوني سابق ؟")}
                    <div class="flex flex-col gap-2.5" role="radiogroup">
                        {#each PRIOR_PLEDGE_OPTIONS as option (option.value)}
                            <ChoiceOption
                                label={option.label}
                                fee={option.fee}
                                checked={priorPledge === option.value}
                                invalid={!!errors.priorPledge}
                                onToggle={() => {
                                    priorPledge = priorPledge === option.value ? "" : option.value;
                                    delete errors.priorPledge;
                                }}
                            />
                        {/each}
                    </div>
                    {@render fieldError("priorPledge")}
                </div>

                <div data-invalid={!!errors.education}>
                    {@render label("التحصيل الدراسي لصاحب المشروع")}
                    <div class="flex flex-col gap-2.5" role="radiogroup">
                        {#each EDUCATION_OPTIONS as option (option.value)}
                            <ChoiceOption
                                label={option.label}
                                fee={option.fee}
                                checked={education === option.value}
                                invalid={!!errors.education}
                                onToggle={() => {
                                    education = education === option.value ? "" : option.value;
                                    delete errors.education;
                                }}
                            />
                        {/each}
                    </div>
                    {@render fieldError("education")}
                </div>

                <div data-invalid={!!errors.educationProof}>
                    {@render label("صورة عن الشهادة او تأييد التحصيل الدراسي", "educationProof")}
                    <FileUpload
                        id="educationProof"
                        file={files.educationProof}
                        error={errors.educationProof}
                        onChange={(f) => setFile("educationProof", f)}
                    />
                </div>

                <div>
                    {@render label("عدد العمال ان وجد")}
                    <ChoiceOption
                        label={WORKERS_OPTION.label}
                        fee={WORKERS_OPTION.fee}
                        checked={hasWorkers}
                        onToggle={() => (hasWorkers = !hasWorkers)}
                    />
                </div>

                <div data-invalid={!!errors.legalPledge}>
                    {@render label("التعهد القانوني")}
                    <ChoiceOption
                        label={LEGAL_PLEDGE_TEXT}
                        checked={legalPledge}
                        invalid={!!errors.legalPledge}
                        onToggle={() => {
                            legalPledge = !legalPledge;
                            delete errors.legalPledge;
                        }}
                    />
                    {@render fieldError("legalPledge")}
                </div>
            </section>

            <!-- Sticky action bar (thumb zone): live total + the one primary action -->
            <SafeArea bottom class="fixed bottom-0 inset-x-0 z-30 flex justify-center pointer-events-none">
                <div
                    class="pointer-events-auto w-full max-w-[480px] flex items-center gap-4 rounded-t-frame bg-surface-container px-gutter pt-4 pb-4 shadow-e4"
                >
                    <div class="min-w-0">
                        <p class="text-caption text-on-surface-muted">المبلغ</p>
                        <p class="text-title-2 text-on-surface whitespace-nowrap">
                            <CountUp value={total} />
                            <span class="text-label">د.ع</span>
                        </p>
                    </div>
                    <Button type="submit" size="lg" class="rounded-frame flex-1" {shake}>إرسال الطلب</Button>
                </div>
            </SafeArea>
        </form>
    </div>

    <Sheet open={confirmOpen} title="تأكيد إرسال الطلب" onClose={() => (confirmOpen = false)}>
        <p class="text-body text-on-surface-variant">{service.title}</p>
        <ul class="mt-4 flex flex-col divide-y divide-outline-variant rounded-frame bg-surface-container-high px-4">
            {#each breakdown as line (line.label)}
                <li class="flex items-center justify-between py-3 text-body">
                    <span class="text-on-surface-variant">{line.label}</span>
                    <span class="text-on-surface tabular-nums">{money(line.amount)}</span>
                </li>
            {/each}
            <li class="flex items-center justify-between py-3">
                <span class="text-label text-on-surface">المجموع</span>
                <span class="text-headline text-primary tabular-nums">{money(total)}</span>
            </li>
        </ul>
        <p class="mt-3 text-caption text-on-surface-muted">نسخة تجريبية — لن يتم أي دفع حقيقي.</p>
        <div class="mt-5 flex flex-col gap-2">
            <Button class="rounded-frame" size="lg" block loading={submitting} onclick={finalize}>تأكيد وإرسال</Button>
            <Button class="rounded-frame" variant="ghost" block onclick={() => (confirmOpen = false)}
                >تعديل الطلب</Button
            >
        </div>
    </Sheet>
{/if}

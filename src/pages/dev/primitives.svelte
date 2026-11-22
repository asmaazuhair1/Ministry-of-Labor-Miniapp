<script lang="ts">
    /*
     * DEV-ONLY showcase of the Naseej foundations (tokens + primitives).
     * Registered in routes.config.ts only when import.meta.env.DEV is true.
     */
    import Button from "@/components/ui/button.svelte";
    import Card from "@/components/ui/card.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import Chip from "@/components/ui/chip.svelte";
    import Sheet from "@/components/ui/sheet.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import SuccessMark from "@/components/ui/success-mark.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import WeavePattern from "@/assets/patterns/weave-pattern.svelte";
    import { rise, stagger } from "@/utils/motion";

    const TYPE = [
        ["display", "28 / 34 · 800", "text-display"],
        ["title-1", "22 / 28 · 800", "text-title-1"],
        ["title-2", "18 / 24 · 800", "text-title-2"],
        ["headline", "15 / 21 · 700", "text-headline"],
        ["body", "13 / 20 · 400", "text-body"],
        ["label", "12 / 17 · 700", "text-label"],
        ["caption", "12 / 16 · 400", "text-caption"],
    ] as const;

    const CHIPS = ["الكل", "هيئة الحماية الاجتماعية", "العمل والتدريب المهني"];
    let chip = $state(0);
    let amount = $state(97000);
    let sheetOpen = $state(false);
    let shake = $state(false);
    let successKey = $state(0);

    function triggerShake() {
        shake = false;
        requestAnimationFrame(() => (shake = true));
        setTimeout(() => (shake = false), 400);
    }
</script>

<div class="px-gutter py-6 flex flex-col gap-section">
    <header in:rise>
        <p class="text-caption text-on-surface-muted">Naseej · نَسيج</p>
        <h1 class="mt-1 text-title-1 text-on-surface">الأساسيات</h1>
    </header>

    <!-- Type -->
    <section class="flex flex-col gap-3">
        <h2 class="text-label text-on-surface-muted">Type scale</h2>
        {#each TYPE as [name, spec, cls], i (name)}
            <div class="flex items-baseline justify-between gap-3" in:rise={{ delay: stagger(i) }}>
                <span class="{cls} text-on-surface truncate">وزارة العمل</span>
                <span class="shrink-0 text-caption text-on-surface-muted" dir="ltr">{name} {spec}</span>
            </div>
        {/each}
    </section>

    <!-- Icon frames -->
    <section class="flex flex-col gap-3">
        <h2 class="text-label text-on-surface-muted">Icon frame · arch</h2>
        <div class="flex items-end gap-3">
            <IconFrame icon="file-text" size="xl" />
            <IconFrame icon="users-three" size="lg" tone="gold" />
            <IconFrame icon="hand-coins" size="md" tone="neutral" />
            <IconFrame icon="briefcase" size="sm" />
        </div>
    </section>

    <!-- Buttons -->
    <section class="flex flex-col gap-3">
        <h2 class="text-label text-on-surface-muted">Buttons</h2>
        <Button size="lg" block icon="caret-left" {shake} onclick={triggerShake}>إرسال الطلب</Button>
        <div class="flex flex-wrap gap-2">
            <Button variant="secondary">ثانوي</Button>
            <Button variant="ghost">نصي</Button>
            <Button variant="danger">حذف</Button>
            <Button loading>تحميل</Button>
        </div>
    </section>

    <!-- Chips -->
    <section class="flex flex-col gap-3">
        <h2 class="text-label text-on-surface-muted">Chips</h2>
        <div class="-mx-gutter px-gutter flex gap-2 overflow-x-auto no-scrollbar">
            {#each CHIPS as label, i (label)}
                <Chip {label} selected={chip === i} count={i === 0 ? 3 : undefined} onClick={() => (chip = i)} />
            {/each}
        </div>
    </section>

    <!-- Cards + patterns + count-up -->
    <section class="flex flex-col gap-3">
        <h2 class="text-label text-on-surface-muted">Cards · elevation · patterns</h2>
        <Card tone="primary" radius="hero" padding="lg" elevation="e2" onClick={() => (amount += 8000)}>
            <LatticePattern class="absolute inset-0 w-full h-full text-on-primary/[0.07]" />
            <div class="relative flex items-center gap-4">
                <IconFrame icon="hand-coins" size="lg" tone="inverse" />
                <div class="min-w-0">
                    <p class="text-caption text-on-primary/80">المبلغ الكلي — اضغط للإضافة</p>
                    <p class="mt-1 text-display">
                        <CountUp value={amount} />
                        <span class="text-headline">د.ع</span>
                    </p>
                </div>
            </div>
        </Card>
        <div class="grid grid-cols-2 gap-3">
            <Card elevation="e1">
                <WeavePattern class="absolute inset-0 w-full h-full opacity-50" />
                <p class="relative text-headline">e1 · card</p>
                <p class="relative mt-1 text-caption text-on-surface-muted">weave texture</p>
            </Card>
            <Card elevation="e2" onClick={() => {}}>
                <p class="text-headline">e2 · raised</p>
                <p class="mt-1 text-caption text-on-surface-muted">اضغط · press .97</p>
            </Card>
        </div>
    </section>

    <!-- Skeletons -->
    <section class="flex flex-col gap-3">
        <h2 class="text-label text-on-surface-muted">Skeleton · shimmer</h2>
        <div class="flex items-center gap-3 rounded-card bg-surface-container p-4 shadow-e1">
            <Skeleton shape="arch" class="w-14 h-16" />
            <div class="flex-1 flex flex-col gap-2">
                <Skeleton class="h-4 w-3/4" />
                <Skeleton class="h-3 w-1/2" />
            </div>
            <Skeleton shape="pill" class="h-9 w-16" />
        </div>
    </section>

    <!-- Feedback -->
    <section class="flex flex-col gap-3">
        <h2 class="text-label text-on-surface-muted">Feedback</h2>
        <div class="flex items-center gap-4">
            {#key successKey}
                <SuccessMark size={72} />
            {/key}
            <div class="flex flex-col gap-2">
                <Button variant="secondary" onclick={() => successKey++}>إعادة نجاح</Button>
                <Button variant="ghost" onclick={() => (sheetOpen = true)}>فتح الورقة</Button>
            </div>
        </div>
    </section>
</div>

<Sheet open={sheetOpen} title="تأكيد الإرسال" onClose={() => (sheetOpen = false)}>
    <p class="text-body text-on-surface-variant">اسحب للأسفل أو اضغط خارج الورقة للإغلاق.</p>
    <Button block size="lg" class="mt-5" onclick={() => (sheetOpen = false)}>تأكيد</Button>
</Sheet>

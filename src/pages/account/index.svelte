<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import SectionHeader from "@/components/section-header.svelte";
    import Card from "@/components/ui/card.svelte";
    import Tabs from "@/components/ui/tabs.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { showAlert } from "@/store/alert-state";
    import { pop, rise, stagger } from "@/utils/motion";
    import { getProfile } from "./service";
    import type { UserProfile } from "@/types/profile";

    const query = createQuery<UserProfile>({ key: "profile", fetcher: getProfile });
    const profile = $derived(query.data ?? null);

    const initials = $derived(
        profile
            ? profile.fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join(" ")
            : "",
    );

    let language = $state<"ar" | "ku">("ar");

    const SUPPORT: { label: string; icon: string }[] = [
        { label: "مركز المساعدة", icon: "life-buoy" },
        { label: "سياسة الخصوصية", icon: "lock" },
        { label: "الشروط والأحكام", icon: "file-text" },
    ];

    function notYet(label: string) {
        showAlert({ variant: "info", title: label, message: "هذه الميزة غير متاحة في النسخة التجريبية." });
    }
</script>

{#if query.isLoading}
    <div class="px-gutter pt-5 flex flex-col gap-4">
        <Skeleton class="h-[236px] rounded-hero" />
        <Skeleton class="h-[132px] rounded-card" />
    </div>
{:else if profile}
    <div class="px-gutter pt-5 pb-6 flex flex-col gap-section">
        <!-- Moment: digital ID card -->
        <section in:rise>
            <Card tone="primary" radius="hero" padding="lg" elevation="e2">
                <LatticePattern class="absolute inset-0 w-full h-full text-on-primary/[0.07]" />
                <div class="relative flex items-center gap-4">
                    <span
                        class="relative grid place-items-center w-[72px] h-[92px] shrink-0 shape-arch bg-on-primary/15"
                    >
                        <span class="absolute inset-1.5 shape-arch border border-on-primary/30"></span>
                        <span class="relative mt-2 text-title-2 text-on-primary">{initials}</span>
                        {#if profile.verified}
                            <span
                                class="absolute -bottom-1 -start-1 grid place-items-center w-7 h-7 rounded-full bg-secondary text-on-secondary ring-4 ring-primary"
                                in:pop={{ delay: 300 }}
                                aria-label="هوية موثّقة"
                            >
                                <AppIcon name="seal-check" size={16} weight="fill" />
                            </span>
                        {/if}
                    </span>
                    <div class="min-w-0">
                        <h1 class="text-title-2 text-on-primary">{profile.fullName}</h1>
                        <p class="mt-1 text-label font-normal text-on-primary/85 tracking-wide tabular-nums">
                            <span dir="ltr">{profile.phone}</span>
                        </p>
                    </div>
                </div>
            </Card>
        </section>

        <!-- Preferences -->
        <section in:rise={{ delay: stagger(1) }}>
            <SectionHeader title="الإعدادات" />
            <div class="rounded-card bg-surface-container shadow-e1 divide-y divide-outline-variant">
                <div class="flex items-center justify-between gap-3 ps-4 pe-3 py-2.5">
                    <p class="flex items-center gap-2 text-label text-on-surface whitespace-nowrap">
                        <AppIcon name="translate" size={18} class="text-on-surface-variant" /> لغة التطبيق
                    </p>
                    <div class="shrink-0">
                        <Tabs
                            items={[
                                { id: "ar", label: "العربية" },
                                { id: "ku", label: "کوردی" },
                            ]}
                            value={language}
                            onChange={(id) => (language = id as "ar" | "ku")}
                            label="لغة التطبيق"
                            bleed={false}
                        />
                    </div>
                </div>
                {#each SUPPORT as item (item.label)}
                    <button
                        type="button"
                        onclick={() => notYet(item.label)}
                        class="w-full flex items-center gap-3 px-4 min-h-14 text-start transition-colors duration-[var(--duration-fast)] active:bg-surface-container-high"
                    >
                        <AppIcon name={item.icon} size={18} class="shrink-0 text-on-surface-variant" />
                        <span class="flex-1 text-label text-on-surface">{item.label}</span>
                        <AppIcon name="caret-left" size={16} class="shrink-0 text-on-surface-muted" />
                    </button>
                {/each}
            </div>
        </section>

        <footer class="flex flex-col items-center gap-2 pt-2 text-center" in:rise={{ delay: stagger(2) }}>
            <img src="/logo.png" alt="" class="w-10 h-10 object-contain opacity-80" />
            <p class="text-caption text-on-surface-muted">وزارة العمل والشؤون الاجتماعية · الإصدار 1.0.0</p>
        </footer>
    </div>
{/if}

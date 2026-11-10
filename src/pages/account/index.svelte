<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { showAlert } from "@/store/alert-state";
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
                  .join("")
            : "",
    );

    let language = $state<"ar" | "ku">("ar");

    const settings: { label: string; subtitle: string; icon: string }[] = [
        { label: "مركز المساعدة", subtitle: "إجابات سريعة", icon: "life-buoy" },
        { label: "سياسة الخصوصية", subtitle: "حماية بياناتك", icon: "lock" },
        { label: "الشروط والأحكام", subtitle: "شروط الاستخدام", icon: "file-text" },
    ];

    function notYet(label: string) {
        showAlert({ variant: "info", title: label, message: "هذه الميزة غير متاحة في النسخة التجريبية." });
    }
</script>

{#if query.isLoading}
    <PageLoading />
{:else if profile}
    <div class="py-5 animate-fade-up flex flex-col gap-5">
        <section class="px-4">
            <div class="rounded-card bg-primary text-on-primary p-5 shadow-soft">
                <div class="flex items-center gap-4">
                    <span
                        class="grid place-items-center w-16 h-16 shrink-0 rounded-full bg-white/20 text-xl font-extrabold"
                    >
                        {initials}
                    </span>
                    <div class="min-w-0">
                        <h1 class="text-lg font-extrabold truncate">{profile.fullName}</h1>
                        <p class="mt-0.5 flex items-center gap-1.5 text-[12px] text-on-primary/85">
                            <AppIcon name="identification-card" size={14} />
                            <span class="font-mono tracking-tight">{profile.nationalId}</span>
                        </p>
                    </div>
                </div>
                {#if profile.verified}
                    <div class="mt-4 flex items-center gap-1.5 rounded-full bg-white/15 w-fit px-3 py-1.5">
                        <AppIcon name="seal-check" size={15} weight="fill" />
                        <span class="text-[11px] font-bold">هوية رقمية موثّقة</span>
                    </div>
                {/if}
            </div>
        </section>

        <section class="px-4 flex flex-col gap-4">
            <!-- Language picker -->
            <div class="rounded-card bg-surface-container border border-outline-variant shadow-card p-4">
                <div class="flex items-center gap-3">
                    <span class="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-surface-container-highest">
                        <AppIcon name="translate" size={20} class="text-on-surface-variant" />
                    </span>
                    <div class="flex-1 min-w-0">
                        <p class="text-[13px] font-bold text-on-surface">اللغة</p>
                        <p class="text-[11px] text-on-surface-muted">{language === "ar" ? "العربية" : "الكوردية"}</p>
                    </div>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-1 rounded-field bg-surface-container-high p-1">
                    <button
                        type="button"
                        onclick={() => (language = "ar")}
                        class="rounded-[0.6rem] py-2 text-[12px] font-bold transition {language === 'ar'
                            ? 'bg-surface-container text-primary shadow-card'
                            : 'text-on-surface-variant'}"
                    >
                        عربي
                    </button>
                    <button
                        type="button"
                        onclick={() => (language = "ku")}
                        class="rounded-[0.6rem] py-2 text-[12px] font-bold transition {language === 'ku'
                            ? 'bg-surface-container text-primary shadow-card'
                            : 'text-on-surface-variant'}"
                    >
                        کوردی
                    </button>
                </div>
            </div>

            <!-- Help / Privacy / Terms -->
            <div
                class="rounded-card bg-surface-container border border-outline-variant divide-y divide-outline-variant shadow-card overflow-hidden"
            >
                {#each settings as item (item.label)}
                    <button
                        type="button"
                        onclick={() => notYet(item.label)}
                        class="w-full flex items-center gap-3 px-4 py-3 text-start active:bg-surface-container-high transition"
                    >
                        <span
                            class="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-surface-container-highest"
                        >
                            <AppIcon name={item.icon} size={19} class="text-on-surface-variant" />
                        </span>
                        <div class="flex-1 min-w-0">
                            <p class="text-[13px] font-bold text-on-surface">{item.label}</p>
                            <p class="text-[11px] text-on-surface-muted truncate">{item.subtitle}</p>
                        </div>
                        <AppIcon name="caret-left" size={16} class="text-on-surface-muted shrink-0" />
                    </button>
                {/each}
            </div>

            <!-- About -->
            <div
                class="rounded-card bg-surface-container border border-outline-variant shadow-card px-4 py-3 flex items-center gap-3"
            >
                <span class="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-surface-container-highest">
                    <AppIcon name="info" size={19} class="text-on-surface-variant" />
                </span>
                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-bold text-on-surface">حول التطبيق</p>
                    <p class="text-[11px] text-on-surface-muted">الإصدار 1.0.0</p>
                </div>
            </div>
        </section>
    </div>
{/if}

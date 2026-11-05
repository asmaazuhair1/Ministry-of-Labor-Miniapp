<script lang="ts">
    import { push } from "svelte-spa-router";
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

    const accountLinks: { label: string; icon: string; action: () => void }[] = [
        { label: "تعديل البيانات الشخصية", icon: "pencil", action: () => push("/account/edit") },
        { label: "الإشعارات", icon: "bell", action: () => push("/notifications") },
        { label: "طلباتي", icon: "files", action: () => push("/requests") },
    ];

    function notYet(label: string) {
        showAlert({ variant: "info", title: label, message: "هذه الميزة غير متاحة في النسخة التجريبية." });
    }

    function confirmLogout() {
        showAlert({
            variant: "warning",
            title: "تسجيل الخروج",
            message: "هل تريد تسجيل الخروج من الحساب؟ (تجريبي)",
            confirmLabel: "تسجيل الخروج",
            cancelLabel: "إلغاء",
        });
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

        {#each profile.sections as section (section.key)}
            <section class="px-4">
                <h2 class="flex items-center gap-2 text-[13px] font-extrabold text-on-surface-variant mb-2.5">
                    <AppIcon name={section.icon} size={17} class="text-primary" />
                    {section.title}
                </h2>
                <dl
                    class="rounded-card bg-surface-container border border-outline-variant divide-y divide-outline-variant shadow-card overflow-hidden"
                >
                    {#each section.fields as field (field.label)}
                        <div class="flex items-center justify-between gap-4 px-4 py-3">
                            <dt class="text-[12.5px] text-on-surface-muted">{field.label}</dt>
                            <dd class="text-[13px] font-bold text-on-surface text-end">{field.value}</dd>
                        </div>
                    {/each}
                </dl>
            </section>
        {/each}

        <section class="px-4">
            <h2 class="text-[13px] font-extrabold text-on-surface-variant mb-2.5">إدارة الحساب</h2>
            <div
                class="rounded-card bg-surface-container border border-outline-variant divide-y divide-outline-variant shadow-card overflow-hidden"
            >
                {#each accountLinks as link (link.label)}
                    <button
                        type="button"
                        onclick={link.action}
                        class="w-full flex items-center gap-3 px-4 py-3.5 text-start active:bg-surface-container-high transition"
                    >
                        <AppIcon name={link.icon} size={20} class="text-on-surface-variant shrink-0" />
                        <span class="flex-1 text-[13px] font-bold text-on-surface">{link.label}</span>
                        <AppIcon name="caret-left" size={17} class="text-on-surface-muted" />
                    </button>
                {/each}
                <button
                    type="button"
                    onclick={() => notYet("اللغة")}
                    class="w-full flex items-center gap-3 px-4 py-3.5 text-start active:bg-surface-container-high transition"
                >
                    <AppIcon name="translate" size={20} class="text-on-surface-variant shrink-0" />
                    <span class="flex-1 text-[13px] font-bold text-on-surface">لغة التطبيق</span>
                    <span class="text-[12px] text-on-surface-muted">العربية</span>
                </button>
            </div>
        </section>

        <section class="px-4">
            <button
                type="button"
                onclick={confirmLogout}
                class="w-full flex items-center justify-center gap-2 rounded-field bg-danger-container py-3.5 text-sm font-bold text-danger active:opacity-90 transition"
            >
                <AppIcon name="sign-out" size={19} weight="bold" />
                تسجيل الخروج
            </button>
            <p class="mt-4 text-center text-[11px] text-on-surface-muted leading-relaxed">
                نسخة تجريبية — جميع البيانات لأغراض العرض فقط.
            </p>
        </section>
    </div>
{/if}

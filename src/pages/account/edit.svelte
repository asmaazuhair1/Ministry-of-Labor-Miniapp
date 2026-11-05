<script lang="ts">
    import { pop } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import PageLoading from "@/components/loading/page-loading.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { showAlert } from "@/store/alert-state";
    import { getProfile, updateProfile } from "./service";
    import type { UserProfile } from "@/types/profile";

    const query = createQuery<UserProfile>({ key: "profile-edit", fetcher: getProfile });

    let draft = $state<UserProfile | null>(null);
    let saving = $state(false);

    $effect(() => {
        if (query.data && !draft) {
            draft = structuredClone($state.snapshot(query.data)) as UserProfile;
        }
    });

    async function save() {
        if (!draft) return;
        saving = true;
        await updateProfile(draft);
        saving = false;
        showAlert({
            variant: "success",
            title: "تم الحفظ",
            message: "تم تحديث بياناتك بنجاح (تجريبي).",
            confirmLabel: "حسناً",
            onConfirm: () => pop(),
        });
    }
</script>

{#if query.isLoading || !draft}
    <PageLoading />
{:else}
    <form
        onsubmit={(e) => {
            e.preventDefault();
            save();
        }}
        class="px-4 py-5 animate-fade-up flex flex-col gap-6"
    >
        {#each draft.sections as section (section.key)}
            <fieldset class="flex flex-col gap-4">
                <legend class="flex items-center gap-2 text-sm font-extrabold text-primary mb-1">
                    <AppIcon name={section.icon} size={17} />
                    {section.title}
                </legend>
                {#each section.fields as field, fi (field.label)}
                    {@const fieldId = `${section.key}-${fi}`}
                    <div class="flex flex-col gap-1.5">
                        <label for={fieldId} class="text-[13px] font-bold text-on-surface">{field.label}</label>
                        <input
                            id={fieldId}
                            type="text"
                            bind:value={field.value}
                            class="w-full rounded-field bg-surface-container-high border border-transparent focus:border-primary px-3.5 py-3 text-sm text-on-surface outline-none transition"
                        />
                    </div>
                {/each}
            </fieldset>
        {/each}

        <button
            type="submit"
            disabled={saving}
            class="w-full rounded-field bg-primary py-3.5 text-sm font-bold text-on-primary active:bg-primary-hover transition disabled:opacity-60"
        >
            {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
    </form>
{/if}

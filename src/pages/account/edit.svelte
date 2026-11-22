<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import SafeArea from "@/components/safe-area.svelte";
    import Button from "@/components/ui/button.svelte";
    import { fieldClass } from "@/pages/services/components/field-styles";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { pop, rise, stagger } from "@/utils/motion";
    import { back } from "@/utils/navigation";
    import { haptic } from "@/utils/superqi.util";
    import { getProfile, updateProfile } from "./service";
    import type { UserProfile } from "@/types/profile";

    const query = createQuery<UserProfile>({ key: "profile-edit", fetcher: getProfile });

    let draft = $state<UserProfile | null>(null);
    let original = "";
    let saving = $state(false);
    let saved = $state(false);

    $effect(() => {
        if (query.data && !draft) {
            draft = structuredClone($state.snapshot(query.data)) as UserProfile;
            original = JSON.stringify(draft);
        }
    });

    // Account metadata and the national ID come from verified records; everything else is editable.
    const READ_ONLY = new Set(["account"]);
    const READ_ONLY_FIELDS = new Set(["رقم الهوية الوطنية"]);
    const dirty = $derived(!!draft && JSON.stringify(draft) !== original);

    async function save() {
        if (!draft || !dirty) return;
        saving = true;
        await updateProfile(draft);
        saving = false;
        saved = true;
        haptic("success");
        setTimeout(back, 900);
    }
</script>

{#if query.isLoading || !draft}
    <div class="px-gutter pt-5 flex flex-col gap-4">
        {#each Array(3) as _, i (i)}
            <Skeleton class="h-[220px] rounded-hero" />
        {/each}
    </div>
{:else}
    <form
        onsubmit={(e) => {
            e.preventDefault();
            save();
        }}
        class="px-gutter pt-5 pb-36 flex flex-col gap-4"
    >
        {#each draft.sections as section, si (section.key)}
            {@const readOnly = READ_ONLY.has(section.key)}
            <fieldset
                class="rounded-hero bg-surface-container p-5 shadow-e1 flex flex-col gap-4"
                in:rise={{ delay: stagger(si) }}
            >
                <legend class="sr-only">{section.title}</legend>
                <div class="flex items-center gap-3" aria-hidden="true">
                    <span
                        class="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-primary-container text-primary"
                    >
                        <AppIcon name={section.icon} size={18} />
                    </span>
                    <span class="flex-1 text-headline text-on-surface">{section.title}</span>
                    {#if readOnly}
                        <span class="inline-flex items-center gap-1 text-caption text-on-surface-muted">
                            <AppIcon name="lock" size={14} /> للعرض فقط
                        </span>
                    {/if}
                </div>
                {#each section.fields as field, fi (field.label)}
                    {@const fieldId = `${section.key}-${fi}`}
                    {@const locked = readOnly || READ_ONLY_FIELDS.has(field.label)}
                    <div>
                        <label for={fieldId} class="flex items-center gap-1 mb-2 text-label text-on-surface">
                            {field.label}
                            {#if locked && !readOnly}<AppIcon
                                    name="lock"
                                    size={13}
                                    class="text-on-surface-muted"
                                />{/if}
                        </label>
                        <input
                            id={fieldId}
                            type="text"
                            bind:value={field.value}
                            readonly={locked}
                            class={fieldClass(false, locked ? "opacity-70" : "")}
                        />
                    </div>
                {/each}
            </fieldset>
        {/each}

        <SafeArea bottom class="fixed bottom-0 inset-x-0 z-30 flex justify-center pointer-events-none">
            <div
                class="pointer-events-auto w-full max-w-[480px] rounded-t-hero bg-surface-container px-gutter pt-4 pb-4 shadow-e4"
            >
                {#if saved}
                    <p class="flex h-14 items-center justify-center gap-2 text-label text-success" in:pop>
                        <AppIcon name="check-circle" size={22} weight="fill" /> تم حفظ التغييرات
                    </p>
                {:else}
                    <Button type="submit" size="lg" block loading={saving} disabled={!dirty}>
                        {dirty ? "حفظ التغييرات" : "لا توجد تغييرات"}
                    </Button>
                {/if}
            </div>
        </SafeArea>
    </form>
{/if}

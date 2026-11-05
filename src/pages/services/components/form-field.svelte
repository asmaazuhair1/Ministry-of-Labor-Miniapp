<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import type { FormField } from "@/types/services";

    interface Props {
        field: FormField;
        value: string;
        error?: string;
        onInput: (value: string) => void;
        onBlur: () => void;
    }

    const { field, value, error, onInput, onBlur }: Props = $props();

    const inputMode = $derived(
        field.type === "number" || field.type === "national-id" || field.type === "phone" ? "numeric" : "text",
    );

    function handle(event: Event) {
        onInput((event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value);
    }

    const baseField =
        "w-full rounded-field bg-surface-container-high border px-3.5 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none transition";
    const borderClass = $derived(error ? "border-danger" : "border-transparent focus:border-primary");
</script>

<div class="flex flex-col gap-1.5">
    <label for={field.name} class="text-[13px] font-bold text-on-surface">
        {field.label}
        {#if field.required}<span class="text-danger">*</span>{/if}
    </label>

    {#if field.type === "textarea"}
        <textarea
            id={field.name}
            name={field.name}
            rows="4"
            {value}
            placeholder={field.placeholder}
            oninput={handle}
            onblur={onBlur}
            class="{baseField} {borderClass} resize-none leading-relaxed"
        ></textarea>
    {:else if field.type === "select"}
        <div class="relative">
            <select
                id={field.name}
                name={field.name}
                {value}
                onchange={handle}
                onblur={onBlur}
                class="{baseField} {borderClass} appearance-none pe-10 {value ? '' : 'text-on-surface-muted'}"
            >
                <option value="" disabled>اختر...</option>
                {#each field.options ?? [] as option (option.value)}
                    <option value={option.value} class="text-on-surface">{option.label}</option>
                {/each}
            </select>
            <span class="pointer-events-none absolute inset-y-0 end-3 grid place-items-center text-on-surface-muted">
                <AppIcon name="caret-down" size={18} />
            </span>
        </div>
    {:else if field.type === "file"}
        <label
            for={field.name}
            class="{baseField} {borderClass} flex items-center justify-between gap-2 cursor-pointer text-on-surface-muted"
        >
            <span class="flex items-center gap-2">
                <AppIcon name="upload-simple" size={18} />
                {value ? value : "اختر ملفاً للرفع"}
            </span>
            <AppIcon name="paperclip" size={16} />
            <input
                id={field.name}
                name={field.name}
                type="file"
                class="hidden"
                onchange={(e) => {
                    const file = (e.currentTarget as HTMLInputElement).files?.[0];
                    onInput(file?.name ?? "");
                    onBlur();
                }}
            />
        </label>
    {:else}
        <input
            id={field.name}
            name={field.name}
            type={field.type === "date" ? "date" : "text"}
            inputmode={inputMode}
            {value}
            placeholder={field.placeholder}
            oninput={handle}
            onblur={onBlur}
            class="{baseField} {borderClass}"
        />
    {/if}

    {#if error}
        <p class="flex items-center gap-1 text-[11px] font-bold text-danger">
            <AppIcon name="warning-circle" size={13} weight="fill" />
            {error}
        </p>
    {:else if field.hint}
        <p class="text-[11px] text-on-surface-muted">{field.hint}</p>
    {/if}
</div>

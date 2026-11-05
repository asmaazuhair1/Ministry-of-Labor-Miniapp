<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";

    interface Props {
        value: string;
        placeholder?: string;
        onInput: (value: string) => void;
    }

    const { value, placeholder = "ابحث...", onInput }: Props = $props();

    function handle(event: Event) {
        onInput((event.currentTarget as HTMLInputElement).value);
    }

    function clear() {
        onInput("");
    }
</script>

<div
    class="flex items-center gap-2 rounded-field bg-surface-container-high px-3.5 h-12 border border-transparent focus-within:border-primary transition"
>
    <AppIcon name="magnifying-glass" size={20} class="text-on-surface-muted shrink-0" />
    <input
        type="search"
        inputmode="search"
        {value}
        {placeholder}
        oninput={handle}
        class="flex-1 min-w-0 bg-transparent text-sm text-on-surface placeholder:text-on-surface-muted outline-none"
    />
    {#if value}
        <button
            type="button"
            onclick={clear}
            aria-label="مسح"
            class="shrink-0 text-on-surface-muted active:text-on-surface"
        >
            <AppIcon name="x-circle" size={18} weight="fill" />
        </button>
    {/if}
</div>

<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { pop } from "@/utils/motion";

    interface Props {
        value: string;
        placeholder?: string;
        onInput: (value: string) => void;
    }

    const { value, placeholder = "ابحث...", onInput }: Props = $props();
</script>

<div
    class="flex items-center gap-2.5 h-[52px] rounded-pill bg-surface-container ps-5 pe-2 shadow-e1 border border-transparent focus-within:border-primary transition-colors duration-[var(--duration-fast)]"
>
    <AppIcon name="magnifying-glass" size={20} class="text-on-surface-muted shrink-0" />
    <input
        type="search"
        inputmode="search"
        {value}
        {placeholder}
        oninput={(e) => onInput(e.currentTarget.value)}
        class="flex-1 min-w-0 bg-transparent text-body text-on-surface placeholder:text-on-surface-muted outline-none [&::-webkit-search-cancel-button]:hidden"
    />
    {#if value}
        <button
            type="button"
            onclick={() => onInput("")}
            aria-label="مسح البحث"
            class="pressable grid place-items-center w-11 h-11 shrink-0 rounded-full text-on-surface-muted active:bg-surface-container-high"
            transition:pop
        >
            <AppIcon name="x-circle" size={20} weight="fill" />
        </button>
    {/if}
</div>

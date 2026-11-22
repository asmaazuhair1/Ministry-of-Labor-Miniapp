<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { twMerge } from "@/utils/tw-merge.util";

    interface Props {
        label: string;
        selected?: boolean;
        icon?: string;
        count?: number;
        onClick?: () => void;
        class?: string;
    }

    const { label, selected = false, icon, count, onClick, class: className = "" }: Props = $props();
</script>

<button
    type="button"
    onclick={onClick}
    aria-pressed={selected}
    class={twMerge(
        "pressable inline-flex items-center gap-1.5 h-11 shrink-0 rounded-pill px-4 text-label whitespace-nowrap border",
        selected
            ? "bg-on-surface text-surface-container border-on-surface"
            : "bg-surface-container text-on-surface-variant border-outline-variant",
        className,
    )}
>
    {#if icon}
        <AppIcon name={icon} size={16} weight={selected ? "fill" : "regular"} />
    {/if}
    {label}
    {#if count !== undefined}
        <span
            class="min-w-5 h-5 grid place-items-center rounded-pill px-1.5 text-caption font-bold {selected
                ? 'bg-surface-container/20'
                : 'bg-surface-container-high'}">{count}</span
        >
    {/if}
</button>

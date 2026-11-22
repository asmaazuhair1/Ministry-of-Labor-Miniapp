<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";

    interface Props {
        title: string;
        actionLabel?: string;
        onAction?: () => void;
    }

    const { title, actionLabel, onAction }: Props = $props();
</script>

<div class="flex items-center justify-between gap-3 mb-3">
    <h2 class="text-title-2 text-on-surface">{title}</h2>
    {#if actionLabel && onAction}
        <button
            type="button"
            onclick={onAction}
            class="pressable -me-3 inline-flex items-center gap-1 h-11 rounded-pill px-3 text-label text-primary active:bg-primary-container"
        >
            {actionLabel}
            <AppIcon name="caret-left" size={14} weight="bold" />
        </button>
    {/if}
</div>

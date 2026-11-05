<script lang="ts">
    interface Props {
        title: string;
        actionLabel?: string;
        onAction?: () => void;
    }

    const { title, actionLabel, onAction }: Props = $props();
</script>

<div class="flex items-center justify-between gap-3 mb-3">
    <h2 class="text-base font-extrabold text-on-surface">{title}</h2>
    {#if actionLabel && onAction}
        <button type="button" onclick={onAction} class="text-xs font-bold text-primary active:opacity-70 transition">
            {actionLabel}
        </button>
    {/if}
</div>

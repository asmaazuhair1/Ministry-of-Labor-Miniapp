<script lang="ts">
    import EmptyArt from "@/assets/empty-state-art.svelte";

    interface Props {
        title: string;
        description?: string;
        actionLabel?: string;
        onAction?: () => void;
    }

    const { title, description, actionLabel, onAction }: Props = $props();
</script>

<div class="flex flex-col items-center text-center px-8 py-14">
    <EmptyArt size={132} />
    <h3 class="mt-5 text-base font-extrabold text-on-surface">{title}</h3>
    {#if description}
        <p class="mt-2 text-sm leading-relaxed text-on-surface-variant max-w-xs">{description}</p>
    {/if}
    {#if actionLabel && onAction}
        <button
            type="button"
            onclick={onAction}
            class="mt-6 rounded-field bg-primary px-6 py-3 text-sm font-bold text-on-primary active:bg-primary-hover transition"
        >
            {actionLabel}
        </button>
    {/if}
</div>

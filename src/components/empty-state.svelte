<script lang="ts">
    import EmptyArt from "@/assets/empty-state-art.svelte";
    import Button from "@/components/ui/button.svelte";
    import { rise } from "@/utils/motion";

    interface Props {
        title: string;
        description?: string;
        icon?: string;
        actionLabel?: string;
        onAction?: () => void;
    }

    const { title, description, icon, actionLabel, onAction }: Props = $props();
</script>

<div class="flex flex-col items-center text-center px-8 py-12" in:rise>
    <EmptyArt {icon} size={112} />
    <h3 class="mt-6 text-title-2 text-on-surface">{title}</h3>
    {#if description}
        <p class="mt-2 text-body text-on-surface-variant max-w-xs">{description}</p>
    {/if}
    {#if actionLabel && onAction}
        <Button class="mt-6" onclick={onAction}>{actionLabel}</Button>
    {/if}
</div>

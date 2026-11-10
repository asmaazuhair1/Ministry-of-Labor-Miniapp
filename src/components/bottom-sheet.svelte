<script lang="ts">
    import type { Snippet } from "svelte";
    import SafeArea from "@/components/safe-area.svelte";

    interface Props {
        open: boolean;
        title?: string;
        onClose: () => void;
        children: Snippet;
    }

    const { open, title = "", onClose, children }: Props = $props();

    function onKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") onClose();
    }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
    <div class="fixed inset-0 z-50 flex items-end justify-center">
        <button type="button" aria-label="إغلاق" class="absolute inset-0 bg-black/40" onclick={onClose}></button>
        <div
            role="dialog"
            aria-modal="true"
            class="animate-sheet relative w-full max-w-[440px] rounded-t-3xl bg-surface-container p-4 shadow-float"
        >
            <SafeArea bottom>
                <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-outline-variant"></div>
                {#if title}
                    <h2 class="mb-2 px-2 text-sm font-bold text-on-surface-variant">{title}</h2>
                {/if}
                {@render children()}
            </SafeArea>
        </div>
    </div>
{/if}

<script lang="ts">
    import type { Snippet } from "svelte";
    import { Spring } from "svelte/motion";
    import SafeArea from "@/components/safe-area.svelte";
    import { fadeIn, reducedMotion, sheetSlide } from "@/utils/motion";

    interface Props {
        open: boolean;
        title?: string;
        onClose: () => void;
        children: Snippet;
    }

    const { open, title = "", onClose, children }: Props = $props();

    /** Distance (px) the sheet must be dragged down before it dismisses. */
    const DISMISS_AT = 96;

    const offset = new Spring(0, { stiffness: 0.15, damping: 0.8 });
    let dragStart: number | null = null;

    function onKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") onClose();
    }

    function onPointerDown(e: PointerEvent) {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        dragStart = e.clientY;
    }
    function onPointerMove(e: PointerEvent) {
        if (dragStart === null) return;
        offset.set(Math.max(0, e.clientY - dragStart), { instant: true });
    }
    function onPointerUp() {
        if (dragStart === null) return;
        dragStart = null;
        if (offset.current > DISMISS_AT) {
            onClose();
            offset.set(0, { instant: true });
        } else {
            offset.set(0, { instant: reducedMotion() });
        }
    }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
    <div class="fixed inset-0 z-50 flex items-end justify-center">
        <button type="button" aria-label="إغلاق" class="absolute inset-0 bg-scrim" onclick={onClose} transition:fadeIn
        ></button>
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title || undefined}
            class="relative w-full max-w-[440px] rounded-t-hero bg-surface-container shadow-e4"
            style="transform: translateY({offset.current}px)"
            transition:sheetSlide
        >
            <div
                class="flex justify-center pt-3 pb-2 touch-none cursor-grab"
                onpointerdown={onPointerDown}
                onpointermove={onPointerMove}
                onpointerup={onPointerUp}
                onpointercancel={onPointerUp}
                role="presentation"
            >
                <span class="h-1.5 w-11 rounded-pill bg-outline"></span>
            </div>
            <SafeArea bottom class="px-5 pb-5">
                {#if title}
                    <h2 class="mb-4 text-title-2 text-on-surface">{title}</h2>
                {/if}
                {@render children()}
            </SafeArea>
        </div>
    </div>
{/if}

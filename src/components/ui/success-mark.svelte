<script lang="ts">
    import { onMount } from "svelte";
    import { pop } from "@/utils/motion";
    import { haptic } from "@/utils/superqi.util";

    /** Success moment: arch frame pops in, then the checkmark draws itself. */
    interface Props {
        size?: number;
    }
    const { size = 88 }: Props = $props();

    onMount(() => haptic("success"));
</script>

<span
    class="relative grid place-items-center shape-arch bg-success-container text-success"
    style="width:{size}px;height:{size * 1.15}px"
    in:pop
    role="img"
    aria-label="تم بنجاح"
>
    <svg viewBox="0 0 52 52" class="w-1/2 mt-2" fill="none" aria-hidden="true">
        <path
            d="M14 27 l8 8 l16 -18"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="check-draw"
        />
    </svg>
</span>

<style>
    .check-draw {
        stroke-dasharray: 40;
        stroke-dashoffset: 40;
        animation: draw var(--duration-hero) var(--ease-decelerate) var(--duration-base) forwards;
    }
    @keyframes draw {
        to {
            stroke-dashoffset: 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .check-draw {
            animation: none;
            stroke-dashoffset: 0;
        }
    }
</style>

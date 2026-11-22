<script lang="ts">
    import type { Snippet } from "svelte";
    import { Tween } from "svelte/motion";
    import { duration, easing, reducedMotion } from "@/utils/motion";

    /** Animated progress ring (0–1). Fills from 0 on mount; jumps under reduced motion. */
    interface Props {
        value: number;
        size?: number;
        stroke?: number;
        /** Tailwind text-color classes for the track and the fill (uses currentColor). */
        trackClass?: string;
        fillClass?: string;
        delay?: number;
        label?: string;
        children?: Snippet;
    }

    const {
        value,
        size = 88,
        stroke = 8,
        trackClass = "text-surface-container-high",
        fillClass = "text-primary",
        delay = 0,
        label,
        children,
    }: Props = $props();

    const radius = $derived((size - stroke) / 2);
    const circumference = $derived(2 * Math.PI * radius);
    const progress = new Tween(0, { duration: duration("hero"), easing: easing("decelerate") });

    $effect(() => {
        const target = Math.min(1, Math.max(0, value));
        progress.set(target, reducedMotion() ? { duration: 0 } : { delay });
    });
</script>

<span
    class="relative grid place-items-center shrink-0"
    style="width:{size}px;height:{size}px"
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(value * 100)}
    aria-label={label}
>
    <svg width={size} height={size} viewBox="0 0 {size} {size}" class="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            stroke-width={stroke}
            class={trackClass}
        />
        <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            stroke-width={stroke}
            stroke-linecap="round"
            stroke-dasharray={circumference}
            stroke-dashoffset={circumference * (1 - progress.current)}
            class={fillClass}
        />
    </svg>
    {#if children}
        <span class="relative">{@render children()}</span>
    {/if}
</span>

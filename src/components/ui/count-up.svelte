<script lang="ts">
    import { Tween } from "svelte/motion";
    import { duration, easing, reducedMotion } from "@/utils/motion";

    /** Animated number (stats, amounts). Jumps straight to the value under reduced motion. */
    interface Props {
        value: number;
        /** Formatter for the displayed value (default: en-US grouping, e.g. 97,000). */
        format?: (n: number) => string;
        class?: string;
    }

    const { value, format = (n) => Math.round(n).toLocaleString("en-US"), class: className = "" }: Props = $props();

    const tween = new Tween(0, { duration: duration("hero"), easing: easing("decelerate") });

    $effect(() => {
        tween.set(value, reducedMotion() ? { duration: 0 } : undefined);
    });
</script>

<span class="tabular-nums {className}" aria-label={format(value)}>
    <span aria-hidden="true">{format(tween.current)}</span>
</span>

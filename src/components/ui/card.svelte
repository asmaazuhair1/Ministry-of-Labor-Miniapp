<script lang="ts">
    import type { Snippet } from "svelte";
    import { twMerge } from "@/utils/tw-merge.util";

    type Elevation = "flat" | "e1" | "e2";
    type Tone = "default" | "primary" | "muted";

    interface Props {
        elevation?: Elevation;
        tone?: Tone;
        /** "hero" uses the larger radius for a section's dominant element. */
        radius?: "card" | "hero";
        padding?: "none" | "md" | "lg";
        /** When set, the card renders as a pressable button. */
        onClick?: () => void;
        ariaLabel?: string;
        class?: string;
        children: Snippet;
    }

    const {
        elevation = "e1",
        tone = "default",
        radius = "card",
        padding = "md",
        onClick,
        ariaLabel,
        class: className = "",
        children,
    }: Props = $props();

    const TONE: Record<Tone, string> = {
        default: "bg-surface-container text-on-surface",
        primary: "bg-primary text-on-primary",
        muted: "bg-surface-container-high text-on-surface",
    };
    const ELEVATION: Record<Elevation, string> = {
        flat: "",
        e1: "shadow-e1",
        e2: "shadow-e2",
    };
    const PADDING = { none: "", md: "p-4", lg: "p-5" };

    const classes = $derived(
        twMerge(
            "relative overflow-hidden text-start",
            radius === "hero" ? "rounded-hero" : "rounded-card",
            TONE[tone],
            ELEVATION[elevation],
            PADDING[padding],
            className,
        ),
    );
</script>

{#if onClick}
    <button
        type="button"
        onclick={onClick}
        aria-label={ariaLabel}
        class="pressable block w-full {classes} active:shadow-e1"
    >
        {@render children()}
    </button>
{:else}
    <div class={classes}>
        {@render children()}
    </div>
{/if}

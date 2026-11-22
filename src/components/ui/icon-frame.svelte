<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { twMerge } from "@/utils/tw-merge.util";

    /*
     * Signature Naseej icon frame: a Baghdadi arch (round top, softly squared
     * base) with an inner hairline — the "window" every service looks through.
     */

    type Size = "sm" | "md" | "lg" | "xl";
    type Tone = "primary" | "neutral" | "gold" | "inverse";

    interface Props {
        icon: string;
        size?: Size;
        tone?: Tone;
        /** Unique per element when used for a shared-element view transition. */
        transitionName?: string;
        class?: string;
    }

    const { icon, size = "md", tone = "primary", transitionName, class: className = "" }: Props = $props();

    const SIZE: Record<Size, { box: string; icon: number; inset: string }> = {
        sm: { box: "w-11 h-14", icon: 20, inset: "inset-1" },
        md: { box: "w-14 h-[72px]", icon: 26, inset: "inset-1.5" },
        lg: { box: "w-[72px] h-[92px]", icon: 32, inset: "inset-2" },
        xl: { box: "w-24 h-[120px]", icon: 44, inset: "inset-2.5" },
    };
    const TONE: Record<Tone, { bg: string; line: string; icon: string }> = {
        primary: { bg: "bg-primary-container", line: "border-primary/25", icon: "text-primary" },
        neutral: { bg: "bg-surface-container-high", line: "border-outline", icon: "text-on-surface" },
        gold: { bg: "bg-secondary-container", line: "border-secondary/30", icon: "text-secondary" },
        inverse: { bg: "bg-on-primary/15", line: "border-on-primary/30", icon: "text-on-primary" },
    };

    const s = $derived(SIZE[size]);
    const t = $derived(TONE[tone]);
</script>

<span
    class={twMerge("relative grid place-items-center shrink-0 shape-arch", s.box, t.bg, className)}
    style={transitionName ? `view-transition-name:${transitionName}` : undefined}
    aria-hidden="true"
>
    <span class="absolute {s.inset} shape-arch border {t.line}"></span>
    <AppIcon name={icon} size={s.icon} weight="duotone" class="relative mt-1 {t.icon}" />
</span>

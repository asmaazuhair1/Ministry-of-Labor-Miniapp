<script lang="ts">
    import { haptic } from "@/utils/superqi.util";

    /** Selectable option card with an animated (drawn) checkmark. */
    interface Props {
        label: string;
        fee?: number;
        checked: boolean;
        invalid?: boolean;
        onToggle: () => void;
    }

    const { label, fee, checked, invalid = false, onToggle }: Props = $props();
</script>

<button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onclick={() => {
        haptic("light");
        onToggle();
    }}
    class="pressable w-full flex items-start gap-3 rounded-frame border-2 px-4 py-4 text-start {checked
        ? 'border-primary bg-primary-container/40'
        : invalid
          ? 'border-danger/60 bg-surface-container'
          : 'border-outline-variant bg-surface-container'}"
>
    <span
        class="grid place-items-center w-6 h-6 mt-px shrink-0 rounded-chip border-2 transition-colors duration-[var(--duration-fast)] {checked
            ? 'bg-primary border-primary text-on-primary'
            : 'border-outline text-transparent'}"
    >
        <svg viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" aria-hidden="true">
            <path
                d="M3 8.5 l3 3 l7 -7"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="check {checked ? 'on' : ''}"
            />
        </svg>
    </span>
    <span class="flex-1 min-w-0">
        <span class="block text-label text-on-surface">{label}</span>
        {#if fee}
            <span class="mt-1 block text-caption text-on-surface-variant tabular-nums"
                >+ {fee.toLocaleString("en-US")} د.ع</span
            >
        {/if}
    </span>
</button>

<style>
    .check {
        stroke-dasharray: 16;
        stroke-dashoffset: 16;
        transition: stroke-dashoffset var(--duration-base) var(--ease-decelerate);
    }
    .check.on {
        stroke-dashoffset: 0;
    }
    @media (prefers-reduced-motion: reduce) {
        .check {
            transition: none;
        }
    }
</style>

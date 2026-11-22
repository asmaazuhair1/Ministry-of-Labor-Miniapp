<script lang="ts">
    import { haptic } from "@/utils/superqi.util";

    /** Accessible switch; the knob glides with the spring curve (instant under reduced motion via global CSS). */
    interface Props {
        checked: boolean;
        label: string;
        onChange: (checked: boolean) => void;
    }
    const { checked, label, onChange }: Props = $props();
</script>

<button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onclick={() => {
        haptic("light");
        onChange(!checked);
    }}
    class="relative inline-flex items-center shrink-0 w-[52px] h-8 rounded-pill p-1 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] {checked
        ? 'bg-primary'
        : 'bg-outline'}"
>
    <span
        class="block w-6 h-6 rounded-full bg-surface-container shadow-e1 transition-transform duration-[var(--duration-base)] ease-[var(--ease-spring)] {checked
            ? '-translate-x-5'
            : 'translate-x-0'}"
    ></span>
</button>

<script lang="ts">
    import { Spring } from "svelte/motion";
    import { reducedMotion } from "@/utils/motion";
    import { haptic } from "@/utils/superqi.util";

    /*
     * Scrollable segmented tabs with a gliding pill indicator (Spring on x +
     * width, measured from the active button so it works in RTL and with
     * variable label widths). Each tab is ≥44px tall.
     */
    interface TabItem {
        id: string;
        label: string;
        count?: number;
    }
    interface Props {
        items: TabItem[];
        value: string;
        onChange: (id: string) => void;
        label?: string;
        /** Scroll edge-to-edge past the page gutter (default). Turn off inside cards. */
        bleed?: boolean;
    }

    const { items, value, onChange, label = "التصنيفات", bleed = true }: Props = $props();

    let track = $state<HTMLElement | null>(null);
    const buttons: Record<string, HTMLButtonElement> = {};
    const x = new Spring(0, { stiffness: 0.15, damping: 0.8 });
    const w = new Spring(0, { stiffness: 0.15, damping: 0.8 });
    let placed = false;

    function place() {
        const el = buttons[value];
        if (!el) return;
        const instant = !placed || reducedMotion();
        x.set(el.offsetLeft, { instant });
        w.set(el.offsetWidth, { instant });
        placed = true;
        el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: instant ? "auto" : "smooth" });
    }

    $effect(() => {
        void value;
        void items.length;
        queueMicrotask(place);
    });

    function select(id: string) {
        if (id === value) return;
        haptic("light");
        onChange(id);
    }
</script>

<div
    bind:this={track}
    class="overflow-x-auto no-scrollbar {bleed ? '-mx-gutter px-gutter' : ''}"
    role="tablist"
    aria-label={label}
>
    <div class="relative inline-flex gap-1 rounded-pill bg-surface-container-high p-1">
        <span
            class="absolute top-1 left-0 h-11 rounded-pill bg-surface-container shadow-e1"
            style="width:{w.current}px; transform: translateX({x.current}px)"
            aria-hidden="true"
        ></span>
        {#each items as item (item.id)}
            {@const active = item.id === value}
            <button
                bind:this={buttons[item.id]}
                type="button"
                role="tab"
                aria-selected={active}
                onclick={() => select(item.id)}
                class="relative z-10 inline-flex items-center gap-1.5 h-11 shrink-0 rounded-pill px-4 text-label whitespace-nowrap transition-colors duration-[var(--duration-fast)] {active
                    ? 'text-on-surface'
                    : 'text-on-surface-variant'}"
            >
                {item.label}
                {#if item.count !== undefined}
                    <span
                        class="grid place-items-center min-w-5 h-5 rounded-pill px-1.5 text-caption tabular-nums {active
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface-muted'}">{item.count}</span
                    >
                {/if}
            </button>
        {/each}
    </div>
</div>

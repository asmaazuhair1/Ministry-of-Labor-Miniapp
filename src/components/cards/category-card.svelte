<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { ACCENT_BG } from "@/utils/accent.util";
    import { arabicCountNoun } from "@/utils/format.util";
    import { pop, reducedMotion } from "@/utils/motion";
    import type { ServiceCategory } from "@/types/services";

    /*
     * "Baghdad Gate" category tile: an arch-topped doorway card holding an arch
     * window in the category's brand colour, woven with shanasheel lattice. The
     * emblem pops into the window on entrance; the card presses like a door.
     */
    interface Props {
        category: ServiceCategory;
        /** Total services in the category. */
        total?: number;
        /** Services currently open for applications. */
        available?: number;
        /** Entrance order, for a staggered emblem pop. */
        index?: number;
        onClick: (id: string) => void;
    }

    const { category, total = 0, available = 0, index = 0, onClick }: Props = $props();

    const FORMS: [string, string, string, string] = ["خدمة", "خدمات", "خدمات", "خدمة"];
</script>

<button
    type="button"
    onclick={() => onClick(category.id)}
    class="pressable group relative w-full shape-gate bg-surface-container p-2.5 pb-4 text-center shadow-e1 active:shadow-none"
    style="view-transition-name: category-{category.id}"
    aria-label="{category.title}، {total} {arabicCountNoun(total, FORMS)}"
>
    <!-- Arch window -->
    <span class="relative block h-[140px] overflow-hidden shape-arch {ACCENT_BG[category.accent]}" aria-hidden="true">
        <LatticePattern tile={22} class="absolute inset-0 w-full h-full text-on-primary/[0.12]" />
        <span class="absolute inset-1.5 shape-arch border border-on-primary/25"></span>
        <!-- Ground line the emblem stands on -->
        <span class="absolute inset-x-5 bottom-5 h-px bg-on-primary/30"></span>

        <span class="absolute inset-x-0 bottom-7 flex justify-center">
            <span
                class="grid place-items-center w-16 h-16 rounded-full bg-surface-container shadow-e2 ring-4 ring-on-primary/15 transition-transform duration-[var(--duration-base)] ease-[var(--ease-spring)] group-active:scale-95"
                in:pop|global={{ delay: reducedMotion() ? 0 : 200 + index * 80 }}
            >
                {#if category.logo}
                    <img src={category.logo} alt="" class="w-12 h-12 object-contain" />
                {:else}
                    <AppIcon name={category.icon} size={30} weight="fill" class="text-primary" />
                {/if}
            </span>
        </span>
    </span>

    <!-- Title + meta -->
    <span class="mt-3.5 block px-1 text-headline text-on-surface line-clamp-2 min-h-[42px]">{category.title}</span>
    <span class="mt-2 inline-flex items-center gap-1.5 text-caption text-on-surface-variant" aria-hidden="true">
        <span class="w-1.5 h-1.5 rounded-full {available > 0 ? 'bg-success' : 'bg-outline'}"></span>
        <span class="tabular-nums">{total}</span>
        {arabicCountNoun(total, FORMS)}
        <AppIcon
            name="caret-left"
            size={12}
            weight="bold"
            class="text-primary transition-transform duration-[var(--duration-fast)] group-active:-translate-x-0.5"
        />
    </span>
</button>

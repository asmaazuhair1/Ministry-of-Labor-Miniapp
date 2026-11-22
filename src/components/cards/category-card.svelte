<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { ACCENT_SOFT, ACCENT_TEXT } from "@/utils/accent.util";
    import { arabicCountNoun } from "@/utils/format.util";
    import { pop, reducedMotion } from "@/utils/motion";
    import type { ServiceCategory } from "@/types/services";

    /*
     * "Soft Window" category card — light and calm. A soft-tinted panel in the
     * category's own light shade (with a barely-there shanasheel texture), the
     * emblem resting on the panel's edge in a white circle, then the name and the
     * service count.
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
    class="pressable group flex w-full flex-col rounded-card border border-outline-variant bg-surface-container p-2 pb-4 text-center shadow-e1 active:shadow-none"
    style="view-transition-name: category-{category.id}"
    aria-label="{category.title}، {total} {arabicCountNoun(total, FORMS)}"
>
    <!-- Soft tinted panel -->
    <span class="relative block h-24 overflow-hidden rounded-frame {ACCENT_SOFT[category.accent]}" aria-hidden="true">
        <LatticePattern
            tile={20}
            class="absolute inset-0 w-full h-full {ACCENT_TEXT[category.accent]} opacity-[0.08]"
        />
    </span>

    <!-- Emblem resting on the panel's edge -->
    <span class="relative -mt-8 flex justify-center" aria-hidden="true">
        <span
            class="grid place-items-center w-16 h-16 rounded-full bg-surface-container shadow-e2 ring-4 ring-surface-container transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)] group-active:scale-95"
            in:pop|global={{ delay: reducedMotion() ? 0 : 160 + index * 80 }}
        >
            {#if category.logo}
                <img src={category.logo} alt="" class="w-12 h-12 object-contain" />
            {:else}
                <AppIcon name={category.icon} size={28} weight="fill" class={ACCENT_TEXT[category.accent]} />
            {/if}
        </span>
    </span>

    <!-- Name + service count -->
    <span class="mt-3 block px-1 text-headline text-on-surface line-clamp-2 min-h-[48px]">{category.title}</span>
    <span
        class="mt-2 inline-flex items-center justify-center gap-1 text-caption text-on-surface-variant"
        aria-hidden="true"
    >
        <span class="h-1.5 w-1.5 rounded-full {available > 0 ? 'bg-success' : 'bg-outline'}"></span>
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

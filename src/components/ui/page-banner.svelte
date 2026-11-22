<script lang="ts">
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import CountUp from "@/components/ui/count-up.svelte";
    import { rise } from "@/utils/motion";

    /*
     * "Service Board" page banner — a deep-teal, full-width notice board with a faint
     * shanasheel lattice: a large live count beside its label, and a one-line summary
     * under it. Shared by the services, requests and news pages.
     *
     * Full-bleed: it breaks out of the page's `px-gutter pt-5` container with matching
     * negative margins, so it touches both screen edges and sits flush under the app
     * header; its own `px-gutter` keeps the text on the same start edge as the cards
     * below. Straight top edge, soft radius on the bottom corners only.
     */
    interface Props {
        /** The headline number (counts up on load). */
        count: number;
        /** Text beside the number, e.g. «خدمات متاحة الآن». */
        title: string;
        /** One-line summary under the headline. */
        summary?: string;
        /** Full sentence for screen readers. */
        label?: string;
        loading?: boolean;
    }
    const { count, title, summary, label, loading = false }: Props = $props();
</script>

<section
    class="relative -mx-gutter -mt-5 overflow-hidden rounded-b-card bg-primary px-gutter pt-4 pb-5 text-on-primary shadow-e2"
    in:rise
>
    <LatticePattern
        tile={22}
        class="pointer-events-none absolute inset-0 w-full h-full text-on-primary opacity-[0.08]"
    />
    <div class="relative" aria-hidden={label ? "true" : undefined}>
        <p class="flex items-end gap-2">
            <span class="text-display leading-none tabular-nums">
                {#if loading}0{:else}<CountUp value={count} />{/if}
            </span>
            <span class="pb-1 text-headline">{title}</span>
        </p>
        {#if summary}
            <span class="mt-1.5 block text-caption opacity-85">{summary}</span>
        {/if}
    </div>
    {#if label}<span class="sr-only">{label}</span>{/if}
</section>

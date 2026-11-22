<script lang="ts">
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { rise } from "@/utils/motion";

    /*
     * "Service Board" page banner — a deep-teal, full-width notice board with a faint
     * shanasheel lattice: the page title (its closing word picked out in soft gold) and
     * a short description under it. Shared by the services, requests and news pages.
     *
     * Full-bleed: it breaks out of the page's `px-gutter pt-5` container with matching
     * negative margins, so it touches both screen edges and sits flush under the app
     * header; its own `px-gutter` keeps the text on the same start edge as the cards
     * below. Straight top edge, soft radius on the bottom corners only.
     */
    interface Props {
        /** Leading part of the title, e.g. «الخدمات». */
        title: string;
        /** Highlighted closing word(s) of the title, e.g. «الإلكترونية». */
        accent?: string;
        /** One or two lines describing the page. */
        description?: string;
    }
    const { title, accent, description }: Props = $props();
</script>

<section
    class="relative -mx-gutter -mt-5 overflow-hidden rounded-b-card bg-primary px-gutter pt-4 pb-5 text-on-primary shadow-e2"
    in:rise
>
    <LatticePattern
        tile={22}
        class="pointer-events-none absolute inset-0 w-full h-full text-on-primary opacity-[0.08]"
    />
    <div class="relative">
        <h2 class="text-title-2">
            {title}
            {#if accent}<span class="text-secondary-container">{accent}</span>{/if}
        </h2>
        {#if description}
            <p class="mt-1.5 text-body opacity-90">{description}</p>
        {/if}
    </div>
</section>

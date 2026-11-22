<script lang="ts">
    import { twMerge } from "@/utils/tw-merge.util";

    /*
     * Woven threads — over/under bands for "work, hands, community".
     * Decorative only; colour from `currentColor` (default --color-pattern).
     */
    interface Props {
        tile?: number;
        class?: string;
    }
    const { tile = 24, class: className = "" }: Props = $props();
    const id = $props.id();
</script>

<svg class={twMerge("pointer-events-none text-pattern", className)} aria-hidden="true" focusable="false">
    <defs>
        <pattern id="weave-{id}" width={tile} height={tile} patternUnits="userSpaceOnUse" viewBox="0 0 24 24">
            <g fill="currentColor">
                <!-- warp (vertical) over, weft (horizontal) under, alternating -->
                <rect x="1" y="1" width="10" height="4" rx="2" />
                <rect x="13" y="7" width="10" height="4" rx="2" />
                <rect x="1" y="13" width="10" height="4" rx="2" />
                <rect x="13" y="19" width="10" height="4" rx="2" />
                <rect x="14" y="0" width="4" height="5" rx="2" opacity="0.6" />
                <rect x="6" y="6" width="4" height="6" rx="2" opacity="0.6" />
                <rect x="14" y="12" width="4" height="6" rx="2" opacity="0.6" />
                <rect x="6" y="18" width="4" height="6" rx="2" opacity="0.6" />
            </g>
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#weave-{id})" />
</svg>

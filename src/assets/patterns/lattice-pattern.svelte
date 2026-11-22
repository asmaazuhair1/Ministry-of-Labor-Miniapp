<script lang="ts">
    import { twMerge } from "@/utils/tw-merge.util";

    /*
     * Shanasheel lattice — the carved wooden window screens of old Baghdad,
     * reduced to interlocking eight-point stars and diamonds. Decorative only;
     * colour comes from `currentColor` (default: the --color-pattern token).
     */
    interface Props {
        /** Tile size in px. */
        tile?: number;
        class?: string;
    }
    const { tile = 40, class: className = "" }: Props = $props();
    const id = $props.id();
</script>

<svg class={twMerge("pointer-events-none text-pattern", className)} aria-hidden="true" focusable="false">
    <defs>
        <pattern id="lattice-{id}" width={tile} height={tile} patternUnits="userSpaceOnUse" viewBox="0 0 40 40">
            <g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
                <!-- eight-point star = two overlapping squares -->
                <rect x="12" y="12" width="16" height="16" />
                <rect x="12" y="12" width="16" height="16" transform="rotate(45 20 20)" />
                <!-- diamonds bridging to neighbours -->
                <path
                    d="M20 0 L24 4 L20 8 L16 4 Z M20 32 L24 36 L20 40 L16 36 Z M0 20 L4 16 L8 20 L4 24 Z M32 20 L36 16 L40 20 L36 24 Z"
                />
                <circle cx="20" cy="20" r="2.5" />
            </g>
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lattice-{id})" />
</svg>

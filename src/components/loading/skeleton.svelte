<script lang="ts">
    import { twMerge } from "@/utils/tw-merge.util";

    /*
     * Calm shimmer placeholder. Give it the exact size/shape of the real
     * element (same classes) so nothing shifts when content arrives.
     */
    interface Props {
        shape?: "rect" | "arch" | "pill" | "circle";
        class?: string;
    }
    const { shape = "rect", class: className = "" }: Props = $props();

    const SHAPE = {
        rect: "rounded-xl",
        arch: "shape-arch",
        pill: "rounded-pill",
        circle: "rounded-full",
    };
</script>

<div class={twMerge("relative overflow-hidden bg-surface-container-high", SHAPE[shape], className)} aria-hidden="true">
    <span
        class="absolute inset-0 flex justify-center motion-safe:animate-[shimmer_1.6s_var(--ease-standard)_infinite] motion-reduce:hidden"
    >
        <span class="h-full w-1/3 bg-surface-container/50"></span>
    </span>
</div>

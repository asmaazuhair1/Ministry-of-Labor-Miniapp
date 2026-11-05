<script lang="ts">
    import type { Snippet } from "svelte";
    import { twMerge } from "@/utils/tw-merge.util";

    interface Props {
        top?: boolean;
        bottom?: boolean;
        class?: string;
        children: Snippet;
    }

    const { top = false, bottom = false, class: className = "", children }: Props = $props();
</script>

<div
    class={twMerge(className)}
    style:padding-top={top ? "env(safe-area-inset-top)" : undefined}
    style:padding-bottom={bottom ? "env(safe-area-inset-bottom)" : undefined}
>
    {@render children()}
</div>

<script lang="ts">
    import { twMerge } from "@/utils/tw-merge.util";
    interface Props {
        class?: string;
    }
    const { class: className = "" }: Props = $props();
</script>

<div class={twMerge("animate-pulse rounded-xl bg-surface-container-high", className)}></div>

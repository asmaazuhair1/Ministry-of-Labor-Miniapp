<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import WeavePattern from "@/assets/patterns/weave-pattern.svelte";
    import { pop } from "@/utils/motion";

    /** Empty-state illustration: an arch window with woven threads and a floating icon. */
    interface Props {
        icon?: string;
        size?: number;
    }
    const { icon = "magnifying-glass", size = 132 }: Props = $props();
</script>

<span class="relative inline-grid place-items-center" style="width:{size}px;height:{size * 1.15}px" aria-hidden="true">
    <span class="absolute inset-0 shape-arch bg-primary-container overflow-hidden">
        <WeavePattern tile={18} class="absolute inset-0 w-full h-full text-primary/15" />
    </span>
    <span class="absolute inset-3 shape-arch border border-primary/25"></span>
    <span
        class="relative grid place-items-center w-14 h-14 rounded-full bg-surface-container text-primary shadow-e2"
        in:pop={{ delay: 150 }}
    >
        <AppIcon name={icon} size={26} weight="bold" />
    </span>
</span>

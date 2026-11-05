<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { STATUS_DEFINITIONS, STATUS_TOKEN_BG, STATUS_TOKEN_TEXT } from "@/config/status.config";
    import type { RequestStatus } from "@/types/requests";

    interface Props {
        status: RequestStatus;
        size?: "sm" | "md";
    }

    const { status, size = "md" }: Props = $props();

    const def = $derived(STATUS_DEFINITIONS[status]);
    const padding = $derived(size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs");
    const iconSize = $derived(size === "sm" ? 13 : 15);
</script>

<span
    class="inline-flex items-center gap-1.5 rounded-full font-bold {padding} {STATUS_TOKEN_BG[
        def.token
    ]} {STATUS_TOKEN_TEXT[def.token]}"
>
    <AppIcon name={def.icon} size={iconSize} weight="fill" />
    {def.label}
</span>

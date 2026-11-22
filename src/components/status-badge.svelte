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
    const padding = $derived(size === "sm" ? "h-7 px-2.5" : "h-8 px-3");
</script>

<span
    class="inline-flex items-center gap-1.5 shrink-0 rounded-pill text-caption font-bold whitespace-nowrap {padding} {STATUS_TOKEN_BG[
        def.token
    ]} {STATUS_TOKEN_TEXT[def.token]}"
>
    <AppIcon name={def.icon} size={14} weight="fill" />
    {def.label}
</span>

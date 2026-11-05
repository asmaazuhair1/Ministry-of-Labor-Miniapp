<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { ACCENT_SOFT, ACCENT_TEXT, type AccentKey } from "@/utils/accent.util";
    import type { ServiceSummary } from "@/types/services";

    interface Props {
        service: ServiceSummary;
        categoryTitle?: string;
        accent?: AccentKey;
        onClick: (id: string) => void;
    }

    const { service, categoryTitle, accent = "primary", onClick }: Props = $props();

    const availabilityLabel: Record<ServiceSummary["availability"], string> = {
        available: "متاحة",
        soon: "قريباً",
        unavailable: "غير متاحة",
    };
    const availabilityClass: Record<ServiceSummary["availability"], string> = {
        available: "bg-success-container text-success",
        soon: "bg-warning-container text-warning",
        unavailable: "bg-surface-container-high text-on-surface-muted",
    };
</script>

<button
    type="button"
    onclick={() => onClick(service.id)}
    class="w-full flex items-center gap-3.5 rounded-card bg-surface-container border border-outline-variant p-3.5 text-start shadow-card active:scale-[0.99] transition"
>
    <span class="grid place-items-center w-12 h-12 shrink-0 rounded-2xl {ACCENT_SOFT[accent]}">
        <AppIcon name={service.icon} size={25} weight="fill" class={ACCENT_TEXT[accent]} />
    </span>

    <span class="flex-1 min-w-0">
        <span class="flex items-center gap-2">
            <span class="flex-1 text-sm font-extrabold text-on-surface truncate">{service.title}</span>
            <span
                class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold {availabilityClass[
                    service.availability
                ]}"
            >
                {availabilityLabel[service.availability]}
            </span>
        </span>
        <span class="mt-0.5 block text-xs leading-snug text-on-surface-variant line-clamp-2">{service.description}</span
        >
        {#if categoryTitle}
            <span class="mt-1.5 inline-flex items-center gap-1 text-[11px] text-on-surface-muted">
                <AppIcon name="dots" size={12} />
                {categoryTitle}
            </span>
        {/if}
    </span>

    <AppIcon name="caret-left" size={18} class="shrink-0 text-on-surface-muted" />
</button>

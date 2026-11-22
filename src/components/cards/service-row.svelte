<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import type { ServiceSummary } from "@/types/services";

    /** One service as a tappable row: arch icon, title, short description, availability. */
    interface Props {
        service: ServiceSummary;
        categoryTitle?: string;
        onClick: (id: string) => void;
    }
    const { service, categoryTitle, onClick }: Props = $props();

    const closed = $derived(service.availability !== "available");
    const badge = $derived(service.availability === "soon" ? "قريباً" : "منتهية");
</script>

<button
    type="button"
    onclick={() => onClick(service.id)}
    class="pressable w-full flex items-center gap-4 rounded-card bg-surface-container p-4 text-start shadow-e1 active:shadow-none"
>
    <IconFrame
        icon={service.icon}
        size="md"
        tone={closed ? "neutral" : "primary"}
        transitionName="service-icon-{service.id}"
    />
    <span class="min-w-0 flex-1">
        <span class="flex items-center gap-2">
            <span class="text-headline line-clamp-1 {closed ? 'text-on-surface-variant' : 'text-on-surface'}"
                >{service.title}</span
            >
            {#if closed}
                <span
                    class="shrink-0 rounded-pill bg-surface-container-high px-2.5 py-0.5 text-caption text-on-surface-muted"
                    >{badge}</span
                >
            {/if}
        </span>
        <span class="mt-1 text-caption text-on-surface-variant line-clamp-2">{service.description}</span>
        {#if categoryTitle}
            <span class="mt-2 inline-flex items-center gap-1 text-caption text-primary">
                <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                {categoryTitle}
            </span>
        {/if}
    </span>
    <AppIcon name="caret-left" size={18} class="shrink-0 text-on-surface-muted" />
</button>

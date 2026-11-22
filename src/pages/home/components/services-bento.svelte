<script lang="ts">
    import { go } from "@/utils/navigation";
    import AppIcon from "@/components/app-icon.svelte";
    import { BASE_FEE } from "@/config/demo/application-form.demo";
    import { reducedMotion, rise, stagger } from "@/utils/motion";
    import type { ServiceSummary } from "@/types/services";

    /*
     * Home services — modern, light rows (same language as the "Soft Window"
     * categories): a soft-tinted icon tile, title + one-line description, fee and
     * status chips, and a round arrow. Available services first; the top one
     * carries a quiet "most requested" tag. Closed services are dimmed.
     */
    interface Props {
        services: ServiceSummary[];
    }
    const { services }: Props = $props();

    const ranked = $derived(
        services.slice().sort((a, b) => {
            const avail = Number(b.availability === "available") - Number(a.availability === "available");
            return avail || b.popularity - a.popularity;
        }),
    );

    const open = (id: string) => go(`/services/${id}`);
</script>

<ul class="flex flex-col gap-3">
    {#each ranked as service, i (service.id)}
        {@const closed = service.availability !== "available"}
        <li in:rise|global={{ delay: reducedMotion() ? 0 : stagger(i) }}>
            <button
                type="button"
                onclick={() => open(service.id)}
                aria-label={service.title}
                class="pressable group relative flex w-full items-center gap-3.5 rounded-card border border-outline-variant bg-surface-container p-3.5 text-start shadow-e1 active:shadow-none"
            >
                {#if i === 0 && !closed}
                    <span
                        class="absolute -top-2.5 end-4 rounded-pill bg-primary px-2.5 py-0.5 text-caption font-bold text-on-primary shadow-e1"
                    >
                        الأكثر طلباً
                    </span>
                {/if}

                <!-- Soft icon tile -->
                <span
                    class="grid w-14 h-14 shrink-0 place-items-center rounded-frame {closed
                        ? 'bg-surface-container-high text-on-surface-muted'
                        : 'bg-primary-container text-primary'}"
                    style="view-transition-name: service-icon-{service.id}"
                    aria-hidden="true"
                >
                    <AppIcon name={service.icon} size={26} weight="duotone" />
                </span>

                <!-- Title, description, chips -->
                <span class="min-w-0 flex-1">
                    <span class="text-headline line-clamp-1 {closed ? 'text-on-surface-variant' : 'text-on-surface'}"
                        >{service.title}</span
                    >
                    <span class="mt-0.5 text-caption text-on-surface-variant line-clamp-1">{service.description}</span>
                    <span class="mt-2 flex flex-wrap items-center gap-1.5">
                        {#if closed}
                            <span
                                class="rounded-pill bg-surface-container-high px-2 py-0.5 text-caption text-on-surface-variant"
                            >
                                {service.availability === "soon" ? "قريباً" : "منتهية"}
                            </span>
                        {:else}
                            <span
                                class="inline-flex items-center gap-1 rounded-pill bg-surface-container-high px-2 py-0.5 text-caption text-on-surface tabular-nums"
                            >
                                <AppIcon name="money" size={13} weight="fill" class="text-primary" />
                                {BASE_FEE.toLocaleString("en-US")} د.ع
                            </span>
                            <span
                                class="inline-flex items-center gap-1 rounded-pill bg-success-container px-2 py-0.5 text-caption text-success"
                            >
                                <span class="h-1.5 w-1.5 rounded-full bg-success"></span>
                                متاحة
                            </span>
                        {/if}
                    </span>
                </span>

                <!-- Round arrow -->
                <span
                    class="grid w-9 h-9 shrink-0 place-items-center rounded-full transition-colors duration-[var(--duration-fast)] {closed
                        ? 'bg-surface-container-high text-on-surface-muted'
                        : 'bg-primary-container text-primary group-active:bg-primary group-active:text-on-primary'}"
                    aria-hidden="true"
                >
                    <AppIcon name="caret-left" size={16} weight="bold" />
                </span>
            </button>
        </li>
    {/each}
</ul>

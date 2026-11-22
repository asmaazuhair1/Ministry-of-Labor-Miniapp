<script lang="ts">
    import { go } from "@/utils/navigation";
    import AppIcon from "@/components/app-icon.svelte";
    import { BASE_FEE } from "@/config/demo/application-form.demo";
    import { reducedMotion, rise, stagger } from "@/utils/motion";
    import type { ServiceCategory, ServiceSummary } from "@/types/services";

    /*
     * Home services — cards that read as government services, not offers: the
     * service icon, title and description, then a footer
     * with the owning category, the service fee and a clear "apply now" action.
     * Available services first; closed ones are dimmed and say so instead of
     * offering the action.
     */
    interface Props {
        services: ServiceSummary[];
        /** Optional: used to show which category each service belongs to. */
        categories?: ServiceCategory[];
    }
    const { services, categories = [] }: Props = $props();

    const ranked = $derived(
        services.slice().sort((a, b) => {
            const avail = Number(b.availability === "available") - Number(a.availability === "available");
            return avail || b.popularity - a.popularity;
        }),
    );
    const categoryTitle = (id: string) => categories.find((c) => c.id === id)?.title;

    const open = (id: string) => go(`/services/${id}`);
</script>

<ul class="flex flex-col gap-3">
    {#each ranked as service, i (service.id)}
        {@const closed = service.availability !== "available"}
        {@const category = categoryTitle(service.categoryId)}
        <li in:rise|global={{ delay: reducedMotion() ? 0 : stagger(i) }}>
            <button
                type="button"
                onclick={() => open(service.id)}
                aria-label={closed ? `${service.title}، الخدمة متوقفة حالياً` : `${service.title}، قدّم الآن`}
                class="pressable group w-full rounded-card border border-outline-variant bg-surface-container text-start shadow-e1 active:shadow-none"
            >
                <!-- Service identity -->
                <span class="flex items-start gap-3.5 p-4">
                    <span
                        class="grid w-12 h-12 shrink-0 place-items-center rounded-frame {closed
                            ? 'bg-surface-container-high text-on-surface-muted'
                            : 'bg-primary-container text-primary'}"
                        style="view-transition-name: service-icon-{service.id}"
                        aria-hidden="true"
                    >
                        <AppIcon name={service.icon} size={24} weight="duotone" />
                    </span>
                    <span class="min-w-0 flex-1">
                        <span
                            class="text-headline line-clamp-2 {closed ? 'text-on-surface-variant' : 'text-on-surface'}"
                            >{service.title}</span
                        >
                        <span class="mt-1 text-caption text-on-surface-variant line-clamp-2">{service.description}</span
                        >
                    </span>
                </span>

                <!-- Footer: category · fee · action -->
                <span
                    class="flex items-center gap-3 border-t border-outline-variant px-4 py-3 {closed
                        ? ''
                        : 'bg-surface-container-high/40'} rounded-b-card"
                    aria-hidden="true"
                >
                    <span class="min-w-0 flex-1">
                        {#if category}
                            <span class="flex items-center gap-1 text-caption text-on-surface-variant">
                                <AppIcon name="tag" size={12} weight="fill" class="shrink-0 text-primary" />
                                <span class="truncate">{category}</span>
                            </span>
                        {/if}
                        {#if !closed}
                            <span class="mt-0.5 block text-label text-on-surface tabular-nums"
                                >رسوم الخدمة {BASE_FEE.toLocaleString("en-US")} د.ع</span
                            >
                        {/if}
                    </span>
                    {#if closed}
                        <span
                            class="inline-flex items-center gap-1 rounded-pill bg-surface-container-high px-3 py-1.5 text-caption font-bold text-on-surface-variant"
                        >
                            <AppIcon name="hourglass" size={14} />
                            الخدمة متوقفة حالياً
                        </span>
                    {:else}
                        <span
                            class="inline-flex shrink-0 items-center gap-1 rounded-pill bg-primary px-4 py-2 text-label text-on-primary transition-colors duration-[var(--duration-fast)] group-active:bg-primary-hover"
                        >
                            قدّم الآن
                            <AppIcon name="caret-left" size={14} weight="bold" />
                        </span>
                    {/if}
                </span>
            </button>
        </li>
    {/each}
</ul>

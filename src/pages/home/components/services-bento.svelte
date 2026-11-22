<script lang="ts">
    import { go } from "@/utils/navigation";
    import AppIcon from "@/components/app-icon.svelte";
    import Card from "@/components/ui/card.svelte";
    import IconFrame from "@/components/ui/icon-frame.svelte";
    import { BASE_FEE } from "@/config/demo/application-form.demo";
    import { rise, stagger } from "@/utils/motion";
    import type { ServiceSummary } from "@/types/services";

    /*
     * Bento: the most-used available service dominates; the next two stack
     * beside it. Asymmetric on purpose — one clear entry point per section.
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
    const hero = $derived(ranked[0]);
    const side = $derived(ranked.slice(1, 3));

    const open = (id: string) => go(`/services/${id}`);
</script>

{#if hero}
    <div class="grid grid-cols-[1.2fr_1fr] gap-3">
        <div in:rise={{ delay: stagger(0) }}>
            <Card radius="hero" padding="lg" class="h-full" onClick={() => open(hero.id)} ariaLabel={hero.title}>
                <div class="flex h-full flex-col">
                    <IconFrame icon={hero.icon} size="lg" transitionName="service-icon-{hero.id}" />
                    <p class="mt-4 text-headline text-on-surface line-clamp-3">{hero.title}</p>
                    <p class="mt-auto pt-4 text-caption text-on-surface-muted">الرسوم من</p>
                    <p class="text-label text-on-surface tabular-nums">{BASE_FEE.toLocaleString("en-US")} د.ع</p>
                    <span
                        class="mt-3 inline-flex items-center justify-center gap-1 h-11 rounded-pill bg-primary px-4 text-label text-on-primary"
                    >
                        قدّم الآن
                        <AppIcon name="caret-left" size={16} weight="bold" />
                    </span>
                </div>
            </Card>
        </div>

        <div class="flex flex-col gap-3">
            {#each side as service, i (service.id)}
                {@const closed = service.availability !== "available"}
                <div class="flex-1" in:rise={{ delay: stagger(i + 1) }}>
                    <Card padding="md" class="h-full" onClick={() => open(service.id)} ariaLabel={service.title}>
                        <div class="flex h-full flex-col">
                            <div class="flex items-start justify-between gap-2">
                                <IconFrame
                                    icon={service.icon}
                                    size="sm"
                                    tone={closed ? "neutral" : "primary"}
                                    transitionName="service-icon-{service.id}"
                                />
                                {#if closed}
                                    <span
                                        class="rounded-pill bg-surface-container-high px-2.5 py-1 text-caption text-on-surface-muted"
                                    >
                                        {service.availability === "soon" ? "قريباً" : "منتهية"}
                                    </span>
                                {/if}
                            </div>
                            <p
                                class="mt-auto pt-3 text-label line-clamp-2 {closed
                                    ? 'text-on-surface-variant'
                                    : 'text-on-surface'}"
                            >
                                {service.title}
                            </p>
                        </div>
                    </Card>
                </div>
            {/each}
        </div>
    </div>
{/if}

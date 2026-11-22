<script lang="ts">
    import { location } from "svelte-spa-router";
    import { Spring } from "svelte/motion";
    import AppIcon from "@/components/app-icon.svelte";
    import { appConfig } from "@/config/app.config";
    import { reducedMotion } from "@/utils/motion";
    import { goTab } from "@/utils/navigation";
    import { haptic } from "@/utils/superqi.util";

    /*
     * "Light Lantern" dock — a calm, light floating bar. The active tab rests in a
     * soft tinted tile, with a short teal "lantern" line hanging from the dock's
     * top edge above it; tile and lantern glide together on a gentle,
     * non-bouncing spring. Transform/opacity only; instant under reduced motion.
     */
    const items = appConfig.bottomNav;
    /** Inner horizontal padding of the tab row (px-1.5), so end tabs don't hug the rounded ends. */
    const INSET = 6;
    /** Gap between the active tile and its slot edges. */
    const TILE_GAP = 4;

    function isActive(path: string, current: string): boolean {
        if (path === "/") return current === "/";
        return current === path || current.startsWith(`${path}/`);
    }

    const activeIndex = $derived(items.findIndex((item) => isActive(item.path, $location)));

    let width = $state(0);
    const slotW = $derived(width ? (width - INSET * 2) / items.length : 0);
    const x = new Spring(0, { stiffness: 0.12, damping: 0.9 });
    let placed = false;

    $effect(() => {
        if (!slotW || activeIndex < 0) return;
        const slot = document.documentElement.dir === "rtl" ? items.length - 1 - activeIndex : activeIndex;
        x.set(INSET + slot * slotW, { instant: !placed || reducedMotion() });
        placed = true;
    });

    function navigate(path: string) {
        if ($location === path) return;
        haptic("light");
        goTab(path);
    }
</script>

<!--
    Spacing: side margin = 6px so the dock spans almost edge to edge; bottom margin is
    12px OR the device safe area, whichever is larger — never both stacked.
-->
<div class="fixed bottom-0 inset-x-0 z-30 flex justify-center pointer-events-none [view-transition-name:bottom-nav]">
    <div class="w-full max-w-[480px] px-1.5" style="padding-bottom: max(12px, env(safe-area-inset-bottom))">
        <nav
            class="pointer-events-auto relative h-[68px] overflow-hidden rounded-frame border border-outline-variant bg-surface-container shadow-e3"
            aria-label="التنقل الرئيسي"
        >
            <ul
                class="relative grid h-full px-1.5"
                style="grid-template-columns: repeat({items.length}, minmax(0, 1fr))"
                bind:clientWidth={width}
            >
                {#if activeIndex >= 0 && slotW}
                    <!-- Gliding active tile + lantern line -->
                    <span
                        class="absolute inset-y-0 left-0 pointer-events-none"
                        style="width:{slotW}px; transform: translateX({x.current}px)"
                        aria-hidden="true"
                    >
                        <span class="absolute top-0 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-b-pill bg-primary"
                        ></span>
                        <span
                            class="absolute rounded-frame bg-primary-container"
                            style="inset: 10px {TILE_GAP}px 8px {TILE_GAP}px"
                        ></span>
                    </span>
                {/if}

                {#each items as item, i (item.path)}
                    {@const active = i === activeIndex}
                    <li class="relative">
                        <button
                            type="button"
                            onclick={() => navigate(item.path)}
                            aria-current={active ? "page" : undefined}
                            aria-label={item.label}
                            class="group relative w-full h-full flex flex-col items-center justify-center gap-0.5 pt-1"
                        >
                            <span
                                class="grid place-items-center h-7 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-active:scale-90"
                            >
                                <AppIcon
                                    name={item.icon}
                                    size={22}
                                    weight={active ? "fill" : "regular"}
                                    class="transition-colors duration-[var(--duration-fast)] {active
                                        ? 'text-primary'
                                        : 'text-on-surface-variant'}"
                                />
                            </span>
                            <span
                                class="text-caption leading-4 whitespace-nowrap transition-colors duration-[var(--duration-fast)] {active
                                    ? 'font-bold text-primary'
                                    : 'text-on-surface-variant'}"
                                aria-hidden="true"
                            >
                                {item.label}
                            </span>
                        </button>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</div>

<script lang="ts">
    import { location } from "svelte-spa-router";
    import { Spring } from "svelte/motion";
    import AppIcon from "@/components/app-icon.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { appConfig } from "@/config/app.config";
    import { reducedMotion } from "@/utils/motion";
    import { goTab } from "@/utils/navigation";
    import { haptic } from "@/utils/superqi.util";

    /*
     * "Arch Dock" — a floating ink dock. The active tab's icon lifts into a teal
     * Baghdadi arch that rises out of the dock and glides between tabs on a
     * spring. Transform/opacity only; instant under reduced motion.
     */
    const items = appConfig.bottomNav;
    const ARCH_W = 48;
    /** Inner horizontal padding of the tab row (px-1.5), so end tabs don't hug the rounded ends. */
    const INSET = 6;

    function isActive(path: string, current: string): boolean {
        if (path === "/") return current === "/";
        return current === path || current.startsWith(`${path}/`);
    }

    const activeIndex = $derived(items.findIndex((item) => isActive(item.path, $location)));

    let width = $state(0);
    const x = new Spring(0, { stiffness: 0.12, damping: 0.62 });
    let placed = false;

    $effect(() => {
        if (!width || activeIndex < 0) return;
        const slotW = (width - INSET * 2) / items.length;
        const slot = document.documentElement.dir === "rtl" ? items.length - 1 - activeIndex : activeIndex;
        x.set(INSET + slot * slotW + (slotW - ARCH_W) / 2, { instant: !placed || reducedMotion() });
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
            class="pointer-events-auto relative h-[68px] rounded-frame bg-on-surface shadow-e3"
            aria-label="التنقل الرئيسي"
        >
            <!-- Subtle lattice woven into the dock -->
            <span class="absolute inset-0 overflow-hidden rounded-frame" aria-hidden="true">
                <LatticePattern tile={28} class="absolute inset-0 w-full h-full text-surface-container/[0.05]" />
            </span>

            <ul
                class="relative grid h-full px-1.5"
                style="grid-template-columns: repeat({items.length}, minmax(0, 1fr))"
                bind:clientWidth={width}
            >
                <!-- The arch "lamp" that rises out of the dock -->
                {#if activeIndex >= 0 && width}
                    <span
                        class="absolute -top-5 left-0 h-[54px] shape-arch bg-primary ring-[5px] ring-surface"
                        style="width:{ARCH_W}px; transform: translateX({x.current}px)"
                        aria-hidden="true"
                    >
                        <span class="absolute inset-1 shape-arch border border-on-primary/30"></span>
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
                            class="group relative w-full h-full flex flex-col items-center justify-center gap-1"
                        >
                            <span
                                class="grid place-items-center h-7 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-spring)] group-active:scale-90 {active
                                    ? '-translate-y-[18px]'
                                    : 'translate-y-0'}"
                            >
                                <AppIcon
                                    name={item.icon}
                                    size={24}
                                    weight={active ? "fill" : "regular"}
                                    class="transition-colors duration-[var(--duration-fast)] {active
                                        ? 'text-on-primary'
                                        : 'text-surface-container/55'}"
                                />
                            </span>
                            <span
                                class="text-caption leading-4 whitespace-nowrap transition-colors duration-[var(--duration-fast)] {active
                                    ? 'font-bold text-surface-container'
                                    : 'text-surface-container/55'}"
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

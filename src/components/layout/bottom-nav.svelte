<script lang="ts">
    import { location } from "svelte-spa-router";
    import { Spring } from "svelte/motion";
    import AppIcon from "@/components/app-icon.svelte";
    import { appConfig } from "@/config/app.config";
    import { reducedMotion } from "@/utils/motion";
    import { goTab } from "@/utils/navigation";
    import { haptic } from "@/utils/superqi.util";

    /*
     * "Teal Drop" dock — a light, white floating bar. A teal drop sits behind the
     * active icon and travels to the next tab on a spring: it stretches sideways while
     * it moves (squash-and-stretch, scaled by the distance still to cover) and settles
     * back into a circle on arrival, where the icon pops in white and the label turns
     * teal. Transform/opacity only; instant under reduced motion.
     */
    const items = appConfig.bottomNav;
    /** Inner horizontal padding of the tab row (px-1.5). */
    const INSET = 6;
    /** Drop diameter. */
    const DROP = 40;

    function isActive(path: string, current: string): boolean {
        if (path === "/") return current === "/";
        return current === path || current.startsWith(`${path}/`);
    }

    const activeIndex = $derived(items.findIndex((item) => isActive(item.path, $location)));

    let width = $state(0);
    const slotW = $derived(width ? (width - INSET * 2) / items.length : 0);
    const x = new Spring(0, { stiffness: 0.14, damping: 0.62 });
    let placed = false;

    $effect(() => {
        if (!slotW || activeIndex < 0) return;
        const slot = document.documentElement.dir === "rtl" ? items.length - 1 - activeIndex : activeIndex;
        x.set(INSET + slot * slotW + (slotW - DROP) / 2, { instant: !placed || reducedMotion() });
        placed = true;
    });

    // Stretch while travelling: up to 1.7× wide, never squashed below 0.8× tall.
    const stretch = $derived(slotW ? Math.min(Math.abs(x.target - x.current) / slotW, 1) : 0);

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
            class="pointer-events-auto relative h-[74px] rounded-frame border border-outline-variant bg-surface-container shadow-e3"
            aria-label="التنقل الرئيسي"
        >
            <ul
                class="relative grid h-full px-1.5"
                style="grid-template-columns: repeat({items.length}, minmax(0, 1fr))"
                bind:clientWidth={width}
            >
                {#if activeIndex >= 0 && slotW}
                    <!-- Travelling teal drop -->
                    <span
                        class="absolute top-[7px] left-0 rounded-full bg-primary shadow-e2 pointer-events-none"
                        style="width:{DROP}px; height:{DROP}px; transform: translateX({x.current}px) scale({1 +
                            stretch * 0.7}, {1 - stretch * 0.2})"
                        aria-hidden="true"
                    ></span>
                {/if}

                {#each items as item, i (item.path)}
                    {@const active = i === activeIndex}
                    <li class="relative">
                        <button
                            type="button"
                            onclick={() => navigate(item.path)}
                            aria-current={active ? "page" : undefined}
                            aria-label={item.label}
                            class="group relative flex w-full h-full flex-col items-center pt-[7px]"
                        >
                            <span class="grid h-10 w-10 place-items-center">
                                <span
                                    class="grid place-items-center transition-colors duration-[var(--duration-fast)] group-active:scale-90 {active
                                        ? 'icon-pop text-on-primary'
                                        : 'text-on-surface-variant'}"
                                >
                                    <AppIcon name={item.icon} size={22} weight={active ? "fill" : "regular"} />
                                </span>
                            </span>
                            <span
                                class="mt-0.5 text-caption leading-4 whitespace-nowrap transition-colors duration-[var(--duration-fast)] {active
                                    ? 'font-bold text-primary'
                                    : 'text-on-surface-variant'}"
                                aria-hidden="true">{item.label}</span
                            >
                        </button>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</div>

<style>
    /* The active icon pops in as the drop arrives under it. */
    .icon-pop {
        animation: pop var(--duration-slow) var(--ease-spring) 120ms both;
    }
    @keyframes pop {
        0% {
            transform: scale(0.6) translateY(4px);
            opacity: 0.4;
        }
        60% {
            transform: scale(1.15) translateY(-1px);
            opacity: 1;
        }
        100% {
            transform: none;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .icon-pop {
            animation: none;
        }
    }
</style>

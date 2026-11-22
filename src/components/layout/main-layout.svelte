<script lang="ts">
    import Router, { location } from "svelte-spa-router";
    import AppHeader from "@/components/layout/app-header.svelte";
    import BottomNav from "@/components/layout/bottom-nav.svelte";
    import Alert from "@/components/alert.svelte";
    import SplashScreen from "@/components/layout/splash-screen.svelte";
    import { buildRouteMap, getLayoutForRoute } from "@/config/routes.utils";
    import { fadeIn, pageSlide } from "@/utils/motion";
    import { navDirection, supportsViewTransitions } from "@/utils/navigation";

    const routeMap = buildRouteMap();

    // Splash plays once per session (the app loads underneath meanwhile).
    const SPLASH_KEY = "mol-splash-seen";
    let showSplash = $state(typeof sessionStorage !== "undefined" && !sessionStorage.getItem(SPLASH_KEY));
    function splashDone() {
        sessionStorage.setItem(SPLASH_KEY, "1");
        showSplash = false;
    }
    const layout = $derived(getLayoutForRoute($location));

    // View Transitions handle page motion where supported; Svelte transitions otherwise.
    const useFallback = !supportsViewTransitions();

    function pageIn(node: Element) {
        if ($navDirection === "tab") return fadeIn(node);
        return pageSlide(node, { direction: $navDirection === "back" ? "back" : "forward" });
    }

    // Reset scroll to the top of the viewport whenever the route changes.
    let main = $state<HTMLElement | null>(null);
    $effect(() => {
        void $location;
        main?.scrollTo({ top: 0 });
        window.scrollTo({ top: 0 });
    });
</script>

<div class="app-viewport flex flex-col min-h-screen">
    {#if layout.showLayout}
        <AppHeader {layout} />
    {/if}

    <main
        bind:this={main}
        class="flex-1"
        style:padding-bottom={layout.showBottomNav
            ? "calc(7rem + max(12px, env(safe-area-inset-bottom)) - 12px)"
            : "2rem"}
    >
        {#if useFallback}
            {#key $location}
                <div in:pageIn>
                    <Router routes={routeMap} />
                </div>
            {/key}
        {:else}
            <Router routes={routeMap} />
        {/if}
    </main>

    {#if layout.showBottomNav}
        <BottomNav />
    {/if}
</div>

<Alert />

{#if showSplash}
    <SplashScreen onDone={splashDone} />
{/if}

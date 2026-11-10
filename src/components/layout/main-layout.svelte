<script lang="ts">
    import Router, { location } from "svelte-spa-router";
    import AppHeader from "@/components/layout/app-header.svelte";
    import BottomNav from "@/components/layout/bottom-nav.svelte";
    import Alert from "@/components/alert.svelte";
    import { buildRouteMap, getLayoutForRoute } from "@/config/routes.utils";

    const routeMap = buildRouteMap();
    const layout = $derived(getLayoutForRoute($location));

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

    <main bind:this={main} class="flex-1 {layout.showBottomNav ? 'pb-24' : 'pb-8'}">
        <Router routes={routeMap} />
    </main>

    {#if layout.showBottomNav}
        <BottomNav />
    {/if}
</div>

<Alert />

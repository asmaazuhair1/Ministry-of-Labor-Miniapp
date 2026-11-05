<script lang="ts">
    import { location, push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import SafeArea from "@/components/safe-area.svelte";
    import { appConfig } from "@/config/app.config";

    function isActive(path: string, current: string): boolean {
        if (path === "/") return current === "/";
        return current === path || current.startsWith(`${path}/`);
    }

    function navigate(path: string) {
        if ($location !== path) push(path);
    }
</script>

<SafeArea bottom class="fixed bottom-0 inset-x-0 z-30 flex justify-center pointer-events-none">
    <nav
        class="pointer-events-auto w-full max-w-[480px] bg-surface-container border-t border-outline-variant shadow-soft"
        aria-label="التنقل الرئيسي"
    >
        <ul class="grid grid-cols-4">
            {#each appConfig.bottomNav as item (item.path)}
                {@const active = isActive(item.path, $location)}
                <li>
                    <button
                        type="button"
                        onclick={() => navigate(item.path)}
                        aria-current={active ? "page" : undefined}
                        class="relative w-full flex flex-col items-center gap-1 py-2.5 transition-colors"
                    >
                        {#if active}
                            <span class="absolute top-0 h-0.5 w-10 rounded-full bg-primary"></span>
                        {/if}
                        <AppIcon
                            name={item.icon}
                            size={25}
                            weight={active ? "fill" : "regular"}
                            class={active ? "text-primary" : "text-on-surface-variant"}
                        />
                        <span class="text-[11px] font-bold {active ? 'text-primary' : 'text-on-surface-variant'}">
                            {item.label}
                        </span>
                    </button>
                </li>
            {/each}
        </ul>
    </nav>
</SafeArea>

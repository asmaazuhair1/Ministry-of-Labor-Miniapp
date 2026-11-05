<script lang="ts">
    import { pop, push } from "svelte-spa-router";
    import MinistryLogo from "@/assets/ministry-logo.svelte";
    import AppIcon from "@/components/app-icon.svelte";
    import SafeArea from "@/components/safe-area.svelte";
    import { appConfig } from "@/config/app.config";
    import { unreadCount } from "@/store/notifications-state";
    import type { LayoutConfig } from "@/config/routes.config";

    interface Props {
        layout: LayoutConfig;
    }

    const { layout }: Props = $props();

    function goBack() {
        if (window.history.length > 1) {
            pop();
        } else {
            push("/");
        }
    }

    function openNotifications() {
        push("/notifications");
    }
</script>

<SafeArea top class="sticky top-0 z-30 bg-surface-container/95 backdrop-blur-sm">
    <header class="flex items-center gap-3 px-4 py-3 border-b border-outline-variant">
        {#if layout.showBackButton}
            <button
                type="button"
                onclick={goBack}
                aria-label="رجوع"
                class="grid place-items-center w-10 h-10 -ms-1 rounded-full text-on-surface active:bg-surface-container-high transition"
            >
                <AppIcon name="caret-right" size={22} weight="bold" />
            </button>
        {/if}

        {#if layout.showLogo}
            <div class="flex items-center gap-2.5 min-w-0">
                <MinistryLogo size={42} />
                <div class="min-w-0">
                    <p class="text-[13px] font-extrabold leading-tight text-on-surface truncate">
                        {appConfig.metadata.ministryName}
                    </p>
                    <p class="text-[11px] text-on-surface-variant leading-tight">{appConfig.metadata.country}</p>
                </div>
            </div>
        {:else if layout.pageTitle}
            <h1 class="text-base font-extrabold text-on-surface truncate flex-1">{layout.pageTitle}</h1>
        {/if}

        <div class="flex items-center gap-1 ms-auto">
            {#if layout.showBell}
                <button
                    type="button"
                    onclick={openNotifications}
                    aria-label="الإشعارات"
                    class="relative grid place-items-center w-10 h-10 rounded-full text-on-surface active:bg-surface-container-high transition"
                >
                    <AppIcon name="bell" size={22} />
                    {#if $unreadCount > 0}
                        <span
                            class="absolute top-1.5 end-1.5 min-w-[16px] h-4 px-1 grid place-items-center rounded-full bg-danger text-on-primary text-[10px] font-bold"
                        >
                            {$unreadCount}
                        </span>
                    {/if}
                </button>
            {/if}
        </div>
    </header>
</SafeArea>

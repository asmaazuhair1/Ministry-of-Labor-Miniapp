<script lang="ts">
    import { pop, location } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import SafeArea from "@/components/safe-area.svelte";
    import BottomSheet from "@/components/bottom-sheet.svelte";
    import { appSettings } from "@/store/settings-state";
    import { favorites, toggleFavorite } from "@/store/favorites-state";
    import { isSuperQiShell, closeMiniApp } from "@/utils/superqi.util";
    import { twMerge } from "@/utils/tw-merge.util";
    import type { LayoutConfig } from "@/config/routes.config";

    interface Props {
        layout: LayoutConfig;
    }

    const { layout }: Props = $props();

    // Title is driven by the route config; falls back to the ministry name.
    const title = $derived(layout.pageTitle || $appSettings.ministryName);
    const favoriteKey = $derived($location);
    const isFav = $derived($favorites.has(favoriteKey));

    // The host shell already draws its own ✕/⋯ capsule, so only render ours
    // when running standalone (browser / preview).
    const showCapsule = !isSuperQiShell();

    let sheetOpen = $state(false);

    // Shared pressed-state styling for every icon button.
    const pressable =
        "transition active:bg-surface-container motion-safe:active:scale-95 motion-reduce:transition-none";

    function goBack() {
        pop();
    }

    function closeApp() {
        closeMiniApp(() => window.location.replace("#/"));
    }

    function toggleFav() {
        toggleFavorite(favoriteKey);
    }

    async function shareLink() {
        sheetOpen = false;
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title, url });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
            }
        } catch {
            // user dismissed the share sheet — no-op
        }
    }

    function reload() {
        sheetOpen = false;
        window.location.reload();
    }
</script>

<SafeArea top class="sticky top-0 z-30 bg-surface border-b border-outline-variant">
    <header class="flex items-center gap-1 h-16 ps-4 pe-4">
        <!-- START side (right in RTL): back arrow always visible -->
        <button
            type="button"
            onclick={layout.showBackButton ? goBack : closeApp}
            aria-label="رجوع"
            class={twMerge("grid place-items-center w-10 h-10 -ms-2 rounded-full text-on-surface", pressable)}
        >
            <AppIcon name="arrow-right" size={20} weight="regular" />
        </button>

        <h1 class="min-w-0 flex-1 truncate text-sm font-semibold text-on-surface">{title}</h1>

        <!--
            END side (left in RTL). Under dir="rtl" a flex row lays children
            out right→left, so DOM order here is reversed from the visual
            left→right order. We want the visual to read:  ( ✕ │ ⋯ )  (☆)
            → star first in the DOM (sits rightmost / inward), capsule last
            (sits at the left edge); and inside the capsule, ⋯ first, ✕ last.
        -->
        <div class="flex items-center gap-2">
            <button
                type="button"
                onclick={toggleFav}
                aria-label="إضافة إلى المفضلة"
                aria-pressed={isFav}
                class={twMerge(
                    "grid place-items-center w-8 h-8 rounded-full border border-outline-variant",
                    pressable,
                    isFav ? "text-primary" : "text-on-surface",
                )}
            >
                <AppIcon name="star" size={16} weight={isFav ? "fill" : "regular"} />
            </button>

            {#if showCapsule}
                <div class="flex items-center h-8 overflow-hidden rounded-full border border-outline-variant">
                    <button
                        type="button"
                        onclick={() => (sheetOpen = true)}
                        aria-label="المزيد"
                        class={twMerge("grid place-items-center w-9 h-8 text-on-surface", pressable)}
                    >
                        <AppIcon name="dots-three" size={16} weight="regular" />
                    </button>
                    <span class="w-px h-3.5 bg-outline-variant"></span>
                    <button
                        type="button"
                        onclick={closeApp}
                        aria-label="إغلاق"
                        class={twMerge("grid place-items-center w-9 h-8 text-on-surface", pressable)}
                    >
                        <AppIcon name="x" size={16} />
                    </button>
                </div>
            {/if}
        </div>
    </header>
</SafeArea>

<BottomSheet open={sheetOpen} title="خيارات" onClose={() => (sheetOpen = false)}>
    <div class="flex flex-col">
        <button
            type="button"
            onclick={shareLink}
            class="flex items-center gap-3 rounded-field px-3 py-3.5 text-start text-sm font-bold text-on-surface transition active:bg-surface-container-high motion-reduce:transition-none"
        >
            <AppIcon name="share" size={22} />
            مشاركة الرابط
        </button>
        <button
            type="button"
            onclick={reload}
            class="flex items-center gap-3 rounded-field px-3 py-3.5 text-start text-sm font-bold text-on-surface transition active:bg-surface-container-high motion-reduce:transition-none"
        >
            <AppIcon name="reload" size={22} />
            إعادة تحميل
        </button>
    </div>
</BottomSheet>

<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import AppIcon from "@/components/app-icon.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { unreadCount } from "@/store/notifications-state";
    import { duration, easing, pop, reducedMotion, stagger } from "@/utils/motion";
    import { go } from "@/utils/navigation";

    /*
     * "Seal Card" greeting — a light card with a faint shanasheel watermark. The
     * ministry logo sits in an official double-ring seal, the greeting words rise
     * one by one, the name is revealed from behind a mask with a short teal
     * signature line under it, and the bell rings once when something is unread.
     * Every motion runs once and settles; reduced motion shows the final state.
     */
    interface Props {
        name: string;
    }
    const { name }: Props = $props();

    const hour = new Date().getHours();
    const salutation = (hour >= 4 && hour < 12 ? "صباح الخير،" : "مساء الخير،").split(" ");

    // The seal pops in gently.
    function rise(node: Element) {
        if (reducedMotion()) return fade(node, { duration: 120 });
        return fly(node, { y: 10, opacity: 0, duration: duration("slow"), easing: easing("decelerate"), delay: 80 });
    }
    // Mask reveal: content slides up from behind its own clip box.
    function reveal(node: Element, { delay = 0 } = {}) {
        if (reducedMotion()) return fade(node, { duration: 120, delay });
        return {
            delay,
            duration: duration("slow"),
            easing: easing("decelerate"),
            css: (t: number) => `transform: translateY(${(1 - t) * 105}%)`,
        };
    }
</script>

<header class="relative overflow-hidden rounded-card border border-outline-variant bg-surface-container p-4 shadow-e1">
    <!-- Faint shanasheel watermark on the far edge -->
    <span class="pointer-events-none absolute inset-y-0 end-0 w-28 text-primary opacity-[0.07]" aria-hidden="true">
        <LatticePattern tile={22} class="absolute inset-0 w-full h-full" />
    </span>

    <div class="relative flex items-center gap-4">
        <!-- Official seal: logo inside a double ring -->
        <span
            class="relative grid shrink-0 place-items-center w-16 h-16 rounded-full bg-primary-container"
            aria-hidden="true"
            in:rise
        >
            <span class="absolute inset-1 rounded-full border border-dashed border-primary/30"></span>
            <span class="grid place-items-center w-12 h-12 rounded-full bg-surface-container shadow-e1">
                <img src="/logo.png" alt="" class="w-10 h-10 object-contain" />
            </span>
        </span>

        <div class="min-w-0 flex-1">
            <p class="flex flex-wrap gap-x-1 text-body text-on-surface-variant" aria-label={salutation.join(" ")}>
                {#each salutation as word, i (i)}
                    <span
                        class="inline-block"
                        in:fly|global={{
                            y: 8,
                            opacity: 0,
                            duration: duration("base"),
                            easing: easing("decelerate"),
                            delay: reducedMotion() ? 0 : stagger(i, 160),
                        }}
                        aria-hidden="true">{word}</span
                    >
                {/each}
            </p>
            <h1 class="overflow-hidden text-title-2 text-on-surface">
                <span class="block truncate" in:reveal={{ delay: reducedMotion() ? 0 : 280 }}>{name}</span>
            </h1>
            <!-- Signature accent -->
            <span class="mt-1.5 block h-[3px] w-8 rounded-pill bg-primary" aria-hidden="true"></span>
        </div>

        <button
            type="button"
            onclick={() => go("/notifications")}
            aria-label={$unreadCount ? `الإشعارات، ${$unreadCount} غير مقروءة` : "الإشعارات"}
            class="pressable relative grid shrink-0 place-items-center w-12 h-12 rounded-frame bg-surface-container-high text-on-surface active:bg-primary-container"
        >
            <span class={$unreadCount ? "bell-ring" : ""}><AppIcon name="bell" size={22} /></span>
            {#if $unreadCount}
                <span
                    class="absolute -top-1.5 -end-1.5 grid place-items-center min-w-5 h-5 rounded-full bg-danger px-1 text-caption font-bold leading-none text-on-primary ring-2 ring-surface-container tabular-nums"
                    in:pop|global={{ delay: reducedMotion() ? 0 : 520 }}
                    aria-hidden="true">{$unreadCount}</span
                >
            {/if}
        </button>
    </div>
</header>

<style>
    .bell-ring {
        display: inline-block;
        transform-origin: 50% 2px;
        animation: ring var(--duration-hero) var(--ease-standard) 640ms 1 both;
    }
    @keyframes ring {
        0%,
        100% {
            transform: rotate(0);
        }
        20% {
            transform: rotate(-14deg);
        }
        40% {
            transform: rotate(11deg);
        }
        60% {
            transform: rotate(-7deg);
        }
        80% {
            transform: rotate(3deg);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .bell-ring {
            animation: none;
        }
    }
</style>

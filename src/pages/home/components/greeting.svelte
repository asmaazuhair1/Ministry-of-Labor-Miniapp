<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import AppIcon from "@/components/app-icon.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { unreadCount } from "@/store/notifications-state";
    import { duration, easing, pop, reducedMotion, stagger } from "@/utils/motion";
    import { go } from "@/utils/navigation";

    /*
     * Arch greeting. The ministry emblem rises into a Baghdadi arch, the greeting words rise one by
     * one, the name is revealed from behind a mask, and the bell rings once when
     * something is unread. Every motion runs once and settles; reduced motion
     * shows the final state with a fade.
     */
    interface Props {
        name: string;
    }
    const { name }: Props = $props();

    const hour = new Date().getHours();
    const salutation = (hour >= 4 && hour < 12 ? "صباح الخير،" : "مساء الخير،").split(" ");

    // The emblem rises into the arch.
    function rise(node: Element) {
        if (reducedMotion()) return fade(node, { duration: 120 });
        return fly(node, { y: 26, opacity: 0, duration: duration("hero"), easing: easing("spring"), delay: 120 });
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

<header class="flex items-center gap-4">
    <!-- Arch emblem: the ministry logo rises into a Baghdadi arch -->
    <span class="relative shrink-0 w-14 h-[68px] shape-arch overflow-hidden bg-primary" aria-hidden="true">
        <LatticePattern tile={18} class="absolute inset-0 w-full h-full text-on-primary/10" />
        <span class="absolute inset-1 shape-arch border border-on-primary/25"></span>
        <span class="absolute inset-x-0 bottom-[10px] flex justify-center" in:rise>
            <span class="grid place-items-center w-10 h-10 rounded-full bg-surface-container shadow-e1">
                <img src="/logo.png" alt="" class="w-8 h-8 object-contain" />
            </span>
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
    </div>

    <button
        type="button"
        onclick={() => go("/notifications")}
        aria-label={$unreadCount ? `الإشعارات، ${$unreadCount} غير مقروءة` : "الإشعارات"}
        class="pressable relative grid place-items-center shrink-0 w-12 h-12 rounded-full bg-surface-container shadow-e1 text-on-surface active:shadow-none"
    >
        <span class={$unreadCount ? "bell-ring" : ""}><AppIcon name="bell" size={22} /></span>
        {#if $unreadCount}
            <span
                class="absolute -top-1 -end-1 grid place-items-center min-w-5 h-5 rounded-pill bg-danger px-1 text-caption font-bold leading-none text-on-primary ring-2 ring-surface tabular-nums"
                in:pop|global={{ delay: reducedMotion() ? 0 : 520 }}
                aria-hidden="true">{$unreadCount}</span
            >
        {/if}
    </button>
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

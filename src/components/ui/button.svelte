<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import AppIcon from "@/components/app-icon.svelte";
    import { haptic } from "@/utils/superqi.util";
    import { twMerge } from "@/utils/tw-merge.util";

    type Variant = "primary" | "secondary" | "ghost" | "danger";
    type Size = "md" | "lg";

    interface Props extends Omit<HTMLButtonAttributes, "children"> {
        variant?: Variant;
        size?: Size;
        block?: boolean;
        loading?: boolean;
        /** Trailing icon name; mirrored arrows are handled by choosing caret-left for "forward" in RTL. */
        icon?: string;
        /** Toggle to true to play a short error shake. */
        shake?: boolean;
        class?: string;
        children: Snippet;
    }

    const {
        variant = "primary",
        size = "md",
        block = false,
        loading = false,
        icon,
        shake = false,
        disabled,
        class: className = "",
        onclick,
        children,
        ...rest
    }: Props = $props();

    const VARIANT: Record<Variant, string> = {
        primary: "bg-primary text-on-primary shadow-e2 active:shadow-e1 active:bg-primary-hover",
        secondary: "bg-primary-container text-primary active:bg-primary-container/70",
        ghost: "bg-transparent text-primary active:bg-surface-container-high",
        danger: "bg-danger-container text-danger active:bg-danger-container/70",
    };
    const SIZE: Record<Size, string> = {
        md: "h-12 px-6 text-label",
        lg: "h-14 px-8 text-headline",
    };
</script>

<button
    {...rest}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    onclick={(e) => {
        if (variant === "primary") haptic("light");
        onclick?.(e);
    }}
    class={twMerge(
        "pressable relative inline-flex items-center justify-center gap-2 rounded-pill font-bold select-none disabled:opacity-50 disabled:pointer-events-none",
        VARIANT[variant],
        SIZE[size],
        block && "w-full",
        shake && "animate-shake",
        className,
    )}
>
    {#if loading}
        <span class="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true"
        ></span>
        <span class="sr-only">جارٍ التحميل</span>
    {:else}
        {@render children()}
        {#if icon}
            <AppIcon name={icon} size={18} weight="bold" />
        {/if}
    {/if}
</button>

<script lang="ts">
    interface Props {
        size?: number;
    }
    const { size = 132 }: Props = $props();
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
>
    <circle cx="80" cy="80" r="70" class="fill-surface-container-high" />
    <rect
        x="48"
        y="40"
        width="64"
        height="82"
        rx="10"
        class="fill-surface-container stroke-outline"
        stroke-width="2.5"
    />
    <rect x="60" y="56" width="40" height="6" rx="3" class="fill-outline" />
    <rect x="60" y="72" width="40" height="6" rx="3" class="fill-outline-variant" />
    <rect x="60" y="88" width="26" height="6" rx="3" class="fill-outline-variant" />
    <circle cx="104" cy="106" r="22" class="fill-primary-container stroke-primary" stroke-width="2.5" />
    <path
        d="M96 106 L102 112 L113 100"
        class="stroke-primary"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
    />
</svg>

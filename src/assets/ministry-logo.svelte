<script lang="ts">
    interface Props {
        size?: number;
    }
    const { size = 44 }: Props = $props();
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="شعار وزارة العمل والشؤون الاجتماعية"
>
    <rect width="64" height="64" rx="16" class="fill-primary" />
    <path
        d="M32 13 L47 20 V31 C47 41 40 48 32 51 C24 48 17 41 17 31 V20 Z"
        class="fill-primary stroke-secondary"
        stroke-width="2.5"
        stroke-linejoin="round"
    />
    <circle cx="32" cy="27" r="5" class="fill-secondary" />
    <path d="M23 42 C23 36 27.5 33 32 33 C36.5 33 41 36 41 42 Z" class="fill-secondary" />
</svg>

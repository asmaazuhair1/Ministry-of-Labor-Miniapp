<script lang="ts">
    interface Props {
        label?: string;
    }
    const { label = "جارٍ التحميل..." }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center gap-3 py-20" role="status" aria-live="polite">
    <span class="w-9 h-9 rounded-full border-[3px] border-outline-variant border-t-primary animate-spin"></span>
    <p class="text-sm text-on-surface-variant">{label}</p>
</div>

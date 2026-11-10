<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import type { ServiceCategory } from "@/types/services";

    interface Props {
        category: ServiceCategory;
        count?: number;
        onClick: (id: string) => void;
    }

    const { category, count, onClick }: Props = $props();
</script>

<button
    type="button"
    onclick={() => onClick(category.id)}
    class="group flex flex-col items-center gap-2 rounded-card bg-surface-container border border-outline-variant p-3 text-center shadow-card active:scale-[0.97] transition"
>
    <span class="grid place-items-center w-14 h-14 rounded-2xl bg-surface-container-highest">
        <AppIcon name={category.icon} size={28} weight="fill" class="text-on-surface-variant" />
    </span>
    <span class="text-[12.5px] font-bold leading-snug text-on-surface line-clamp-2">{category.title}</span>
    {#if count !== undefined}
        <span class="text-[11px] text-on-surface-muted">{count} خدمة</span>
    {/if}
</button>

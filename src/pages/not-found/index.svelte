<script lang="ts">
    import { push } from "svelte-spa-router";
    import EmptyState from "@/components/empty-state.svelte";
</script>

<EmptyState
    title="الصفحة غير موجودة"
    description="عذراً، تعذّر العثور على الصفحة المطلوبة."
    actionLabel="العودة إلى الرئيسية"
    onAction={() => push("/")}
/>

<script lang="ts">
    import { push } from "svelte-spa-router";
    import RequestCard from "@/components/cards/request-card.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { STATUS_DEFINITIONS } from "@/config/status.config";
    import { getRequests } from "./service";
    import type { RequestStatus, RequestSummary } from "@/types/requests";

    const query = createQuery<RequestSummary[]>({ key: "requests", fetcher: getRequests });
    const requests = $derived(query.data ?? []);

    type Filter = "all" | RequestStatus;
    let filter = $state<Filter>("all");

    const filters: { key: Filter; label: string }[] = [
        { key: "all", label: "الكل" },
        { key: "audit", label: STATUS_DEFINITIONS.audit.label },
        { key: "payment", label: STATUS_DEFINITIONS.payment.label },
        { key: "data-review", label: STATUS_DEFINITIONS["data-review"].label },
        { key: "action-required", label: STATUS_DEFINITIONS["action-required"].label },
        { key: "completed", label: STATUS_DEFINITIONS.completed.label },
        { key: "rejected", label: STATUS_DEFINITIONS.rejected.label },
    ];

    const filtered = $derived(filter === "all" ? requests : requests.filter((r) => r.status === filter));
    const countFor = (key: Filter) =>
        key === "all" ? requests.length : requests.filter((r) => r.status === key).length;

    function openRequest(id: string) {
        push(`/requests/${id}`);
    }
</script>

<div class="py-4 animate-fade-up">
    <div class="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
        {#each filters as item (item.key)}
            {@const active = filter === item.key}
            <button
                type="button"
                onclick={() => (filter = item.key)}
                class="shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-bold transition {active
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant'}"
            >
                {item.label} ({countFor(item.key)})
            </button>
        {/each}
    </div>

    <div class="px-4 mt-4">
        {#if query.isLoading}
            <div class="flex flex-col gap-3">
                {#each Array(4) as _, i (i)}
                    <Skeleton class="h-40" />
                {/each}
            </div>
        {:else if filtered.length === 0}
            <EmptyState
                title={filter === "all" ? "لا توجد طلبات بعد" : "لا توجد طلبات بهذه الحالة"}
                description={filter === "all"
                    ? "ابدأ بتقديم طلب جديد من قسم الخدمات وستظهر معاملاتك هنا."
                    : "جرّب تصفية أخرى لعرض بقية معاملاتك."}
                actionLabel={filter === "all" ? "تصفّح الخدمات" : undefined}
                onAction={filter === "all" ? () => push("/services") : undefined}
            />
        {:else}
            <div class="flex flex-col gap-3.5">
                {#each filtered as request (request.id)}
                    <RequestCard {request} onClick={openRequest} />
                {/each}
            </div>
        {/if}
    </div>
</div>

<script lang="ts">
    import { flip } from "svelte/animate";
    import RequestCard from "@/components/cards/request-card.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import Tabs from "@/components/ui/tabs.svelte";
    import PageBanner from "@/components/ui/page-banner.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { duration, easing, fadeIn, reducedMotion, rise, stagger } from "@/utils/motion";
    import { go } from "@/utils/navigation";
    import { getRequests } from "./service";
    import type { RequestStatus, RequestSummary } from "@/types/requests";

    const query = createQuery<RequestSummary[]>({ key: "requests", fetcher: getRequests });
    const requests = $derived(
        (query.data ?? [])
            .slice()
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    );

    // Hick: four clear groups instead of seven status filters.
    type Group = "all" | "open" | "completed" | "rejected";
    const CLOSED: RequestStatus[] = ["completed", "rejected"];
    const NEEDS_YOU: RequestStatus[] = ["payment", "action-required"];
    let group = $state<Group>("all");

    const inGroup = (r: RequestSummary, g: Group) =>
        g === "all" ? true : g === "open" ? !CLOSED.includes(r.status) : r.status === g;

    const tabs = $derived([
        { id: "all", label: "الكل", count: requests.length },
        { id: "open", label: "قيد المتابعة", count: requests.filter((r) => inGroup(r, "open")).length },
        { id: "completed", label: "مكتملة", count: requests.filter((r) => inGroup(r, "completed")).length },
        { id: "rejected", label: "مرفوضة", count: requests.filter((r) => inGroup(r, "rejected")).length },
    ]);

    // Requests that need the citizen float to the top of their group.
    const visible = $derived(
        requests
            .filter((r) => inGroup(r, group))
            .sort((a, b) => Number(NEEDS_YOU.includes(b.status)) - Number(NEEDS_YOU.includes(a.status))),
    );

    const flipOptions = () => ({ duration: reducedMotion() ? 0 : duration("base"), easing: easing("standard") });
    const open = (id: string) => go(`/requests/${id}`);
</script>

<div class="px-gutter pt-5 pb-6">
    {#if query.isLoading}
        <Skeleton class="-mx-gutter -mt-5 h-[108px] rounded-none rounded-b-card" />
        <Skeleton shape="pill" class="mt-5 h-[52px] w-full" />
        <div class="mt-5 flex flex-col gap-3">
            {#each Array(3) as _, i (i)}
                <Skeleton class="h-[148px] rounded-card" />
            {/each}
        </div>
    {:else if requests.length === 0}
        <EmptyState
            icon="files"
            title="لا توجد طلبات بعد"
            description="قدّم على أي خدمة وستظهر معاملتك هنا مع كل مراحلها."
            actionLabel="تصفّح الخدمات"
            onAction={() => go("/services")}
        />
    {:else}
        <PageBanner
            title="متابعة"
            accent="الطلبات"
            description="تابع حالة معاملاتك ومراحل إنجازها أولاً بأول، واطّلع على ما يحتاج إجراءً منك."
        />

        <div class="mt-5" in:rise={{ delay: stagger(1) }}>
            <Tabs items={tabs} value={group} onChange={(id) => (group = id as Group)} label="تصفية الطلبات" />
        </div>

        <section class="mt-5" aria-live="polite">
            {#if visible.length === 0}
                <EmptyState icon="files" title="لا توجد طلبات هنا" description="جرّب تبويباً آخر لعرض بقية معاملاتك." />
            {:else}
                <ul class="flex flex-col gap-3">
                    {#each visible as request, i (request.id)}
                        <li
                            animate:flip={flipOptions()}
                            in:rise={{ delay: stagger(i + 2) }}
                            out:fadeIn={{ duration: duration("fast") }}
                        >
                            <RequestCard {request} onClick={open} />
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
    {/if}
</div>

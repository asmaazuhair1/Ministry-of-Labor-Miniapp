<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import EmptyState from "@/components/empty-state.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import EditorialArticle from "@/components/editorial/editorial-article.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getCategories } from "@/pages/services/service";
    import { formatArabicDate } from "@/utils/format.util";
    import { rise, stagger } from "@/utils/motion";
    import { go, goReplace } from "@/utils/navigation";
    import { getAnnouncementById, getAnnouncements } from "./service";
    import type { Announcement } from "@/types/content";
    import type { ServiceCategory } from "@/types/services";

    interface Props {
        params?: { announcementId?: string };
    }
    const { params }: Props = $props();

    const query = createQuery<Announcement | null>({
        key: "announcement-details",
        fetcher: () => getAnnouncementById(params?.announcementId ?? ""),
    });
    const allQuery = createQuery<Announcement[]>({ key: "announcements-related", fetcher: getAnnouncements });
    const categoriesQuery = createQuery<ServiceCategory[]>({ key: "categories", fetcher: getCategories });

    const item = $derived(query.data ?? null);
    const others = $derived((allQuery.data ?? []).filter((a) => a.id !== item?.id).slice(0, 3));
    const kicker = $derived((categoriesQuery.data ?? []).find((c) => c.id === item?.category)?.title);
</script>

{#if query.isLoading}
    <Skeleton class="h-72 rounded-none" />
    <div class="px-gutter pt-6 flex flex-col gap-3">
        <Skeleton class="h-7 w-11/12" />
        <Skeleton class="h-7 w-2/3" />
        <Skeleton class="h-4 w-1/2" />
        <Skeleton class="mt-4 h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-4/5" />
    </div>
{:else if !item}
    <EmptyState
        icon="megaphone"
        title="الإعلان غير موجود"
        description="ربما انتهى هذا الإعلان أو تغيّر رابطه."
        actionLabel="العودة للرئيسية"
        onAction={() => goReplace("/")}
    />
{:else}
    <EditorialArticle
        id={item.id}
        kind="announcement"
        title={item.title}
        date={item.date}
        lead={item.description}
        body={item.body}
        image={item.image}
        icon="megaphone"
        {kicker}
    >
        {#if item.points?.length}
            <section class="rounded-hero bg-surface-container p-5 shadow-e1">
                <h2 class="flex items-center gap-2 text-headline text-on-surface">
                    <span class="grid place-items-center w-8 h-8 rounded-full bg-primary-container text-primary">
                        <AppIcon name="list-checks" size={18} weight="bold" />
                    </span>
                    ما يهمّك معرفته
                </h2>
                <ol class="mt-4 flex flex-col gap-3">
                    {#each item.points as point, i (i)}
                        <li class="flex items-start gap-3" in:rise={{ delay: stagger(i + 5) }}>
                            <span
                                class="grid place-items-center w-6 h-6 shrink-0 rounded-full bg-primary text-caption font-bold text-on-primary tabular-nums"
                                >{i + 1}</span
                            >
                            <span class="pt-0.5 text-body text-on-surface">{point}</span>
                        </li>
                    {/each}
                </ol>
            </section>
        {/if}

        {#if others.length}
            <section>
                <h2 class="mb-3 text-title-2 text-on-surface">إعلانات أخرى</h2>
                <div class="-mx-gutter px-gutter flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                    {#each others as other (other.id)}
                        <button
                            type="button"
                            onclick={() => go(`/announcements/${other.id}`)}
                            class="pressable snap-start shrink-0 w-[70%] overflow-hidden rounded-card bg-surface-container text-start shadow-e1"
                        >
                            {#if other.image}
                                <img src={other.image} alt="" loading="lazy" class="w-full h-24 object-cover" />
                            {/if}
                            <span class="block p-3">
                                <span class="block text-label text-on-surface line-clamp-2">{other.title}</span>
                                <span class="mt-1 block text-caption text-on-surface-muted"
                                    >{formatArabicDate(other.date)}</span
                                >
                            </span>
                        </button>
                    {/each}
                </div>
            </section>
        {/if}
    </EditorialArticle>
{/if}

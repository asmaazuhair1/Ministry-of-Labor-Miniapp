<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import SectionHeader from "@/components/section-header.svelte";
    import CategoryCard from "@/components/cards/category-card.svelte";
    import ServiceCard from "@/components/cards/service-card.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import AnnouncementSlider from "./components/announcement-slider.svelte";
    import NewsCard from "@/components/cards/news-card.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getCategories, getServices } from "@/pages/services/service";
    import { getAnnouncements, getNews } from "./service";
    import { DEMO_USER } from "@/config/demo/user.demo";
    import type { ServiceCategory, ServiceSummary } from "@/types/services";
    import type { Announcement, NewsItem } from "@/types/content";

    const announcementsQuery = createQuery<Announcement[]>({ key: "announcements", fetcher: getAnnouncements });
    const categoriesQuery = createQuery<ServiceCategory[]>({ key: "home-categories", fetcher: getCategories });
    const servicesQuery = createQuery<ServiceSummary[]>({ key: "home-services", fetcher: getServices });
    const newsQuery = createQuery<NewsItem[]>({ key: "home-news", fetcher: getNews });

    const announcements = $derived(announcementsQuery.data ?? []);
    const categories = $derived(categoriesQuery.data ?? []);
    const services = $derived(servicesQuery.data ?? []);
    const news = $derived(newsQuery.data ?? []);

    const topServices = $derived(
        services
            .slice()
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 4),
    );
    const categoryTitle = (id: string) => categories.find((c) => c.id === id)?.title;

    function openCategory(id: string) {
        push(`/services/category/${id}`);
    }
    function openService(id: string) {
        push(`/services/${id}`);
    }
    function openNews(id: string) {
        push(`/news/${id}`);
    }
</script>

<div class="pb-4 animate-fade-up">
    <section class="px-4 pt-4 pb-5 bg-white border-b border-outline-variant">
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 min-w-0">
                <span
                    class="grid place-items-center shrink-0 w-16 h-16 rounded-2xl bg-white shadow-soft ring-1 ring-outline-variant p-2"
                >
                    <img src="/logo.png" alt="شعار الوزارة" class="w-full h-full object-contain" />
                </span>
                <div class="min-w-0">
                    <p class="text-[13px] text-on-surface-variant">أهلاً بك</p>
                    <h1 class="mt-0.5 text-xl font-extrabold truncate text-on-surface">{DEMO_USER.firstName}</h1>
                </div>
            </div>
            <button
                type="button"
                onclick={() => push("/notifications")}
                aria-label="الإشعارات"
                class="relative grid place-items-center shrink-0 w-11 h-11 rounded-full bg-surface-container border border-outline-variant text-on-surface shadow-card active:scale-95 transition"
            >
                <AppIcon name="bell" size={21} weight="regular" />
                <span class="absolute top-2.5 end-3 w-2 h-2 rounded-full bg-danger ring-2 ring-surface"></span>
            </button>
        </div>
    </section>

    <section class="px-4 mt-5">
        {#if announcementsQuery.isLoading}
            <Skeleton class="h-36 w-full" />
        {:else if announcements.length}
            <AnnouncementSlider {announcements} />
        {/if}
    </section>

    <section class="px-4 mt-7">
        <SectionHeader title="التصنيفات" actionLabel="الكل" onAction={() => push("/services")} />
        {#if categoriesQuery.isLoading}
            <div class="grid grid-cols-4 gap-3">
                {#each Array(8) as _, i (i)}
                    <Skeleton class="h-24" />
                {/each}
            </div>
        {:else}
            <div class="grid grid-cols-4 gap-3">
                {#each categories as category (category.id)}
                    <CategoryCard {category} onClick={openCategory} />
                {/each}
            </div>
        {/if}
    </section>

    <section class="px-4 mt-7">
        <SectionHeader title="الأكثر طلباً" actionLabel="الكل" onAction={() => push("/services")} />
        {#if servicesQuery.isLoading}
            <div class="flex flex-col gap-3">
                {#each Array(4) as _, i (i)}
                    <Skeleton class="h-20" />
                {/each}
            </div>
        {:else}
            <div class="flex flex-col gap-3">
                {#each topServices as service (service.id)}
                    <ServiceCard {service} categoryTitle={categoryTitle(service.categoryId)} onClick={openService} />
                {/each}
            </div>
        {/if}
    </section>

    <section class="px-4 mt-7">
        <SectionHeader title="أخبار الوزارة" actionLabel="الكل" onAction={() => push("/news")} />
        {#if newsQuery.isLoading}
            <div class="flex flex-col gap-3">
                {#each Array(3) as _, i (i)}
                    <Skeleton class="h-20" />
                {/each}
            </div>
        {:else}
            <div class="flex flex-col gap-3">
                {#each news as item (item.id)}
                    <NewsCard news={item} onClick={openNews} />
                {/each}
            </div>
        {/if}
    </section>
</div>

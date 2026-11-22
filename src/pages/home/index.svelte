<script lang="ts">
    import { go } from "@/utils/navigation";
    import SectionHeader from "@/components/section-header.svelte";
    import CategoryCard from "@/components/cards/category-card.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import Greeting from "./components/greeting.svelte";
    import StorySlider from "./components/story-slider.svelte";
    import ServicesBento from "./components/services-bento.svelte";
    import NewsCarousel from "./components/news-carousel.svelte";
    import LawsList from "@/components/cards/laws-list.svelte";
    import { createQuery } from "@/hooks/create-query.svelte";
    import { getCategories, getServices } from "@/pages/services/service";
    import { getAnnouncements, getLaws, getNews } from "./service";
    import { DEMO_USER } from "@/config/demo/user.demo";
    import { rise, stagger } from "@/utils/motion";
    import type { ServiceCategory, ServiceSummary } from "@/types/services";
    import type { Announcement, LawDocument, NewsItem } from "@/types/content";

    const announcementsQuery = createQuery<Announcement[]>({ key: "announcements", fetcher: getAnnouncements });
    const categoriesQuery = createQuery<ServiceCategory[]>({ key: "home-categories", fetcher: getCategories });
    const servicesQuery = createQuery<ServiceSummary[]>({ key: "home-services", fetcher: getServices });
    const newsQuery = createQuery<NewsItem[]>({ key: "home-news", fetcher: getNews });
    const lawsQuery = createQuery<LawDocument[]>({ key: "home-laws", fetcher: getLaws });

    const laws = $derived((lawsQuery.data ?? []).slice(0, 4));
</script>

<div class="px-gutter pt-5 pb-6 flex flex-col gap-section">
    <!-- Greeting + announcements slider -->
    <section class="flex flex-col gap-5" in:rise={{ delay: stagger(0) }}>
        <Greeting name={DEMO_USER.firstName} />
        {#if announcementsQuery.isLoading}
            <Skeleton class="h-[288px] rounded-hero" />
        {:else if announcementsQuery.data?.length}
            <StorySlider announcements={announcementsQuery.data} />
        {/if}
    </section>

    <!-- Categories -->
    <section in:rise={{ delay: stagger(1) }}>
        <SectionHeader title="التصنيفات" />
        {#if categoriesQuery.isLoading}
            <div class="grid grid-cols-2 gap-3">
                <Skeleton class="h-[236px] shape-gate" />
                <Skeleton class="h-[236px] shape-gate" />
            </div>
        {:else}
            <div class="grid grid-cols-2 gap-3">
                {#each categoriesQuery.data ?? [] as category, i (category.id)}
                    <CategoryCard
                        {category}
                        index={i}
                        total={(servicesQuery.data ?? []).filter((s) => s.categoryId === category.id).length}
                        available={(servicesQuery.data ?? []).filter(
                            (s) => s.categoryId === category.id && s.availability === "available",
                        ).length}
                        onClick={(id) => go(`/services/category/${id}`)}
                    />
                {/each}
            </div>
        {/if}
    </section>

    <!-- Services bento -->
    <section in:rise={{ delay: stagger(2) }}>
        <SectionHeader title="الخدمات" actionLabel="الكل" onAction={() => go("/services")} />
        {#if servicesQuery.isLoading}
            <div class="grid grid-cols-[1.2fr_1fr] gap-3">
                <Skeleton class="h-[280px] rounded-hero" />
                <div class="flex flex-col gap-3">
                    <Skeleton class="flex-1 rounded-card" />
                    <Skeleton class="flex-1 rounded-card" />
                </div>
            </div>
        {:else}
            <ServicesBento services={servicesQuery.data ?? []} />
        {/if}
    </section>

    <!-- News -->
    <section in:rise={{ delay: stagger(3) }}>
        <SectionHeader title="الاخبار" actionLabel="الكل" onAction={() => go("/news")} />
        {#if newsQuery.isLoading}
            <div class="flex gap-3 overflow-hidden">
                <Skeleton class="shrink-0 w-[85%] h-[188px] rounded-card" />
                <Skeleton class="shrink-0 w-[85%] h-[188px] rounded-card" />
            </div>
        {:else}
            <NewsCarousel news={newsQuery.data ?? []} />
        {/if}
    </section>

    <!-- Laws -->
    <section in:rise={{ delay: stagger(4) }}>
        <SectionHeader title="القوانين والتعليمات" actionLabel="الكل" onAction={() => go("/laws")} />
        {#if lawsQuery.isLoading}
            <div class="flex flex-col gap-3">
                {#each Array(4) as _, i (i)}
                    <Skeleton class="h-[108px] rounded-card" />
                {/each}
            </div>
        {:else}
            <LawsList {laws} />
        {/if}
    </section>
</div>

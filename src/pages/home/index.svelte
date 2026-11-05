<script lang="ts">
    import { push } from "svelte-spa-router";
    import AppIcon from "@/components/app-icon.svelte";
    import SectionHeader from "@/components/section-header.svelte";
    import CategoryCard from "@/components/cards/category-card.svelte";
    import ServiceCard from "@/components/cards/service-card.svelte";
    import Skeleton from "@/components/loading/skeleton.svelte";
    import AnnouncementSlider from "./components/announcement-slider.svelte";
    import NewsCard from "./components/news-card.svelte";
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
    <section class="px-4 pt-4 pb-5 bg-primary text-on-primary rounded-b-[2rem]">
        <p class="text-[13px] text-on-primary/80">أهلاً بك</p>
        <h1 class="mt-0.5 text-xl font-extrabold">{DEMO_USER.firstName}</h1>
        <div class="mt-3 flex items-center gap-1.5 rounded-full bg-white/15 w-fit px-3 py-1.5">
            <AppIcon name="shield-check" size={15} weight="fill" />
            <span class="text-[11px] font-bold">{DEMO_USER.beneficiaryStatus}</span>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
            <button
                type="button"
                onclick={() => push("/services")}
                class="flex items-center gap-2 rounded-field bg-white/15 px-3.5 py-3 text-start active:bg-white/25 transition"
            >
                <AppIcon name="squares-four" size={22} weight="fill" />
                <span class="text-[13px] font-bold">الخدمات</span>
            </button>
            <button
                type="button"
                onclick={() => push("/requests")}
                class="flex items-center gap-2 rounded-field bg-white/15 px-3.5 py-3 text-start active:bg-white/25 transition"
            >
                <AppIcon name="files" size={22} weight="fill" />
                <span class="text-[13px] font-bold">طلباتي</span>
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
        <SectionHeader title="أخبار الوزارة" />
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

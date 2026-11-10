import type { Component } from "svelte";
import HomePage from "@/pages/home/index.svelte";
import ServicesPage from "@/pages/services/index.svelte";
import CategoryDetailsPage from "@/pages/services/category.svelte";
import ServiceDetailsPage from "@/pages/services/details.svelte";
import ServiceApplyPage from "@/pages/services/apply.svelte";
import RequestsPage from "@/pages/requests/index.svelte";
import RequestDetailsPage from "@/pages/requests/details.svelte";
import AccountPage from "@/pages/account/index.svelte";
import EditProfilePage from "@/pages/account/edit.svelte";
import NotificationsPage from "@/pages/notifications/index.svelte";
import NewsListPage from "@/pages/news/index.svelte";
import NewsDetailsPage from "@/pages/home/news.svelte";
import NotFoundPage from "@/pages/not-found/index.svelte";

export interface LayoutConfig {
    showLayout: boolean;
    showBottomNav: boolean;
    showBackButton: boolean;
    showLogo: boolean;
    showBell: boolean;
    pageTitle: string;
}

export interface RouteMeta {
    requiresAuth?: boolean;
}

export interface RouteConfig {
    path: string;
    component: Component;
    layout: LayoutConfig;
    meta?: RouteMeta;
}

export const routes: RouteConfig[] = [
    {
        path: "/",
        component: HomePage,
        layout: {
            showLayout: true,
            showBottomNav: true,
            showBackButton: false,
            showLogo: true,
            showBell: true,
            pageTitle: "",
        },
    },
    {
        path: "/services",
        component: ServicesPage,
        layout: {
            showLayout: true,
            showBottomNav: true,
            showBackButton: false,
            showLogo: false,
            showBell: true,
            pageTitle: "الخدمات الإلكترونية",
        },
    },
    {
        path: "/services/category/:categoryId",
        component: CategoryDetailsPage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "",
        },
    },
    {
        path: "/services/:serviceId",
        component: ServiceDetailsPage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "تفاصيل الخدمة",
        },
    },
    {
        path: "/services/:serviceId/apply",
        component: ServiceApplyPage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "تقديم طلب",
        },
    },
    {
        path: "/requests",
        component: RequestsPage,
        layout: {
            showLayout: true,
            showBottomNav: true,
            showBackButton: false,
            showLogo: false,
            showBell: true,
            pageTitle: "طلباتي",
        },
    },
    {
        path: "/requests/:requestId",
        component: RequestDetailsPage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "تفاصيل الطلب",
        },
    },
    {
        path: "/account",
        component: AccountPage,
        layout: {
            showLayout: true,
            showBottomNav: true,
            showBackButton: false,
            showLogo: false,
            showBell: false,
            pageTitle: "حسابي",
        },
    },
    {
        path: "/account/edit",
        component: EditProfilePage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "تعديل البيانات الشخصية",
        },
    },
    {
        path: "/notifications",
        component: NotificationsPage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "الإشعارات",
        },
    },
    {
        path: "/news",
        component: NewsListPage,
        layout: {
            showLayout: true,
            showBottomNav: true,
            showBackButton: false,
            showLogo: false,
            showBell: false,
            pageTitle: "الأخبار",
        },
    },
    {
        path: "/news/:newsId",
        component: NewsDetailsPage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "الخبر",
        },
    },
    {
        path: "*",
        component: NotFoundPage,
        layout: {
            showLayout: true,
            showBottomNav: false,
            showBackButton: true,
            showLogo: false,
            showBell: false,
            pageTitle: "",
        },
    },
];

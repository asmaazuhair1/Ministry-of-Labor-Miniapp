import type { ServiceCategory } from "@/types/services";

/** DEMO service categories. Structure mirrors the future backend taxonomy. */
export const DEMO_CATEGORIES: ServiceCategory[] = [
    {
        id: "social-protection",
        title: "هيئة الحماية الاجتماعية",
        description: "خدمات المستفيدين من شبكة الحماية الاجتماعية.",
        icon: "users-three",
        accent: "primary",
    },
    {
        id: "employment",
        title: "العمل والتدريب المهني",
        description: "خدمات العمل والتشغيل والتدريب المهني ودعم المشاريع.",
        icon: "briefcase",
        logo: "/logo.png",
        accent: "tertiary",
    },
];

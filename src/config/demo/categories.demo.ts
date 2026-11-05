import type { ServiceCategory } from "@/types/services";

/** DEMO service categories. Structure mirrors the future backend taxonomy. */
export const DEMO_CATEGORIES: ServiceCategory[] = [
    {
        id: "social-protection",
        title: "الحماية الاجتماعية",
        description: "إعانات ورعاية الأسر المشمولة بشبكة الحماية الاجتماعية.",
        icon: "shield-check",
        accent: "primary",
    },
    {
        id: "social-care",
        title: "الرعاية الاجتماعية",
        description: "خدمات رعاية المسنين والأيتام والأسر المحتاجة.",
        icon: "hand-heart",
        accent: "secondary",
    },
    {
        id: "employment",
        title: "العمل والتشغيل",
        description: "تسجيل الباحثين عن عمل وخدمات سوق العمل.",
        icon: "briefcase",
        accent: "tertiary",
    },
    {
        id: "vocational-training",
        title: "التدريب المهني",
        description: "الدورات والبرامج التدريبية وشهادات الإتمام.",
        icon: "toolbox",
        accent: "info",
    },
    {
        id: "disability",
        title: "ذوي الإعاقة والاحتياجات الخاصة",
        description: "بطاقات وخدمات ومخصصات ذوي الإعاقة.",
        icon: "wheelchair",
        accent: "review",
    },
    {
        id: "juvenile-care",
        title: "رعاية الأحداث",
        description: "خدمات حماية ورعاية الأحداث.",
        icon: "baby",
        accent: "warning",
    },
    {
        id: "workers-affairs",
        title: "شؤون العمال",
        description: "الشكاوى العمالية وتنظيم علاقات العمل.",
        icon: "users-three",
        accent: "payment",
    },
    {
        id: "other",
        title: "الخدمات الأخرى",
        description: "التأييدات والاستفسارات والخدمات العامة.",
        icon: "list-checks",
        accent: "success",
    },
];

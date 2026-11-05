export interface BottomNavItem {
    label: string;
    path: string;
    icon: string;
}

export interface AppConfig {
    metadata: {
        ministryName: string;
        ministryShortName: string;
        country: string;
    };
    api: {
        baseUrl: string;
    };
    features: {
        enableDebugger: boolean;
        demoMode: boolean;
    };
    bottomNav: BottomNavItem[];
}

export const appConfig: AppConfig = {
    metadata: {
        ministryName: "وزارة العمل والشؤون الاجتماعية",
        ministryShortName: "وزارة العمل",
        country: "جمهورية العراق",
    },
    api: {
        baseUrl: import.meta.env.VITE_BASE_URL ?? "",
    },
    features: {
        enableDebugger: import.meta.env.VITE_ENVIRONMENT !== "production",
        demoMode: true,
    },
    bottomNav: [
        { label: "الرئيسية", path: "/", icon: "house" },
        { label: "الخدمات", path: "/services", icon: "squares-four" },
        { label: "طلباتي", path: "/requests", icon: "files" },
        { label: "حسابي", path: "/account", icon: "user-circle" },
    ],
};

/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENVIRONMENT: string;
    readonly VITE_BASE_URL: string;
    readonly VITE_AUTH_CODE: string;
    readonly VITE_CLARITY_ID: string;
    readonly VITE_DEV_LOGIN_URL: string;
    readonly VITE_DEV_PHONE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

/** SuperQi / mini-app host bridge (optional at runtime). */
interface Window {
    my?: {
        getAuthCode?: (opts: unknown) => void;
        [key: string]: unknown;
    };
}

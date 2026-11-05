import axios, { type AxiosRequestConfig } from "axios";
import { get } from "svelte/store";
import { appConfig } from "@/config/app.config";
import { accessToken } from "@/store/account-state";
import { apiCache } from "@/utils/api.cache";
import type { BaseResponse, HttpMethod } from "@/types/api";

export { apiCache };
export type { BaseResponse };

const client = axios.create({
    baseURL: appConfig.api.baseUrl,
    headers: {
        visible: "mini_app",
        "Content-Type": "application/json",
    },
});

client.interceptors.request.use((config) => {
    const token = get(accessToken);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function basePathOf(url: string): string {
    return url.split("?")[0].split("/").slice(0, 2).join("/");
}

/**
 * Single HTTP entry point for the app. GET responses are cached; any mutation
 * invalidates the cache for the resource's base path. Swap `demoRequest` for
 * this wrapper when a real backend is connected.
 */
export async function request<T>(url: string, method: HttpMethod = "GET", body?: unknown): Promise<BaseResponse<T>> {
    if (method === "GET") {
        const cached = apiCache.get<BaseResponse<T>>(url);
        if (cached) return cached;
    }

    const config: AxiosRequestConfig = { url, method, data: body };
    const response = await client.request<BaseResponse<T>>(config);

    if (method === "GET") {
        apiCache.set(url, response.data);
    } else {
        apiCache.invalidate(basePathOf(url));
    }

    return response.data;
}

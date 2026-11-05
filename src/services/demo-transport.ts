import type { BaseResponse } from "@/types/api";

/**
 * DEMO transport. Resolves a success envelope after a short delay to mimic
 * network latency without a backend. Feature services call this today and can
 * be switched to `request()` from "@/services/client" once the API is live.
 */
export function demoRequest<T>(data: T, delay = 320): Promise<BaseResponse<T>> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "تم بنجاح", data });
        }, delay);
    });
}

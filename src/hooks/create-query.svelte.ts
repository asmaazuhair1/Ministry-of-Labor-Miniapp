import type { BaseResponse } from "@/types/api";

interface CreateQueryOptions<T> {
    key: string;
    fetcher: () => Promise<BaseResponse<T>>;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
}

interface QueryState<T> {
    readonly data: T | null;
    readonly error: string | null;
    readonly isLoading: boolean;
    readonly isSuccess: boolean;
    refetch: () => Promise<void>;
}

/**
 * Lightweight server-state hook. Runs the fetcher when enabled and exposes
 * reactive data / error / loading flags backed by Svelte runes.
 */
export function createQuery<T>(options: CreateQueryOptions<T>): QueryState<T> {
    let data = $state<T | null>(null);
    let error = $state<string | null>(null);
    let isLoading = $state<boolean>(false);
    let isSuccess = $state<boolean>(false);

    async function run() {
        isLoading = true;
        error = null;
        try {
            const response = await options.fetcher();
            data = response.data;
            isSuccess = response.success;
            options.onSuccess?.(response.data);
        } catch (err) {
            error = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
            isSuccess = false;
        } finally {
            isLoading = false;
        }
    }

    $effect(() => {
        void options.key;
        if (options.enabled === false) return;
        run();
    });

    return {
        get data() {
            return data;
        },
        get error() {
            return error;
        },
        get isLoading() {
            return isLoading;
        },
        get isSuccess() {
            return isSuccess;
        },
        refetch: run,
    };
}

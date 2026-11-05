/** Minimal in-memory GET cache keyed by full request URL. */
export class ApiCache {
    private store = new Map<string, unknown>();

    get<T>(key: string): T | undefined {
        return this.store.get(key) as T | undefined;
    }

    set<T>(key: string, value: T): void {
        this.store.set(key, value);
    }

    has(key: string): boolean {
        return this.store.has(key);
    }

    /** Invalidate every cached entry whose key starts with the given base path. */
    invalidate(basePath: string): void {
        for (const key of this.store.keys()) {
            if (key.startsWith(basePath)) this.store.delete(key);
        }
    }

    clear(): void {
        this.store.clear();
    }
}

export const apiCache = new ApiCache();

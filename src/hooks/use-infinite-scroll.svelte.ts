interface InfiniteScrollOptions {
    onLoadMore: () => void;
    reachedMax: () => boolean;
    threshold?: number;
}

/** Svelte action: invokes onLoadMore when the node nears the viewport bottom. */
export function useInfiniteScroll(node: HTMLElement, options: InfiniteScrollOptions) {
    let current = options;
    const threshold = () => current.threshold ?? 160;

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && !current.reachedMax()) {
                    current.onLoadMore();
                }
            }
        },
        { rootMargin: `0px 0px ${threshold()}px 0px` },
    );

    observer.observe(node);

    return {
        update(next: InfiniteScrollOptions) {
            current = next;
        },
        destroy() {
            observer.disconnect();
        },
    };
}

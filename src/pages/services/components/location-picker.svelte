<script lang="ts" module>
    export interface PickedLocation {
        lat: number;
        lng: number;
        label?: string;
    }
</script>

<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { fly } from "svelte/transition";
    import { DEFAULT_MAP_CENTER } from "@/config/demo/application-form.demo";
    import { duration, easing, fadeIn, reducedMotion } from "@/utils/motion";
    import { haptic } from "@/utils/superqi.util";

    // Pin drops in from above with the spring curve.
    function pinDrop(node: Element) {
        if (reducedMotion()) return fadeIn(node);
        return fly(node, { y: -28, opacity: 0, duration: duration("base"), easing: easing("spring") });
    }

    interface Props {
        value: PickedLocation | null;
        invalid?: boolean;
        onChange: (value: PickedLocation) => void;
    }

    const { value, invalid = false, onChange }: Props = $props();

    /*
     * Lightweight slippy map on OpenStreetMap tiles (no map library):
     * Web-Mercator maths, drag to pan, +/- to zoom, tap to drop the pin.
     */
    const TILE = 256;
    const MIN_ZOOM = 5;
    const MAX_ZOOM = 18;

    let width = $state(0);
    let height = $state(0);
    let zoom = $state(11);
    let center = $state({ ...DEFAULT_MAP_CENTER });

    function project(lat: number, lng: number, z: number) {
        const scale = TILE * 2 ** z;
        const sin = Math.sin((lat * Math.PI) / 180);
        return {
            x: ((lng + 180) / 360) * scale,
            y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
        };
    }

    function unproject(x: number, y: number, z: number) {
        const scale = TILE * 2 ** z;
        const lng = (x / scale) * 360 - 180;
        const n = Math.PI - (2 * Math.PI * y) / scale;
        const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
        return { lat, lng };
    }

    const centerPx = $derived(project(center.lat, center.lng, zoom));
    const origin = $derived({ x: centerPx.x - width / 2, y: centerPx.y - height / 2 });

    const tiles = $derived.by(() => {
        if (!width || !height) return [];
        const count = 2 ** zoom;
        const list: { key: string; url: string; left: number; top: number }[] = [];
        for (let tx = Math.floor(origin.x / TILE); tx <= Math.floor((origin.x + width) / TILE); tx++) {
            for (let ty = Math.floor(origin.y / TILE); ty <= Math.floor((origin.y + height) / TILE); ty++) {
                if (ty < 0 || ty >= count) continue;
                const wrappedX = ((tx % count) + count) % count;
                list.push({
                    key: `${zoom}-${tx}-${ty}`,
                    url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${ty}.png`,
                    left: tx * TILE - origin.x,
                    top: ty * TILE - origin.y,
                });
            }
        }
        return list;
    });

    const marker = $derived.by(() => {
        if (!value) return null;
        const p = project(value.lat, value.lng, zoom);
        return { left: p.x - origin.x, top: p.y - origin.y };
    });

    // Pointer drag (pan) vs tap (drop pin).
    let drag: { startX: number; startY: number; cx: number; cy: number; moved: boolean } | null = null;

    function onPointerDown(e: PointerEvent) {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        drag = { startX: e.clientX, startY: e.clientY, cx: centerPx.x, cy: centerPx.y, moved: false };
    }

    function onPointerMove(e: PointerEvent) {
        if (!drag) return;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        if (!drag.moved && Math.hypot(dx, dy) < 5) return;
        drag.moved = true;
        center = unproject(drag.cx - dx, drag.cy - dy, zoom);
    }

    function onPointerUp(e: PointerEvent) {
        if (!drag) return;
        const wasTap = !drag.moved;
        drag = null;
        if (!wasTap) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const point = unproject(origin.x + e.clientX - rect.left, origin.y + e.clientY - rect.top, zoom);
        haptic("light");
        onChange({ lat: point.lat, lng: point.lng });
    }

    function setZoom(next: number) {
        zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    }

    function focusOn(lat: number, lng: number, label?: string) {
        center = { lat, lng };
        zoom = Math.max(zoom, 15);
        onChange({ lat, lng, label });
    }

    let locating = $state(false);
    function locateMe() {
        if (!navigator.geolocation) return;
        locating = true;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                locating = false;
                focusOn(pos.coords.latitude, pos.coords.longitude);
            },
            () => (locating = false),
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }

    // Place search (OpenStreetMap Nominatim, Iraq only).
    interface SearchResult {
        place_id: number;
        display_name: string;
        lat: string;
        lon: string;
    }
    let search = $state("");
    let results = $state<SearchResult[]>([]);
    let searching = $state(false);
    let searchTimer: ReturnType<typeof setTimeout> | undefined;

    function onSearchInput(text: string) {
        search = text;
        clearTimeout(searchTimer);
        if (text.trim().length < 3) {
            results = [];
            return;
        }
        searchTimer = setTimeout(() => runSearch(text.trim()), 500);
    }

    async function runSearch(text: string) {
        searching = true;
        try {
            const params = new URLSearchParams({
                format: "json",
                q: text,
                countrycodes: "iq",
                "accept-language": "ar",
                limit: "5",
            });
            const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
            results = res.ok ? await res.json() : [];
        } catch {
            results = [];
        } finally {
            searching = false;
        }
    }

    function pickResult(r: SearchResult) {
        search = r.display_name;
        results = [];
        focusOn(Number(r.lat), Number(r.lon), r.display_name);
    }
</script>

<div>
    <div class="relative">
        <div
            class="flex items-center gap-2.5 h-14 rounded-frame border border-transparent bg-surface-container-high px-4 focus-within:bg-surface-container focus-within:border-primary transition-colors duration-[var(--duration-fast)]"
        >
            <AppIcon name="magnifying-glass" size={18} class="shrink-0 text-on-surface-muted" />
            <input
                type="search"
                value={search}
                placeholder="ابحث عن موقع..."
                oninput={(e) => onSearchInput(e.currentTarget.value)}
                class="flex-1 min-w-0 bg-transparent text-body text-on-surface placeholder:text-on-surface-muted outline-none"
            />
            {#if searching}
                <span class="w-4 h-4 shrink-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
                ></span>
            {/if}
        </div>
        {#if results.length}
            <ul
                class="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto rounded-frame bg-surface-container py-2 shadow-e3"
            >
                {#each results as r (r.place_id)}
                    <li>
                        <button
                            type="button"
                            onclick={() => pickResult(r)}
                            class="w-full min-h-11 flex items-start gap-2 px-4 py-2.5 text-start text-body text-on-surface active:bg-surface-container-high"
                        >
                            <AppIcon name="map-pin" size={15} class="mt-0.5 shrink-0 text-primary" />
                            <span class="line-clamp-2">{r.display_name}</span>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

    <div
        class="relative mt-3 h-80 overflow-hidden rounded-frame border bg-surface-container-high select-none touch-none {invalid
            ? 'border-danger'
            : 'border-outline'}"
        bind:clientWidth={width}
        bind:clientHeight={height}
        dir="ltr"
    >
        <div
            role="application"
            aria-label="الخريطة"
            class="absolute inset-0 cursor-crosshair"
            onpointerdown={onPointerDown}
            onpointermove={onPointerMove}
            onpointerup={onPointerUp}
            onpointercancel={() => (drag = null)}
        >
            {#each tiles as tile (tile.key)}
                <img
                    src={tile.url}
                    alt=""
                    draggable="false"
                    class="absolute w-64 h-64 max-w-none pointer-events-none"
                    style="left:{tile.left}px;top:{tile.top}px"
                />
            {/each}

            {#if marker && value}
                <span
                    class="absolute pointer-events-none"
                    style="left:{marker.left}px;top:{marker.top}px;transform:translate(-50%,-100%)"
                >
                    {#key `${value.lat},${value.lng}`}
                        <span class="block text-primary" in:pinDrop>
                            <AppIcon name="map-pin" size={40} weight="fill" />
                        </span>
                    {/key}
                </span>
            {/if}
        </div>

        <div class="absolute top-3 left-3 flex flex-col overflow-hidden rounded-frame bg-surface-container shadow-e2">
            <button
                type="button"
                onclick={() => setZoom(zoom + 1)}
                aria-label="تكبير"
                class="grid place-items-center w-11 h-11 text-on-surface border-b border-outline-variant active:bg-surface-container-high"
            >
                <AppIcon name="plus" size={16} weight="bold" />
            </button>
            <button
                type="button"
                onclick={() => setZoom(zoom - 1)}
                aria-label="تصغير"
                class="grid place-items-center w-11 h-11 text-on-surface active:bg-surface-container-high"
            >
                <AppIcon name="minus" size={16} weight="bold" />
            </button>
        </div>

        <button
            type="button"
            onclick={locateMe}
            aria-label="تحديد موقعي"
            class="absolute top-3 right-3 grid place-items-center w-11 h-11 rounded-full bg-surface-container text-primary shadow-e2 active:scale-95 transition"
        >
            {#if locating}
                <span class="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            {:else}
                <AppIcon name="map-pin" size={22} />
            {/if}
        </button>

        {#if !value}
            <span
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-pill bg-surface-container px-4 py-2.5 text-label text-on-surface shadow-e2 whitespace-nowrap"
                dir="rtl"
            >
                انقر على الخريطة لتحديد الموقع
            </span>
        {/if}

        <span
            class="absolute bottom-0 right-0 bg-surface-container/80 px-1.5 py-0.5 text-caption text-on-surface-variant"
        >
            © OpenStreetMap
        </span>
    </div>

    <p class="mt-2 text-caption text-on-surface-muted">
        {#if value}
            تم تحديد الموقع ({value.lat.toFixed(5)}, {value.lng.toFixed(5)})
        {:else}
            انقر على الخريطة لتحديد الموقع
        {/if}
    </p>
</div>

<script lang="ts">
    import { Tween } from "svelte/motion";
    import AppIcon from "@/components/app-icon.svelte";
    import { MAX_UPLOAD_MB } from "@/config/demo/application-form.demo";
    import { duration, easing, pop, reducedMotion } from "@/utils/motion";

    /** Upload field: pick → short progress fill → file chip. */
    interface Props {
        id: string;
        file: File | null;
        error?: string;
        onChange: (file: File | null) => void;
    }

    const { id, file, error, onChange }: Props = $props();

    let input: HTMLInputElement;
    let sizeError = $state("");
    let pending = $state<File | null>(null);
    const progress = new Tween(0, { duration: duration("hero"), easing: easing("decelerate") });

    async function handleChange(e: Event) {
        const picked = (e.currentTarget as HTMLInputElement).files?.[0] ?? null;
        if (!picked) return;
        if (picked.size > MAX_UPLOAD_MB * 1024 * 1024) {
            sizeError = `حجم الملف أكبر من ${MAX_UPLOAD_MB} ميغابايت`;
            input.value = "";
            return;
        }
        sizeError = "";
        if (reducedMotion()) {
            onChange(picked);
            return;
        }
        pending = picked;
        await progress.set(0, { duration: 0 });
        await progress.set(1);
        pending = null;
        onChange(picked);
    }

    function clear() {
        input.value = "";
        onChange(null);
    }

    const message = $derived(sizeError || error);
</script>

<div>
    <input
        bind:this={input}
        {id}
        type="file"
        accept="image/*,application/pdf"
        class="sr-only"
        onchange={handleChange}
    />

    {#if file}
        <div class="flex items-center gap-3 rounded-frame bg-primary-container/50 p-3" in:pop>
            <span class="grid place-items-center w-11 h-11 shrink-0 rounded-chip bg-surface-container text-primary">
                <AppIcon name="file-text" size={22} weight="fill" />
            </span>
            <span class="flex-1 min-w-0">
                <span class="block text-label text-on-surface truncate" dir="ltr">{file.name}</span>
                <span class="block text-caption text-on-surface-muted" dir="ltr"
                    >{(file.size / 1024 / 1024).toFixed(2)} MB</span
                >
            </span>
            <button
                type="button"
                onclick={clear}
                aria-label="حذف الملف"
                class="pressable grid place-items-center w-11 h-11 shrink-0 rounded-full text-danger active:bg-danger-container"
            >
                <AppIcon name="trash" size={18} />
            </button>
        </div>
    {:else if pending}
        <div class="rounded-frame bg-surface-container-high p-4" aria-live="polite">
            <div class="flex items-center justify-between gap-3">
                <span class="text-label text-on-surface truncate" dir="ltr">{pending.name}</span>
                <span class="text-caption text-on-surface-muted tabular-nums"
                    >{Math.round(progress.current * 100)}%</span
                >
            </div>
            <span class="mt-3 block h-1.5 overflow-hidden rounded-pill bg-surface-container">
                <span class="block h-full bg-primary origin-right" style="transform: scaleX({progress.current})"></span>
            </span>
        </div>
    {:else}
        <button
            type="button"
            onclick={() => input.click()}
            class="pressable w-full flex items-center gap-4 rounded-frame border-2 border-dashed px-4 py-4 text-start {message
                ? 'border-danger/50 bg-danger-container/20'
                : 'border-outline bg-surface-container'}"
        >
            <span class="grid place-items-center w-12 h-12 shrink-0 rounded-full bg-primary-container text-primary">
                <AppIcon name="cloud-arrow-up" size={24} />
            </span>
            <span class="flex-1 min-w-0">
                <span class="block text-label text-on-surface">اضغط هنا لرفع الملفات</span>
                <span class="mt-0.5 block text-caption text-on-surface-variant"
                    >نسخة ضوئية · الحد الأقصى {MAX_UPLOAD_MB} ميغابايت</span
                >
            </span>
            <span class="shrink-0 rounded-frame bg-surface-container-high px-4 py-2.5 text-label text-primary"
                >اختيار ملف</span
            >
        </button>
    {/if}

    {#if message}
        <p class="mt-2 flex items-center gap-1 text-caption font-bold text-danger">
            <AppIcon name="warning-circle" size={14} weight="fill" />
            {message}
        </p>
    {/if}
</div>

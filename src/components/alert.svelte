<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { alertState, closeAlert, type AlertVariant } from "@/store/alert-state";

    const VARIANT_ICON: Record<AlertVariant, string> = {
        success: "check-circle",
        danger: "x-circle",
        warning: "warning-circle",
        info: "info",
    };

    const VARIANT_COLOR: Record<AlertVariant, string> = {
        success: "text-success bg-success-container",
        danger: "text-danger bg-danger-container",
        warning: "text-warning bg-warning-container",
        info: "text-info bg-info-container",
    };

    function confirm() {
        const action = $alertState.onConfirm;
        closeAlert();
        action?.();
    }
</script>

{#if $alertState.open}
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <button type="button" aria-label="إغلاق" class="absolute inset-0 bg-black/40" onclick={closeAlert}></button>
        <div
            role="alertdialog"
            aria-modal="true"
            class="animate-sheet relative w-full max-w-[440px] m-0 sm:m-4 rounded-t-3xl sm:rounded-3xl bg-surface-container p-6 text-center shadow-float"
        >
            <div class="mx-auto grid place-items-center w-16 h-16 rounded-full {VARIANT_COLOR[$alertState.variant]}">
                <AppIcon name={VARIANT_ICON[$alertState.variant]} size={34} weight="fill" />
            </div>
            <h2 class="mt-4 text-lg font-extrabold text-on-surface">{$alertState.title}</h2>
            <p class="mt-2 text-sm leading-relaxed text-on-surface-variant">{$alertState.message}</p>

            <div class="mt-6 flex flex-col gap-2.5">
                <button
                    type="button"
                    onclick={confirm}
                    class="w-full rounded-field bg-primary py-3.5 text-sm font-bold text-on-primary active:bg-primary-hover transition"
                >
                    {$alertState.confirmLabel}
                </button>
                {#if $alertState.cancelLabel}
                    <button
                        type="button"
                        onclick={closeAlert}
                        class="w-full rounded-field bg-surface-container-high py-3.5 text-sm font-bold text-on-surface active:bg-surface-container-highest transition"
                    >
                        {$alertState.cancelLabel}
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}

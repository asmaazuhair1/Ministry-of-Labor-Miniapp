import { writable } from "svelte/store";

export type AlertVariant = "success" | "danger" | "warning" | "info";

export interface AlertConfig {
    open: boolean;
    variant: AlertVariant;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm?: () => void;
}

const DEFAULT_ALERT: AlertConfig = {
    open: false,
    variant: "info",
    title: "",
    message: "",
    confirmLabel: "حسناً",
    cancelLabel: undefined,
    onConfirm: undefined,
};

export const alertState = writable<AlertConfig>({ ...DEFAULT_ALERT });

export function showAlert(config: Partial<Omit<AlertConfig, "open">>): void {
    alertState.set({ ...DEFAULT_ALERT, ...config, open: true });
}

export function closeAlert(): void {
    alertState.update((state) => ({ ...state, open: false }));
}

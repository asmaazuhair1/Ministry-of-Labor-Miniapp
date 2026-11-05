export type AccentKey = "primary" | "secondary" | "tertiary" | "info" | "review" | "warning" | "payment" | "success";

/** Solid background for an accent (icon tiles, chips). */
export const ACCENT_BG: Record<AccentKey, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
    info: "bg-info",
    review: "bg-review",
    warning: "bg-warning",
    payment: "bg-payment",
    success: "bg-success",
};

/** Soft tinted background (icon frames on light surfaces). */
export const ACCENT_SOFT: Record<AccentKey, string> = {
    primary: "bg-primary-container",
    secondary: "bg-secondary-container",
    tertiary: "bg-tertiary-container",
    info: "bg-info-container",
    review: "bg-review-container",
    warning: "bg-warning-container",
    payment: "bg-payment-container",
    success: "bg-success-container",
};

/** Accent text color. */
export const ACCENT_TEXT: Record<AccentKey, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
    info: "text-info",
    review: "text-review",
    warning: "text-warning",
    payment: "text-payment",
    success: "text-success",
};

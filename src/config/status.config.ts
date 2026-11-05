import type { RequestStatus } from "@/types/requests";

export type StatusToken = "info" | "payment" | "review" | "success" | "danger" | "warning";

export interface StatusDefinition {
    label: string;
    token: StatusToken;
    icon: string;
}

export const STATUS_DEFINITIONS: Record<RequestStatus, StatusDefinition> = {
    audit: { label: "قيد التدقيق", token: "info", icon: "magnifying-glass" },
    payment: { label: "بانتظار الدفع", token: "payment", icon: "wallet" },
    "data-review": { label: "تدقيق البيانات", token: "review", icon: "file-magnifying-glass" },
    completed: { label: "مكتمل", token: "success", icon: "check-circle" },
    rejected: { label: "مرفوض", token: "danger", icon: "x-circle" },
    "action-required": { label: "بانتظار إجراء", token: "warning", icon: "warning-circle" },
};

/** Text color per status token. */
export const STATUS_TOKEN_TEXT: Record<StatusToken, string> = {
    info: "text-info",
    payment: "text-payment",
    review: "text-review",
    success: "text-success",
    danger: "text-danger",
    warning: "text-warning",
};

/** Soft container background per status token (badges). */
export const STATUS_TOKEN_BG: Record<StatusToken, string> = {
    info: "bg-info-container",
    payment: "bg-payment-container",
    review: "bg-review-container",
    success: "bg-success-container",
    danger: "bg-danger-container",
    warning: "bg-warning-container",
};

/** Solid background per status token (dots, connector lines, fills). */
export const STATUS_TOKEN_DOT: Record<StatusToken, string> = {
    info: "bg-info",
    payment: "bg-payment",
    review: "bg-review",
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning",
};

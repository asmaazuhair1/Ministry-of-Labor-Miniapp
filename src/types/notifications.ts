export type NotificationKind =
    | "submission"
    | "status-change"
    | "payment-request"
    | "payment-confirmed"
    | "missing-documents"
    | "approved"
    | "rejected"
    | "announcement";

export interface AppNotification {
    id: string;
    kind: NotificationKind;
    title: string;
    body: string;
    date: string;
    read: boolean;
    requestId?: string;
}

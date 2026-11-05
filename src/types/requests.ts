export type RequestStatus = "audit" | "payment" | "data-review" | "completed" | "rejected" | "action-required";

export type StageState = "done" | "current" | "upcoming";

export interface RequestStage {
    key: string;
    title: string;
    state: StageState;
    date?: string;
}

export interface RequestMessage {
    id: string;
    title: string;
    body: string;
    date: string;
}

export interface RequestDocument {
    name: string;
    fileName: string;
}

export interface PaymentInfo {
    amount: number;
    currency: string;
    paid: boolean;
    label: string;
}

export interface RequestFormValue {
    label: string;
    value: string;
}

export interface RequestSummary {
    id: string;
    reference: string;
    serviceId: string;
    serviceTitle: string;
    serviceIcon: string;
    categoryId: string;
    status: RequestStatus;
    submittedAt: string;
    stages: RequestStage[];
}

export interface RequestDetail extends RequestSummary {
    formData: RequestFormValue[];
    documents: RequestDocument[];
    payment: PaymentInfo | null;
    messages: RequestMessage[];
}

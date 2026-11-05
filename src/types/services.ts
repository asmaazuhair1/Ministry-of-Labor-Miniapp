import type { AccentKey } from "@/utils/accent.util";

export type ServiceAvailability = "available" | "soon" | "unavailable";

export interface ServiceCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    accent: AccentKey;
}

export interface ServiceSummary {
    id: string;
    categoryId: string;
    title: string;
    description: string;
    icon: string;
    availability: ServiceAvailability;
    popularity: number;
}

export type FormFieldType = "text" | "number" | "national-id" | "phone" | "date" | "select" | "textarea" | "file";

export interface FormFieldOption {
    value: string;
    label: string;
}

export interface FormFieldConstraints {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
}

export interface FormField {
    name: string;
    label: string;
    type: FormFieldType;
    placeholder?: string;
    required: boolean;
    validation?: string[];
    hint?: string;
    options?: FormFieldOption[];
    constraints?: FormFieldConstraints;
}

export interface SchemaSection {
    title: string;
    fields: FormField[];
}

export interface ServiceFee {
    amount: number;
    currency: string;
    label: string;
}

export interface ServiceWorkflowStage {
    key: string;
    title: string;
}

export interface ServiceDetail extends ServiceSummary {
    requiredDocuments: string[];
    eligibility: string[];
    declarations: string[];
    fee: ServiceFee | null;
    processingTime: string;
    workflow: ServiceWorkflowStage[];
    schema: SchemaSection[];
}

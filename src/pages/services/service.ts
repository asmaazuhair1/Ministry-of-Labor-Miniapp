import { demoRequest } from "@/services/demo-transport";
import { DEMO_CATEGORIES } from "@/config/demo/categories.demo";
import { SERVICE_DETAILS, SERVICE_SUMMARIES } from "@/config/demo/services.demo";
import type { ServiceCategory, ServiceDetail, ServiceSummary } from "@/types/services";

/*
 * Services data layer. Backed by DEMO data through `demoRequest`; swap each call
 * to `request()` from "@/services/client" when the backend is connected.
 */

export function getCategories() {
    return demoRequest<ServiceCategory[]>(DEMO_CATEGORIES);
}

export function getServices() {
    return demoRequest<ServiceSummary[]>(SERVICE_SUMMARIES);
}

export function getServicesByCategory(categoryId: string) {
    return demoRequest<ServiceSummary[]>(SERVICE_SUMMARIES.filter((s) => s.categoryId === categoryId));
}

export function getCategoryById(categoryId: string) {
    return demoRequest<ServiceCategory | null>(DEMO_CATEGORIES.find((c) => c.id === categoryId) ?? null);
}

export function getServiceById(serviceId: string) {
    return demoRequest<ServiceDetail | null>(SERVICE_DETAILS.find((s) => s.id === serviceId) ?? null);
}

export interface ApplicationResult {
    reference: string;
    serviceId: string;
    requiresPayment: boolean;
}

function buildReference(serviceId: string): string {
    const prefix = serviceId.split("-")[0].toUpperCase();
    const serial = Math.floor(100000 + Math.random() * 899999);
    return `${prefix}-2026-${serial}`;
}

export function submitApplication(
    serviceId: string,
    _payload: Record<string, string | number>,
    requiresPayment: boolean,
) {
    return demoRequest<ApplicationResult>({
        reference: buildReference(serviceId),
        serviceId,
        requiresPayment,
    });
}

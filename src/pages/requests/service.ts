import { demoRequest } from "@/services/demo-transport";
import { REQUEST_DETAILS, REQUEST_SUMMARIES } from "@/config/demo/requests.demo";
import type { RequestDetail, RequestSummary } from "@/types/requests";

/* Requests data layer (DEMO-backed via demoRequest). */

export function getRequests() {
    return demoRequest<RequestSummary[]>(REQUEST_SUMMARIES);
}

export function getRequestById(requestId: string) {
    return demoRequest<RequestDetail | null>(REQUEST_DETAILS.find((r) => r.id === requestId) ?? null);
}

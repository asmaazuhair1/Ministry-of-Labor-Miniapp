export interface BaseResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

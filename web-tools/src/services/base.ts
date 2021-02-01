
export interface BASE_RESPONSE<T> {
    code: number;
    data: T;
    message?: string;
}
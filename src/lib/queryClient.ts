import {QueryClient, QueryCache, MutationCache} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import {getErrorDetails} from "@/utils/axios";

function isNetworkError(error: unknown): boolean {
    if (isAxiosError(error)) {
        return !error.response
            || error.code === "ECONNABORTED"
            || error.code === "ETIMEDOUT"
            || error.code === "ERR_NETWORK"
            || error.code === "ERR_CANCELED";
    }
    if (error instanceof TypeError && error.message === 'Network request failed') {
        return true;
    }
    return false;
}

const EXPECTED_STATUS_CODES = new Set([401, 404, 409, 422]);

function isUnexpectedApiError(error: unknown): boolean {
    if (!isAxiosError(error)) return false;
    if (isNetworkError(error)) return false;
    const status = error.response?.status;
    if (!status) return false;
    return !EXPECTED_STATUS_CODES.has(status);
}

type ErrorListener = () => void;

const networkListeners = new Set<ErrorListener>();
export function onNetworkError(listener: ErrorListener): () => void {
    networkListeners.add(listener);
    return () => networkListeners.delete(listener);
}
function notifyNetworkError() {
    networkListeners.forEach(listener => listener());
}

const apiErrorListeners = new Set<ErrorListener>();
export function onApiError(listener: ErrorListener): () => void {
    apiErrorListeners.add(listener);
    return () => apiErrorListeners.delete(listener);
}
export function notifyApiError() {
    apiErrorListeners.forEach(listener => listener());
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (isNetworkError(error)) return false;
                return failureCount < 3;
            },
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            console.error(getErrorDetails(error));
            if (isNetworkError(error)) {
                notifyNetworkError();
            } else if (isUnexpectedApiError(error)) {
                notifyApiError();
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            console.error(getErrorDetails(error));
            if (isNetworkError(error)) {
                notifyNetworkError();
            } else if (isUnexpectedApiError(error)) {
                notifyApiError();
            }
        },
    }),
});

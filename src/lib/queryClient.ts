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

type NetworkErrorListener = () => void;
const listeners = new Set<NetworkErrorListener>();

export function onNetworkError(listener: NetworkErrorListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notifyNetworkError() {
    listeners.forEach(listener => listener());
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
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            console.error(getErrorDetails(error));
            if (isNetworkError(error)) {
                notifyNetworkError();
            }
        },
    }),
});

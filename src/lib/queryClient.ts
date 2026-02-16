import {QueryClient, QueryCache, MutationCache} from "@tanstack/react-query";
import {isAxiosError} from "axios";

function isNetworkError(error: unknown): boolean {
    if (isAxiosError(error)) {
        return !error.response || error.code === "ECONNABORTED" || error.code === "ERR_NETWORK";
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
    queryCache: new QueryCache({
        onError: (error) => {
            if (isNetworkError(error)) {
                notifyNetworkError();
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            if (isNetworkError(error)) {
                notifyNetworkError();
            }
        },
    }),
});

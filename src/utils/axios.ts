import { AxiosError } from 'axios';

export interface ApiError {
    message?: string;
    error?: string;
    statusCode?: number;
}

export function isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError;
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        const data = error?.response?.data as any;

        return data?.message
            || data?.error
            || error?.message
            || 'Une erreur est survenue';
    }

    if (error instanceof Error) {
        return error?.message;
    }

    return 'Une erreur inconnue est survenue';
}

export const getErrorDetails = (error: any) => {
    if (error.type === 'NETWORK_ERROR') {
        return {
            type: 'NETWORK_ERROR',
            message: error.message,
            status: null,
            data: null,
        };
    }

    if (error.response) {
        return {
            type: 'HTTP_ERROR',
            message: error.response.data?.message || error.message,
            status: error.response.status,
            data: error.response.data,
        };
    }

    return {
        type: 'UNKNOWN_ERROR',
        message: error.message || 'Une erreur inconnue est survenue',
        status: null,
        data: null,
    };
};

export const isNetworkError = (error: any): boolean => {
    return (
        error.code === 'ECONNABORTED' || // Timeout
        error.code === 'ERR_NETWORK' ||  // Pas de connexion
        error.message === 'Network Error' ||
        !error.response // Pas de réponse du serveur
    );
};

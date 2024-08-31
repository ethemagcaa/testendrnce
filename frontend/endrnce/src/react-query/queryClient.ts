import { QueryCache, MutationCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function queryErrorHandler(error: unknown): void {
    // error is type unknown because in js, anything can be an error (e.g. throw(5))
    const title = error instanceof Error ? error.message : "error connecting to server";

    toast.error(title);
}

export function generateQueryClient(): QueryClient {
    return new QueryClient({
        // from https://tkdodo.eu/blog/react-query-error-handling#the-global-callbacks
        queryCache: new QueryCache({
            onError: queryErrorHandler,
        }),
        mutationCache: new MutationCache({
            onError: queryErrorHandler,
        }),
        defaultOptions: {
            queries: {
                staleTime: 600000, // 10 minutes
                cacheTime: 900000, // default cacheTime is 5 minutes; doesn't make sense for staleTime to exceed cacheTime
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
            }
        },
    });
}

export const queryClient = generateQueryClient();

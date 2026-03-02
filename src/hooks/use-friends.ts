import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/api';
import {TanstackQueryKey} from '@/types/TanstackQueryKey';
import {Friend, FriendRequest} from '@/types/api/Friend';

export function useFriends(enabled: boolean) {
    const queryClient = useQueryClient();

    const {data: friends, isPending: friendsPending} = useQuery<Friend[]>({
        queryKey: [TanstackQueryKey.FRIENDS],
        queryFn: async () => (await api.get('/friend')).data,
        enabled,
    });

    const {data: requestsSent, isPending: requestsSentPending} = useQuery<FriendRequest[]>({
        queryKey: [TanstackQueryKey.FRIEND_REQUESTS_SENT],
        queryFn: async () => (await api.get('/friend/request/sent')).data,
        enabled,
    });

    const {data: requestsReceived, isPending: requestsReceivedPending} = useQuery<FriendRequest[]>({
        queryKey: [TanstackQueryKey.FRIEND_REQUESTS_RECEIVED],
        queryFn: async () => (await api.get('/friend/request/received')).data,
        enabled,
        refetchInterval: 10_000,
    });

    const {mutate: acceptRequest} = useMutation({
        mutationFn: (id: string) => api.post(`/friend/request/${id}/accept`),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [TanstackQueryKey.FRIEND_REQUESTS_RECEIVED]});
            queryClient.invalidateQueries({queryKey: [TanstackQueryKey.FRIENDS]});
        },
    });

    const {mutate: declineRequest} = useMutation({
        mutationFn: (id: string) => api.post(`/friend/request/${id}/decline`),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [TanstackQueryKey.FRIEND_REQUESTS_RECEIVED]});
        },
    });

    return {
        friends,
        friendsPending,
        requestsSent,
        requestsSentPending,
        requestsReceived,
        requestsReceivedPending,
        acceptRequest,
        declineRequest,
    };
}

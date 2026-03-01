import {Clipboard, Pressable, View, useWindowDimensions} from 'react-native';
import {useCallback, useState} from 'react';
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import Animated, {
    Easing,
    Extrapolation,
    FadeInDown,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Page} from '@/containers/Page';
import {Text} from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import FriendCard from '@/components/friends/FriendCard';
import AddFriendBottomSheet from '@/components/bottom-sheet/AddFriendBottomSheet';
import FriendCardSkeleton from '@/components/skeletons/FriendCardSkeleton';
import RequestCardSkeleton from '@/components/skeletons/RequestCardSkeleton';
import useTranslations from '@/hooks/use-translations';
import useBottomSheet from '@/hooks/use-bottom-sheet';
import useUser from '@/hooks/use-user';
import {api} from '@/lib/api';
import {TanstackQueryKey} from '@/types/TanstackQueryKey';
import {Friend, FriendRequest} from '@/types/api/Friend';
import Avatar from "../src/components/avatar/Avatar";

export default function FriendsPage() {
    const i18n = useTranslations();
    const router = useRouter();
    const {user} = useUser();
    const {showBottomSheet} = useBottomSheet();
    const {width: screenWidth} = useWindowDimensions();
    const [copied, setCopied] = useState(false);
    const queryClient = useQueryClient();

    const tabProgress = useSharedValue(0);

    const tab0LabelStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1, 2], [1, 0.4, 0.4], Extrapolation.CLAMP),
    }));
    const tab1LabelStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1, 2], [0.4, 1, 0.4], Extrapolation.CLAMP),
    }));
    const tab2LabelStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1, 2], [0.4, 0.4, 1], Extrapolation.CLAMP),
    }));
    const tab0UnderlineStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
    }));
    const tab1UnderlineStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1, 2], [0, 1, 0], Extrapolation.CLAMP),
    }));
    const tab2UnderlineStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [1, 2], [0, 1], Extrapolation.CLAMP),
    }));
    const slideStyle = useAnimatedStyle(() => ({
        transform: [{translateX: interpolate(tabProgress.value, [0, 1, 2], [0, -screenWidth, -screenWidth * 2], Extrapolation.CLAMP)}],
    }));

    const switchTab = (index: 0 | 1 | 2) => {
        tabProgress.value = withTiming(index, {duration: 350, easing: Easing.out(Easing.cubic)});
    };

    const goBack = useCallback(() => {
        if (router.canGoBack()) router.back();
        else router.push('/');
    }, [router]);

    const {data: friends, isPending: friendsPending} = useQuery<Friend[]>({
        queryKey: [TanstackQueryKey.FRIENDS],
        queryFn: async () => (await api.get('/friend')).data,
        enabled: !!user,
    });

    const {data: requestsSent, isPending: requestsSentPending} = useQuery<FriendRequest[]>({
        queryKey: [TanstackQueryKey.FRIEND_REQUESTS_SENT],
        queryFn: async () => (await api.get('/friend/request/sent')).data,
        enabled: !!user,
    });

    const {data: requestsReceived, isPending: requestsReceivedPending} = useQuery<FriendRequest[]>({
        queryKey: [TanstackQueryKey.FRIEND_REQUESTS_RECEIVED],
        queryFn: async () => (await api.get('/friend/request/received')).data,
        enabled: !!user,
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

    const handleCopyCode = () => {
        Clipboard.setString(user?.friendCode ?? '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddFriend = () => {
        showBottomSheet(<AddFriendBottomSheet />);
    };

    console.log("friends", friends);

    if (!user) return null;

    return (
        <Page onBack={goBack} logoAction={() => {}} scrollable={false} containerClassName="mt-24">
            <Animated.View entering={FadeInDown.duration(400).delay(150)} className="px-4 mt-4">
                <View className="flex-row border-b border-white/10">
                    <Pressable onPress={() => switchTab(0)} style={{flex: 1, alignItems: 'center', paddingBottom: 12}}>
                        <Animated.View style={tab0LabelStyle}>
                            <Text className="text-sm font-semibold">{i18n.t('friends.tabs.friends')}</Text>
                        </Animated.View>
                        <Animated.View style={[tab0UnderlineStyle, {position: 'absolute', bottom: 0, left: 8, right: 8, height: 2, borderRadius: 99, overflow: 'hidden'}]}>
                            <LinearGradient colors={['#F6339A', '#AD46FF']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1}} />
                        </Animated.View>
                    </Pressable>
                    <Pressable onPress={() => switchTab(1)} style={{flex: 1, alignItems: 'center', paddingBottom: 12}}>
                        <Animated.View style={tab1LabelStyle}>
                            <Text className="text-sm font-semibold">{i18n.t('friends.tabs.requests')}</Text>
                        </Animated.View>
                        <Animated.View style={[tab1UnderlineStyle, {position: 'absolute', bottom: 0, left: 8, right: 8, height: 2, borderRadius: 99, overflow: 'hidden'}]}>
                            <LinearGradient colors={['#F6339A', '#AD46FF']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1}} />
                        </Animated.View>
                    </Pressable>
                    <Pressable onPress={() => switchTab(2)} style={{flex: 1, alignItems: 'center', paddingBottom: 12}}>
                        <Animated.View style={[tab2LabelStyle, {flexDirection: 'row', alignItems: 'center', gap: 6}]}>
                            <Text className="text-sm font-semibold">{i18n.t('friends.tabs.received')}</Text>
                            {!!requestsReceived?.length && (
                                <View style={{backgroundColor: '#F6339A', borderRadius: 99, minWidth: 18, height: 18, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#fff', lineHeight: 14}}>
                                        {requestsReceived.length}
                                    </Text>
                                </View>
                            )}
                        </Animated.View>
                        <Animated.View style={[tab2UnderlineStyle, {position: 'absolute', bottom: 0, left: 8, right: 8, height: 2, borderRadius: 99, overflow: 'hidden'}]}>
                            <LinearGradient colors={['#F6339A', '#AD46FF']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1}} />
                        </Animated.View>
                    </Pressable>
                </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(200)} className="items-center mt-8 mb-4 px-4">
                <Button className="self-center" onPress={handleAddFriend}>
                    {i18n.t('friends.addFriend.title')}
                </Button>
            </Animated.View>

            <View style={{flex: 1, overflow: 'hidden'}}>
                <Animated.View style={[{flexDirection: 'row', width: screenWidth * 3, flex: 1}, slideStyle]}>

                    {/* Tab 0 — Amis */}
                    <ScrollView
                        style={{width: screenWidth}}
                        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 10, paddingBottom: 32, gap: 12}}
                        showsVerticalScrollIndicator={false}
                    >
                        {friendsPending ? (
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <FriendCardSkeleton />
                                <FriendCardSkeleton />
                                <FriendCardSkeleton />
                            </Animated.View>
                        ) : !friends?.length ? (
                            <Animated.View entering={FadeInDown.duration(400).delay(250)}>
                                <Text className="text-gray text-center mt-8">{i18n.t('friends.noFriends')}</Text>
                            </Animated.View>
                        ) : (
                            <Animated.View entering={FadeInDown.duration(400).delay(250)} style={{gap: 12}}>
                                {friends.map((friend) => (
                                    <FriendCard key={friend.friend.id} name={friend.friend.name} gender={friend.friend.gender} avatarOptions={friend.friend.avatarOptions}/>
                                ))}
                            </Animated.View>
                        )}
                    </ScrollView>

                    {/* Tab 1 — Demandes envoyées */}
                    <ScrollView
                        style={{width: screenWidth}}
                        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 10, paddingBottom: 32, gap: 12}}
                        showsVerticalScrollIndicator={false}
                    >
                        {requestsSentPending ? (
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <RequestCardSkeleton />
                                <RequestCardSkeleton />
                            </Animated.View>
                        ) : !requestsSent?.length ? (
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <Text className="text-gray text-center mt-8">{i18n.t('friends.noRequests')}</Text>
                            </Animated.View>
                        ) : (
                            <Animated.View entering={FadeInDown.duration(400)} style={{gap: 12}}>
                                {requestsSent.map((req) => (
                                    <Animated.View key={req.id}>
                                        <LinearGradient
                                            colors={['#2A2344', '#332850']}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            style={{borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12}}
                                        >
                                            <Avatar options={req.userRequested.avatarOptions} size={44} />
                                            <View style={{flex: 1}}>
                                                <Text className="font-semibold">{req.userRequested.name}</Text>
                                                <Text className="text-xs text-gray">{req.userRequested.friendCode}</Text>
                                            </View>
                                            <View style={{backgroundColor: 'rgba(173,70,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4}}>
                                                <Text style={{color: '#AD46FF', fontSize: 11, fontFamily: 'Poppins-Medium'}}>{i18n.t('friends.waiting')}</Text>
                                            </View>
                                        </LinearGradient>
                                    </Animated.View>
                                ))}
                            </Animated.View>
                        )}
                    </ScrollView>

                    {/* Tab 2 — Demandes reçues */}
                    <ScrollView
                        style={{width: screenWidth}}
                        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 10, paddingBottom: 32, gap: 12}}
                        showsVerticalScrollIndicator={false}
                    >
                        {requestsReceivedPending ? (
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <RequestCardSkeleton />
                                <RequestCardSkeleton />
                            </Animated.View>
                        ) : !requestsReceived?.length ? (
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <Text className="text-gray text-center mt-8">{i18n.t('friends.noRequestsReceived')}</Text>
                            </Animated.View>
                        ) : (
                            <Animated.View entering={FadeInDown.duration(400)} style={{gap: 12}}>
                                {requestsReceived.map((req) => (
                                    <Animated.View key={req.id}>
                                        <LinearGradient
                                            colors={['#2A2344', '#332850']}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            style={{borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12}}
                                        >
                                            <Avatar options={req.user.avatarOptions} size={44} />
                                            <View style={{flex: 1}}>
                                                <Text className="font-semibold">{req.user.name}</Text>
                                                <Text className="text-xs text-gray">{req.user.friendCode}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', gap: 8}}>
                                                <Pressable
                                                    onPress={() => declineRequest(req.id)}
                                                    style={{backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4}}
                                                >
                                                    <Text style={{color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Poppins-Medium'}}>{i18n.t('friends.decline')}</Text>
                                                </Pressable>
                                                <Pressable
                                                    onPress={() => acceptRequest(req.id)}
                                                    style={{backgroundColor: 'rgba(246,51,154,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4}}
                                                >
                                                    <Text style={{color: '#F6339A', fontSize: 11, fontFamily: 'Poppins-Medium'}}>{i18n.t('friends.accept')}</Text>
                                                </Pressable>
                                            </View>
                                        </LinearGradient>
                                    </Animated.View>
                                ))}
                            </Animated.View>
                        )}
                    </ScrollView>

                </Animated.View>
            </View>

        </Page>
    );
}

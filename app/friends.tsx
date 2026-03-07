import {Pressable, View, useWindowDimensions} from 'react-native';
import {useCallback, useState} from 'react';
import {useRouter} from 'expo-router';
import Animated, {
    Easing,
    Extrapolation,
    FadeIn,
    FadeInDown,
    FadeOutDown,
    LinearTransition,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import {Page} from '@/containers/Page';
import {Text} from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import FriendCard from '@/components/friends/FriendCard';
import FriendsTabs from '@/components/friends/FriendsTabs';
import RequestCard from '@/components/friends/RequestCard';
import AddFriendBottomSheet from '@/components/bottom-sheet/AddFriendBottomSheet';
import FriendCardSkeleton from '@/components/skeletons/FriendCardSkeleton';
import RequestCardSkeleton from '@/components/skeletons/RequestCardSkeleton';
import useTranslations from '@/hooks/use-translations';
import useBottomSheet from '@/hooks/use-bottom-sheet';
import useUser from '@/hooks/use-user';
import {useFriends} from '@/hooks/use-friends';
import Clipboard from '@react-native-clipboard/clipboard';
import CheckIcon from '@/assets/icons/check.svg';
import CrossIcon from '@/assets/icons/cross.svg';

export default function FriendsPage() {
    const i18n = useTranslations();
    const router = useRouter();
    const {user} = useUser();
    const {showBottomSheet} = useBottomSheet();
    const {width: screenWidth} = useWindowDimensions();
    const [copied, setCopied] = useState(false);
    const [actioned, setActioned] = useState<Record<string, 'accepted' | 'declined'>>({});

    const handleAccept = (id: string) => {
        setActioned(prev => ({...prev, [id]: 'accepted'}));
        setTimeout(() => acceptRequest(id), 900);
    };

    const handleDecline = (id: string) => {
        setActioned(prev => ({...prev, [id]: 'declined'}));
        setTimeout(() => declineRequest(id), 900);
    };

    const handleCopyCode = () => {
        Clipboard.setString(user?.friendCode ?? '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabProgress = useSharedValue(0);
    const slideStyle = useAnimatedStyle(() => ({
        transform: [{translateX: interpolate(tabProgress.value, [0, 1, 2], [0, -screenWidth, -screenWidth * 2], Extrapolation.CLAMP)}],
    }));

    const {
        friends, friendsPending,
        requestsSent, requestsSentPending,
        requestsReceived, requestsReceivedPending,
        acceptRequest, declineRequest,
    } = useFriends(!!user);

    const switchTab = (index: 0 | 1 | 2) => {
        tabProgress.value = withTiming(index, {duration: 350, easing: Easing.out(Easing.cubic)});
    };

    const goBack = useCallback(() => {
        if (router.canGoBack()) router.back();
        else router.push('/');
    }, [router]);

    if (!user) return null;

    return (
        <Page onBack={goBack} logoAction={() => {}} scrollable={false} containerClassName="mt-24">
            <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-4 mt-4 mb-4">
                <Pressable onPress={handleCopyCode} className="items-center gap-1">
                    <Text className="text-xs text-gray uppercase font-semibold" style={{letterSpacing: 1.5}}>
                        {i18n.t('friends.myCode')}
                    </Text>
                    <Text className="text-white font-bold" style={{fontSize: 28, letterSpacing: 6}}>
                        {user.friendCode}
                    </Text>
                    <Text className="text-xs" style={{color: copied ? '#4ADE80' : 'rgba(255,255,255,0.35)'}}>
                        {copied ? i18n.t('friends.codeCopied') : i18n.t('friends.tapToCopy')}
                    </Text>
                </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(150)} className="px-4 mt-4">
                <FriendsTabs
                    tabProgress={tabProgress}
                    onTabPress={switchTab}
                    receivedCount={requestsReceived?.length ?? 0}
                />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(200)} className="items-center mt-6 mb-4 px-4">
                <Button className="self-center" onPress={() => showBottomSheet(<AddFriendBottomSheet onSuccess={() => switchTab(1)} />)}>
                    {i18n.t('friends.addFriend.title')}
                </Button>
            </Animated.View>

            <View style={{flex: 1, overflow: 'hidden'}}>
                <Animated.View style={[{flexDirection: 'row', width: screenWidth * 3, flex: 1}, slideStyle]}>
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
                                    <Animated.View key={friend.friend.id} entering={FadeInDown.duration(300)} exiting={FadeOutDown.duration(300)} layout={LinearTransition.duration(300)}>
                                        <FriendCard name={friend.friend.name} gender={friend.friend.gender} avatarOptions={friend.friend.avatarOptions} friendCode={friend.friend.friendCode} currentGame={friend.currentGame} />
                                    </Animated.View>
                                ))}
                            </Animated.View>
                        )}
                    </ScrollView>

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
                                    <Animated.View key={req.id} entering={FadeInDown.duration(300)} exiting={FadeOutDown.duration(300)} layout={LinearTransition.duration(300)}>
                                        <RequestCard
                                            name={req.userRequested.name}
                                            friendCode={req.userRequested.friendCode}
                                            avatarOptions={req.userRequested.avatarOptions}
                                            actions={
                                                <View style={{backgroundColor: 'rgba(173,70,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4}}>
                                                    <Text style={{color: '#AD46FF', fontSize: 11, fontFamily: 'Poppins-Medium'}}>{i18n.t('friends.waiting')}</Text>
                                                </View>
                                            }
                                        />
                                    </Animated.View>
                                ))}
                            </Animated.View>
                        )}
                    </ScrollView>

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
                                    <Animated.View key={req.id} entering={FadeInDown.duration(300)} exiting={FadeOutDown.duration(300)} layout={LinearTransition.duration(300)}>
                                    <RequestCard
                                        name={req.user.name}
                                        friendCode={req.user.friendCode}
                                        avatarOptions={req.user.avatarOptions}
                                        actions={
                                            actioned[req.id] ? (
                                                <Animated.View entering={FadeIn.duration(300)}>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        fontFamily: 'Poppins-SemiBold',
                                                        color: actioned[req.id] === 'accepted' ? '#4ADE80' : 'rgba(255,255,255,0.4)',
                                                    }}>
                                                        {actioned[req.id] === 'accepted' ? 'Accepté !' : 'Refusé !'}
                                                    </Text>
                                                </Animated.View>
                                            ) : (
                                                <View style={{flexDirection: 'row', gap: 8}}>
                                                    <Pressable
                                                        onPress={() => handleDecline(req.id)}
                                                        style={{width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center'}}
                                                    >
                                                        <CrossIcon width={20} height={20} color="rgba(255,255,255,0.5)" />
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => handleAccept(req.id)}
                                                        style={{width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(74,222,128,0.15)', alignItems: 'center', justifyContent: 'center'}}
                                                    >
                                                        <CheckIcon width={20} height={20} color="#4ADE80" />
                                                    </Pressable>
                                                </View>
                                            )
                                        }
                                    />
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

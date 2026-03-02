import {Pressable, View} from 'react-native';
import Animated, {Extrapolation, interpolate, SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
import {Text} from '@/components/ui/Text';
import useTranslations from '@/hooks/use-translations';

interface FriendsTabsProps {
    tabProgress: SharedValue<number>;
    onTabPress: (tab: 0 | 1 | 2) => void;
    receivedCount: number;
}

export default function FriendsTabs({tabProgress, onTabPress, receivedCount}: FriendsTabsProps) {
    const i18n = useTranslations();

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

    const underlineStyle = {position: 'absolute' as const, bottom: 0, left: 8, right: 8, height: 2, borderRadius: 99, overflow: 'hidden' as const};

    return (
        <View className="flex-row border-b border-white/10">
            <Pressable onPress={() => onTabPress(0)} style={{flex: 1, alignItems: 'center', paddingBottom: 12}}>
                <Animated.View style={tab0LabelStyle}>
                    <Text className="text-sm font-semibold">{i18n.t('friends.tabs.friends')}</Text>
                </Animated.View>
                <Animated.View style={[tab0UnderlineStyle, underlineStyle]}>
                    <LinearGradient colors={['#F6339A', '#AD46FF']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1}} />
                </Animated.View>
            </Pressable>

            <Pressable onPress={() => onTabPress(1)} style={{flex: 1, alignItems: 'center', paddingBottom: 12}}>
                <Animated.View style={tab1LabelStyle}>
                    <Text className="text-sm font-semibold">{i18n.t('friends.tabs.requests')}</Text>
                </Animated.View>
                <Animated.View style={[tab1UnderlineStyle, underlineStyle]}>
                    <LinearGradient colors={['#F6339A', '#AD46FF']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1}} />
                </Animated.View>
            </Pressable>

            <Pressable onPress={() => onTabPress(2)} style={{flex: 1, alignItems: 'center', paddingBottom: 12}}>
                <Animated.View style={[tab2LabelStyle, {flexDirection: 'row', alignItems: 'center', gap: 6}]}>
                    <Text className="text-sm font-semibold">{i18n.t('friends.tabs.received')}</Text>
                    {!!receivedCount && (
                        <View style={{backgroundColor: '#F6339A', borderRadius: 99, minWidth: 18, height: 18, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#fff', lineHeight: 14}}>
                                {receivedCount}
                            </Text>
                        </View>
                    )}
                </Animated.View>
                <Animated.View style={[tab2UnderlineStyle, underlineStyle]}>
                    <LinearGradient colors={['#F6339A', '#AD46FF']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1}} />
                </Animated.View>
            </Pressable>
        </View>
    );
}

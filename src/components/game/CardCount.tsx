import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import CardsIcon from "@/assets/icons/cards.svg";
import { Text } from "@/components/ui/Text";

interface CardCountProps {
    total: number;
    currentCount: number;
    progress: number;
}

export default function CardCount({ total, currentCount, progress }: CardCountProps) {
    const progressValue = useSharedValue(0);

    useEffect(() => {
        progressValue.value = withTiming(progress * 100, { duration: 400 });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progressValue.value}%`,
    }));

    return (
        <View className="flex-row items-center gap-2 px-2">
            <View
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 6, backgroundColor: '#F4F4F4' }}
            >
                <Animated.View style={[{ height: '100%', borderRadius: 9999 }, animatedStyle]}>
                    <LinearGradient
                        colors={['#AD46FF', '#F6339A', '#615FFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, borderRadius: 9999 }}
                    />
                </Animated.View>
            </View>

            <View className="flex-row gap-2 items-center justify-between" style={{ minWidth: 85 }}>
                <CardsIcon width={28} height={28} color="#FFFFFF" />
                <Text className="text-sm font-medium">{currentCount}/{total}</Text>
            </View>
        </View>
    )
}

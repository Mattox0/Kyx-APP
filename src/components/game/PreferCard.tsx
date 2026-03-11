import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { SvgUri } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { Gender } from "@/types/Gender";
import type { GameUser } from "@/types/api/User";

const ICON_SIZE = 100;

interface PreferCardProps {
    choiceOne: string;
    choiceTwo: string;
    questionId?: string;
    iconUri?: string;
    userMentioned?: GameUser;
    onChoiceOne: () => void;
    onChoiceTwo: () => void;
}

function renderChoice(text: string, userMentioned?: GameUser): React.ReactNode {
    if (!userMentioned || !text.includes('{user}')) return text;
    const parts = text.split('{user}');
    return (
        <>
            {parts[0]}
            <Text style={{ color: userMentioned.gender === Gender.MAN ? '#2B7FFF' : '#F6339A' }}>
                {userMentioned.name}
            </Text>
            {parts[1]}
        </>
    );
}

export default function PreferCard({ choiceOne, choiceTwo, questionId, iconUri, userMentioned, onChoiceOne, onChoiceTwo }: PreferCardProps) {
    const pressedOne = useSharedValue(0);
    const pressedTwo = useSharedValue(0);
    const contentOpacity = useSharedValue(1);

    useEffect(() => {
        contentOpacity.value = 0;
        contentOpacity.value = withTiming(1, { duration: 350 });
    }, [questionId]);

    const choiceOneStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(1 - pressedOne.value * 0.03, { duration: 100 }) }],
    }));

    const choiceTwoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(1 - pressedTwo.value * 0.03, { duration: 100 }) }],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    return (
        <View className="flex-1 mb-[90px] gap-4">
            <Animated.View style={[{ flex: 1, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }, choiceOneStyle]}>
                <Pressable
                    onPressIn={() => { pressedOne.value = 1; }}
                    onPressOut={() => { pressedOne.value = 0; }}
                    onPress={onChoiceOne}
                    style={{ flex: 1 }}
                >
                    <LinearGradient
                        colors={["#F6339A", "#AD46FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingVertical: 24 }}
                    >
                        <Animated.View style={contentStyle}>
                            <Text className="text-white text-xl font-bold text-center leading-7">
                                {renderChoice(choiceOne, userMentioned)}
                            </Text>
                        </Animated.View>
                    </LinearGradient>
                </Pressable>
            </Animated.View>

            <Animated.View style={[{ flex: 1, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: "hidden" }, choiceTwoStyle]}>
                <Pressable
                    onPressIn={() => { pressedTwo.value = 1; }}
                    onPressOut={() => { pressedTwo.value = 0; }}
                    onPress={onChoiceTwo}
                    style={{ flex: 1 }}
                >
                    <LinearGradient
                        colors={["#AD46FF", "#615FFF"]}
                        locations={[0.375, 0.7981]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingVertical: 24 }}
                    >
                        <Animated.View style={contentStyle}>
                            <Text className="text-white text-xl font-bold text-center leading-7">
                                {renderChoice(choiceTwo, userMentioned)}
                            </Text>
                        </Animated.View>
                    </LinearGradient>
                </Pressable>
            </Animated.View>

            {iconUri && (
                <View
                    className="absolute items-center justify-center border-[3px] border-container bg-background rounded-full"
                    style={{
                        width: ICON_SIZE,
                        height: ICON_SIZE,
                        top: "50%",
                        left: "50%",
                        transform: [
                            { translateX: -(ICON_SIZE / 2) },
                            { translateY: -(ICON_SIZE / 2) },
                        ],
                        zIndex: 10,
                    }}
                >
                    <Animated.View style={contentStyle}>
                        <SvgUri uri={iconUri} width={45} height={45} />
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

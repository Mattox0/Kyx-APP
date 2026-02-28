import { Pressable, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import type { AnimatedStyle } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/Text";

type Tab = "login" | "register";

interface Props {
    loginLabelStyle: AnimatedStyle<ViewStyle>;
    loginUnderlineStyle: AnimatedStyle<ViewStyle>;
    registerLabelStyle: AnimatedStyle<ViewStyle>;
    registerUnderlineStyle: AnimatedStyle<ViewStyle>;
    onTabPress: (tab: Tab) => void;
    disabled: boolean;
}

export default function AuthTabBar({
    loginLabelStyle,
    loginUnderlineStyle,
    registerLabelStyle,
    registerUnderlineStyle,
    onTabPress,
    disabled,
}: Props) {
    return (
        <View className="flex-row mb-8 border-b border-white/10 px-8">
            <View className="flex-1 items-center pb-3">
                <Pressable onPress={() => onTabPress("login")} disabled={disabled}>
                    <Animated.View style={loginLabelStyle}>
                        <Text className="text-base font-semibold">Connexion</Text>
                    </Animated.View>
                </Pressable>
                <Animated.View
                    style={loginUnderlineStyle}
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full overflow-hidden"
                >
                    <LinearGradient
                        colors={["#F6339A", "#AD46FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }}
                    />
                </Animated.View>
            </View>
            <View className="flex-1 items-center pb-3">
                <Pressable onPress={() => onTabPress("register")} disabled={disabled}>
                    <Animated.View style={registerLabelStyle}>
                        <Text className="text-base font-semibold">Inscription</Text>
                    </Animated.View>
                </Pressable>
                <Animated.View
                    style={registerUnderlineStyle}
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full overflow-hidden"
                >
                    <LinearGradient
                        colors={["#F6339A", "#AD46FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }}
                    />
                </Animated.View>
            </View>
        </View>
    );
}

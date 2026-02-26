import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/Text";
import { GameQuestion } from "@/providers/GameLocalProvider";
import { Prefer } from "@/types/api/Question";

interface GameCardProps {
    gameQuestion: GameQuestion;
}

export default function GameCard({ gameQuestion }: GameCardProps) {
    const { width } = useWindowDimensions();

    return (
        <View
            className="rounded-3xl overflow-hidden border border-border relative"
            style={{
                width: width - 32,
                aspectRatio: 0.68,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 14,
            }}
        >
            <LinearGradient
                colors={["#3B344D", "#231C38"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 1 }}
                style={{ flex: 1 }}
            >
                <Text className="text-pink text-xs font-medium text-center mt-7 tracking-widest uppercase">
                    Je nai jamais...
                </Text>

                <View className="flex-1 justify-center items-center px-7">
                    <Text className="text-xl font-bold text-center leading-9">
OUI                    </Text>
                </View>

                {gameQuestion.userTarget && (
                    <View className="items-center pb-8">
                        <LinearGradient
                            colors={["#F6339A", "#AD46FF"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                borderRadius: 20,
                            }}
                        >
                            <Text className="text-xs font-semibold">
                                {gameQuestion.userTarget.name}
                            </Text>
                        </LinearGradient>
                    </View>
                )}
            </LinearGradient>
        </View>
    );
}

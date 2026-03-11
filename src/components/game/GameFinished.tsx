import { StyleSheet, View } from "react-native";
import { Page } from "@/containers/Page";
import { Text } from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import useGameLocal from "@/hooks/use-game-local";
import useGame from "@/hooks/use-game";
import useTranslations from "@/hooks/use-translations";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GameQuestion } from "@/types/GameQuestion";
import { LinearGradient } from "expo-linear-gradient";
import CheckmarkIcon from "@/assets/icons/checkmark.svg";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";

interface GameFinishedProps {
    onBack: () => void;
}

export default function GameFinished({ onBack }: GameFinishedProps) {
    const i18n = useTranslations();
    const { initQuestions, setGameId, endGame } = useGameLocal();
    const { game, modes, users } = useGame();

    const badgeScale = useSharedValue(0);
    const badgeOpacity = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const titleY = useSharedValue(24);
    const descOpacity = useSharedValue(0);
    const descY = useSharedValue(24);
    const buttonOpacity = useSharedValue(0);
    const buttonY = useSharedValue(24);

    useEffect(() => { endGame(); }, []);

    useEffect(() => {
        badgeScale.value = withSpring(1, { damping: 10, stiffness: 150 });
        badgeOpacity.value = withTiming(1, { duration: 200 });

        titleOpacity.value = withDelay(250, withTiming(1, { duration: 350 }));
        titleY.value = withDelay(250, withSpring(0, { damping: 18, stiffness: 120 }));

        descOpacity.value = withDelay(400, withTiming(1, { duration: 350 }));
        descY.value = withDelay(400, withSpring(0, { damping: 18, stiffness: 120 }));

        buttonOpacity.value = withDelay(550, withTiming(1, { duration: 350 }));
        buttonY.value = withDelay(550, withSpring(0, { damping: 18, stiffness: 120 }));
    }, []);

    const badgeStyle = useAnimatedStyle(() => ({
        opacity: badgeOpacity.value,
        transform: [{ scale: badgeScale.value }],
    }));

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleY.value }],
    }));

    const descStyle = useAnimatedStyle(() => ({
        opacity: descOpacity.value,
        transform: [{ translateY: descY.value }],
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
        transform: [{ translateY: buttonY.value }],
    }));

    const { mutate: replay, isPending } = useMutation({
        mutationFn: async () => {
            const response = await api.post<{ gameId: string; questions: GameQuestion[] }>(`/${game?.id}/create-party/local`, {
                users: users ?? [],
                modes: modes?.map(mode => mode.id) ?? [],
            });
            return response.data;
        },
        onSuccess: (data) => {
            setGameId(data.gameId);
            initQuestions(data.questions);
        },
    });

    return (
        <Page
            onBack={onBack}
            containerClassName="mt-24 px-4"
            scrollable={false}
            logoAction={() => {}}
        >
            <View style={styles.container}>
                <Animated.View style={badgeStyle}>
                    <LinearGradient
                        colors={["#F6339A", "#AD46FF", "#615FFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.badge}
                    >
                        <CheckmarkIcon width={40} height={40} color="#FFFFFF" />
                    </LinearGradient>
                </Animated.View>

                <Animated.View style={titleStyle}>
                    <Text className="text-2xl font-bold text-center mt-6 mb-3">
                        {i18n.t("game.finished.title")}
                    </Text>
                </Animated.View>

                <Animated.View style={descStyle}>
                    <Text className="text-base text-center mb-10" style={{ opacity: 0.6 }}>
                        {i18n.t("game.finished.description")}
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.buttonWrapper, buttonStyle]}>
                    <Button onPress={() => replay()} disabled={isPending} className="w-full">
                        {i18n.t("game.finished.replay")}
                    </Button>
                </Animated.View>
            </View>
        </Page>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    badge: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonWrapper: {
        width: "100%",
    },
});

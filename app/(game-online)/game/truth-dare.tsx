import { Page } from "@/containers/Page";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import CardCount from "@/components/game/CardCount";
import useGameOnline from "@/hooks/use-game-online";
import Button from "@/components/ui/Button";
import SkipIcon from "@/assets/icons/double-chevron.svg";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import GameFinishedOnline from "@/components/game/GameFinishedOnline";
import Swiper from "react-native-deck-swiper";
import GameCard from "@/components/game/GameCard";
import { TruthDareQuestion } from "@/types/GameQuestion";
import { OnlineUser } from "@/types/api/User";
import useTranslations from "@/hooks/use-translations";

export default function TruthDareOnlinePage() {
    const router = useRouter();
    const i18n = useTranslations();
    const { cardsCount, currentQuestion, progress, myUser, nextQuestion, startGame, isGameOver } = useGameOnline();
    const { width } = useWindowDimensions();
    const { bottom } = useSafeAreaInsets();
    const swipeX = useSharedValue(0);
    const swiperRef = useRef<Swiper<TruthDareQuestion>>(null);

    const truthDareQuestion = currentQuestion?.questionType === "truth-dare" ? currentQuestion : null;
    const userTarget = truthDareQuestion?.userTarget as OnlineUser | undefined;
    const isTarget = !!(userTarget && myUser && userTarget.id === myUser.id);

    const [swipeKey, setSwipeKey] = useState(0);
    useEffect(() => {
        setSwipeKey((k) => k + 1);
    }, [currentQuestion]);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    const handleNext = useCallback(() => {
        if (isTarget) nextQuestion();
    }, [isTarget, nextQuestion]);

    const rightOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(swipeX.value, [0, width / 2], [0, 1], "clamp"),
    }));

    const leftOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(swipeX.value, [-width / 2, 0], [1, 0], "clamp"),
    }));

    if (isGameOver) {
        return (
            <GameFinishedOnline
                isHost={myUser?.isHost ?? false}
                onReplay={startGame}
                onBack={goBack}
            />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Page onBack={goBack} containerClassName="mt-24 px-4" scrollable={false} logoAction={() => {}}>
                <CardCount total={100} currentCount={cardsCount ?? 1} progress={progress} />

                {truthDareQuestion && (
                    <View key={swipeKey} style={{ flex: 1 }}>
                        <Swiper<TruthDareQuestion>
                            ref={swiperRef}
                            cards={[truthDareQuestion]}
                            cardIndex={0}
                            renderCard={(q) => <GameCard gameQuestion={q} />}
                            onSwiping={(x) => { swipeX.value = x; }}
                            onSwiped={handleNext}
                            onSwipedLeft={() => { swipeX.value = withTiming(0, { duration: 300 }); }}
                            onSwipedRight={() => { swipeX.value = withTiming(0, { duration: 300 }); }}
                            onSwipedAborted={() => { swipeX.value = withSpring(0); }}
                            keyExtractor={(q) => q.question.id}
                            stackSize={1}
                            showSecondCard={false}
                            animateCardOpacity
                            backgroundColor="transparent"
                            cardVerticalMargin={8}
                            cardHorizontalMargin={0}
                            disableTopSwipe
                            disableBottomSwipe
                            disableLeftSwipe={!isTarget}
                            disableRightSwipe={!isTarget}
                            infinite={false}
                        />
                    </View>
                )}
            </Page>

            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Animated.View style={[StyleSheet.absoluteFill, rightOverlayStyle]}>
                    <LinearGradient
                        colors={["transparent", "rgba(34, 197, 94, 0.65)"]}
                        start={{ x: 0.55, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.badgeContainerRight}>
                        <View style={[styles.badge, styles.badgeGreen]}>
                            <Text style={styles.badgeText}>✓</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View style={[StyleSheet.absoluteFill, leftOverlayStyle]}>
                    <LinearGradient
                        colors={["rgba(239, 68, 68, 0.65)", "transparent"]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0.45, y: 0.5 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.badgeContainerLeft}>
                        <View style={[styles.badge, styles.badgeRed]}>
                            <Text style={styles.badgeText}>✗</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            <View
                style={{
                    position: "absolute",
                    bottom: bottom + 16,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingHorizontal: 24,
                }}
            >
                <Button onPress={handleNext} disabled={!isTarget} iconOnly>
                    <SkipIcon width={24} height={24} color="#FFFFFF" />
                </Button>
                <Button onPress={handleNext} disabled={!isTarget} className="flex-1">
                    {isTarget
                        ? i18n.t("game.truthDare.done")
                        : i18n.t("game.truthDare.waiting", { name: userTarget?.name ?? "" })}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    badgeContainerRight: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 20,
    },
    badgeContainerLeft: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 20,
    },
    badge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
    },
    badgeGreen: {
        backgroundColor: "rgba(34, 197, 94, 0.9)",
        borderColor: "#22c55e",
    },
    badgeRed: {
        backgroundColor: "rgba(239, 68, 68, 0.9)",
        borderColor: "#ef4444",
    },
    badgeText: {
        color: "white",
        fontSize: 26,
        fontWeight: "bold",
    },
});

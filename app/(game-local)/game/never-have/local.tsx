import { Page } from "@/containers/Page";
import { useCallback, useRef } from "react";
import { useRouter } from "expo-router";
import CardCount from "@/components/game/CardCount";
import CardSlider, { CardSliderHandle } from "@/components/game/CardSlider";
import useGameLocal from "@/hooks/use-game-local";
import Button from "@/components/ui/Button";
import SkipIcon from "@/assets/icons/double-chevron.svg";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export default function NeverHave() {
    const router = useRouter();
    const { total, currentIndex, progress, nextQuestion } = useGameLocal();
    const { width } = useWindowDimensions();
    const { bottom } = useSafeAreaInsets();
    const swipeX = useSharedValue(0);
    const cardSliderRef = useRef<CardSliderHandle>(null);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    const rightOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(swipeX.value, [0, width / 2], [0, 1], "clamp"),
    }));

    const leftOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(swipeX.value, [-width / 2, 0], [1, 0], "clamp"),
    }));

    return (
        <View style={{ flex: 1 }}>
            <Page
                onBack={goBack}
                containerClassName="mt-24 px-4"
                scrollable={false}
                logoAction={() => {}}
            >
                <CardCount total={total} currentCount={currentIndex + 1} progress={progress} />

                <CardSlider
                    ref={cardSliderRef}
                    onSwiping={(x) => { swipeX.value = x; }}
                    onSwipedAborted={() => { swipeX.value = withSpring(0); }}
                    onSwipedLeft={() => { swipeX.value = withTiming(0, { duration: 300 }); }}
                    onSwipedRight={() => { swipeX.value = withTiming(0, { duration: 300 }); }}
                />
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

            <View style={{ position: "absolute", bottom: bottom + 16, alignSelf: "center" }}>
                <Button onPress={() => cardSliderRef.current?.swipeRight()} iconOnly>
                    <SkipIcon width={24} height={24} color="#FFFFFF" />
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

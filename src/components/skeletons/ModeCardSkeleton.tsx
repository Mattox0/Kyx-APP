import {View} from "react-native";
import {useEffect, useRef} from "react";
import {Animated} from "react-native";

export default function ModeCardSkeleton() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={{opacity}}
            className="border-border border-2 bg-background rounded-2xl px-6 py-2 flex-row items-center gap-4"
        >
            <View
                className="rounded-xl bg-container"
                style={{width: 80, height: 80}}
            />
            <View className="flex-1 gap-2">
                <View className="bg-container rounded-md" style={{width: 120, height: 18}} />
                <View className="bg-container rounded-full" style={{width: 60, height: 4}} />
                <View className="bg-container rounded-md mt-1" style={{width: "90%", height: 14}} />
                <View className="bg-container rounded-md" style={{width: "80%", height: 14}} />
                <View className="bg-container rounded-md" style={{width: "70%", height: 14}} />
            </View>
        </Animated.View>
    );
}

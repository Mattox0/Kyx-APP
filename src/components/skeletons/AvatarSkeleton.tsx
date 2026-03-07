import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";

interface AvatarSkeletonProps {
    size?: number;
}

export default function AvatarSkeleton({ size = 120 }: AvatarSkeletonProps) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={{
                opacity,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: "#3B344D",
            }}
        />
    );
}

import {Pressable, PressableProps} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ReactNode} from "react";
import {Text} from "@/components/ui/Text";
import Animated, {useAnimatedStyle, useSharedValue, withTiming, interpolateColor} from 'react-native-reanimated';

interface ButtonProps extends PressableProps {
    children: ReactNode;
    textClassName?: string;
    className?: string;
}

const BORDER_HEIGHT = 2;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Button({children, textClassName = '', className = '', disabled, onPressIn, onPressOut, ...props}: ButtonProps) {
    const pressed = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            pressed.value,
            [0, 1],
            ['#372AAC', 'transparent']
        ),
        opacity: disabled ? 0.5 : 1,
    }));

    const gradientStyle = useAnimatedStyle(() => ({
        transform: [{translateY: withTiming(pressed.value * BORDER_HEIGHT, {duration: 100})}],
    }));

    return (
        <Animated.View className={className} style={[{borderRadius: 25, paddingBottom: BORDER_HEIGHT}, containerStyle]}>
            <Pressable
                disabled={disabled}
                onPressIn={(e) => {
                    pressed.value = 1;
                    onPressIn?.(e);
                }}
                onPressOut={(e) => {
                    pressed.value = 0;
                    onPressOut?.(e);
                }}
                {...props}
            >
                <AnimatedLinearGradient
                    colors={disabled ? ['#6B7280', '#6B7280', '#6B7280'] : ['#F6339A', '#AD46FF', '#615FFF']}
                    locations={[0, 0.5, 1]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[
                        {
                            borderRadius: 25,
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        gradientStyle
                    ]}
                >
                    <Text className={`font-bold text-lg text-center ${textClassName}`}>
                        {children}
                    </Text>
                </AnimatedLinearGradient>
            </Pressable>
        </Animated.View>
    );
}
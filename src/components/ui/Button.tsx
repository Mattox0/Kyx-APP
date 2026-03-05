import {Pressable, PressableProps, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ReactNode} from "react";
import {Text} from "@/components/ui/Text";
import Animated, {useAnimatedStyle, useSharedValue, withTiming, interpolateColor} from 'react-native-reanimated';

interface ButtonProps extends PressableProps {
    children: ReactNode;
    textClassName?: string;
    className?: string;
    iconOnly?: boolean;
    variant?: 'default' | 'outline';
}

const BORDER_HEIGHT = 2;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function Button({children, textClassName = '', className = '', iconOnly = false, variant = 'default', disabled, onPressIn, onPressOut, ...props}: ButtonProps) {
    const pressed = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => ({
        backgroundColor: variant === 'outline'
            ? interpolateColor(pressed.value, [0, 1], ['#AD46FF', 'transparent'])
            : interpolateColor(pressed.value, [0, 1], ['#372AAC', 'transparent']),
        opacity: disabled ? 0.5 : 1,
    }));

    const gradientStyle = useAnimatedStyle(() => ({
        transform: [{translateY: withTiming(pressed.value * BORDER_HEIGHT, {duration: 100})}],
    }));

    const innerContent = iconOnly ? children : (
        <Text className={`font-semibold text-center ${variant === 'outline' ? 'text-[#AD46FF]' : ''} ${textClassName}`}>
            {children}
        </Text>
    );

    if (variant === 'outline') {
        return (
            <AnimatedView className={className} style={[{borderRadius: 25, paddingBottom: BORDER_HEIGHT}, containerStyle]}>
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
                    <Animated.View
                        style={[
                            {
                                borderRadius: 25,
                                paddingHorizontal: iconOnly ? 12 : 24,
                                paddingVertical: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#FFFFFF',
                            },
                            gradientStyle,
                        ]}
                    >
                        {innerContent}
                    </Animated.View>
                </Pressable>
            </AnimatedView>
        );
    }

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
                            paddingHorizontal: iconOnly ? 12 : 24,
                            paddingVertical: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        gradientStyle
                    ]}
                >
                    {innerContent}
                </AnimatedLinearGradient>
            </Pressable>
        </Animated.View>
    );
}
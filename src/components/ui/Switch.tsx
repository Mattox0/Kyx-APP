import React from 'react';
import { Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type SwitchProps = {
    value: boolean;
    onChange: (value: boolean) => void;
};

export default function Switch({ value, onChange }: SwitchProps) {
    const translateX = React.useRef(new Animated.Value(value ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 1 : 0,
            useNativeDriver: true,
        }).start();
    }, [value]);

    const thumbTranslate = translateX.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22],
    });

    return (
        <TouchableOpacity
            onPress={() => onChange(!value)}
            activeOpacity={1}
            style={{
                width: 45,
                height: 25,
                borderRadius: 25,
                backgroundColor: '#8B5CF6',
                justifyContent: 'center',
            }}
        >
            <Animated.View
                style={{
                    width: 21,
                    height: 21,
                    borderRadius: 21,
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: thumbTranslate }],
                }}
            />
        </TouchableOpacity>
    );
}
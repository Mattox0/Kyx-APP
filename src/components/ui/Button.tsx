import {TouchableOpacity, Text, TouchableOpacityProps} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ReactNode} from "react";

interface ButtonProps extends TouchableOpacityProps {
    children: ReactNode;
    className?: string;
    textClassName?: string;
}

export default function Button({children, className = '', textClassName = '', ...props}: ButtonProps) {
    return (
        <TouchableOpacity activeOpacity={0.8} {...props}>
            <LinearGradient
                colors={['#F6339A', '#AD46FF', '#615FFF']}
                locations={[0, 0.5, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                className={`rounded-xl px-6 py-4 items-center justify-center ${className}`}
            >
                <Text className={`text-white font-semibold text-base ${textClassName}`}>
                    {children}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

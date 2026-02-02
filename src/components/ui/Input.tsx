import {TextInput, TextInputProps, View} from 'react-native';
import {Text} from '@/components/ui/Text';
import {forwardRef} from 'react';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
}

const Input = forwardRef<TextInput, InputProps>(
    ({label, error, className, containerClassName, ...props}, ref) => {
        return (
            <View className={containerClassName}>
                {label && (
                    <Text className="text-white text-sm font-medium ml-2 mb-2">
                        {label}
                    </Text>
                )}

                <TextInput
                    ref={ref}
                    style={{
                        borderWidth: 1.768,
                        borderColor: error ? '#AE2525' : 'rgba(255, 255, 255, 0.10)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                    className={`h-14 px-5 py-4 rounded-2xl text-white ${className || ''}`}
                    placeholderTextColor="rgba(153, 161, 175, 0.6)"
                    {...props}
                />

                {error && (
                    <Text className="text-red text-sm mt-1 ml-1">
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

Input.displayName = 'Input';

export default Input;
import { Text as RNText, TextProps } from 'react-native';

type Props = TextProps & { className?: string };

export const Text = ({ className = '', ...props }: Props) => {
    const hasCustomFont = className.includes('font-');
    const baseFont = hasCustomFont ? '' : 'font-sans';

    return (
        <RNText className={`${baseFont} text-white ${className}`} {...props} />
    );
};

import { Text as RNText, TextProps } from 'react-native';

type Props = TextProps & { className?: string };

export const Text = ({ className = '', ...props }: Props) => {
    const hasCustomFont = className.includes('font-');
    const hasCustomColor = className.split(' ').some(cls =>
        /^text-(white|black|red|green|blue|pink|cyan|yellow|gray|background|container|border|\[)/.test(cls)
    );
    const baseFont = hasCustomFont ? '' : 'font-sans';

    return (
        <RNText className={`${baseFont} ${hasCustomColor ? '' : 'text-white'} ${className}`} {...props} />
    );
};

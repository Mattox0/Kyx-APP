import {Text} from "react-native";
import {JSX} from "react";

export const parseStyledText = (text: string, baseClassName = "") => {
    if (!/<[^>]+>/.test(text)) {
        return text;
    }

    const parseNode = (content: string): (string | JSX.Element)[] => {
        const regex = /(<b>|<\/b>|<strong>|<\/strong>|<i>|<\/i>|<em>|<\/em>|<u>|<\/u>)/g;
        const parts = content.split(regex);

        const result: (string | JSX.Element)[] = [];
        let currentStyles: string[] = [];
        let keyIndex = 0;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            switch (part) {
                case '<b>':
                case '<strong>':
                    currentStyles.push('font-bold');
                    break;
                case '</b>':
                case '</strong>':
                    currentStyles = currentStyles.filter(s => s !== 'font-bold');
                    break;
                case '<i>':
                case '<em>':
                    currentStyles.push('italic');
                    break;
                case '</i>':
                case '</em>':
                    currentStyles = currentStyles.filter(s => s !== 'italic');
                    break;
                case '<u>':
                    currentStyles.push('underline');
                    break;
                case '</u>':
                    currentStyles = currentStyles.filter(s => s !== 'underline');
                    break;
                default:
                    if (part && currentStyles.length > 0) {
                        result.push(
                            <Text key={`styled-${keyIndex++}`} className={currentStyles.join(' ')}>
                                {part}
                            </Text>
                        );
                    } else if (part) {
                        result.push(part);
                    }
            }
        }

        return result;
    };

    return <Text className={baseClassName}>{parseNode(text)}</Text>;
};

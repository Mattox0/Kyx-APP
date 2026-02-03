import {View, Pressable} from 'react-native';
import {memo} from 'react';

interface ColorItemProps {
    color: string;
    isSelected: boolean;
    onSelect: () => void;
}

const ColorItem = memo(function ColorItem({color, isSelected, onSelect}: ColorItemProps) {
    return (
        <Pressable
            onPress={onSelect}
            className={`rounded-full p-0.5 ${isSelected ? 'border-2 border-pink' : 'border-2 border-transparent'}`}
        >
            <View
                className="w-12 h-12 rounded-full border-2 border-black"
                style={{backgroundColor: `#${color}`}}
            />
        </Pressable>
    );
});

export default ColorItem;

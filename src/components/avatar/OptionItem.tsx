import {View, Pressable} from 'react-native';
import Avatar, {AvatarOptions} from './Avatar';
import {memo} from 'react';

interface OptionItemProps {
    previewOptions: AvatarOptions;
    isSelected: boolean;
    onSelect: () => void;
}

const OptionItem = memo(function OptionItem({previewOptions, isSelected, onSelect}: OptionItemProps) {
    return (
        <Pressable
            onPress={onSelect}
            className={`rounded-xl ${isSelected ? 'border-2 border-pink' : 'border-2 border-transparent'}`}
        >
            <View className="rounded-lg overflow-hidden">
                <Avatar options={previewOptions} size={55} />
            </View>
        </Pressable>
    );
});

export default OptionItem;

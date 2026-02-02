import {View, Pressable, FlatList} from 'react-native';
import {Text} from '@/components/ui/Text';
import Avatar, {AvatarOptions} from './Avatar';
import {useMemo, useCallback, memo} from 'react';

type OptionType = 'hair' | 'eyes' | 'eyebrows' | 'mouth' | 'skinColor' | 'hairColor' | 'earrings' | 'glasses' | 'features';

interface AvatarOptionSelectorProps {
    title: string;
    optionType: OptionType;
    options: string[];
    currentOptions: AvatarOptions;
    selectedValue: string | undefined;
    onSelect: (value: string | undefined) => void;
    isColor?: boolean;
    isOptional?: boolean;
}

interface OptionItemProps {
    option: string;
    previewOptions: AvatarOptions;
    isSelected: boolean;
    onSelect: () => void;
    isColor: boolean;
}

const OptionItem = memo(function OptionItem({option, previewOptions, isSelected, onSelect, isColor}: OptionItemProps) {
    return (
        <Pressable
            onPress={onSelect}
            className={`rounded-xl p-1 mr-3 ${isSelected ? 'border-2 border-accent-pink' : 'border-2 border-transparent'}`}
        >
            {isColor ? (
                <View
                    className="w-16 h-16 rounded-lg"
                    style={{backgroundColor: `#${option}`}}
                />
            ) : (
                <View className="bg-container rounded-lg overflow-hidden">
                    <Avatar options={previewOptions} size={64} />
                </View>
            )}
        </Pressable>
    );
});

export default function AvatarOptionSelector({
    title,
    optionType,
    options,
    currentOptions,
    selectedValue,
    onSelect,
    isColor = false,
    isOptional = false,
}: AvatarOptionSelectorProps) {
    const getPreviewOptions = useCallback((option: string): AvatarOptions => {
        const newOptions: AvatarOptions = {...currentOptions};

        if (isColor) {
            if (optionType === 'skinColor') {
                newOptions.skinColor = [option];
            } else if (optionType === 'hairColor') {
                newOptions.hairColor = [option];
            }
        } else {
            if (optionType === 'hair') {
                newOptions.hair = [option];
            } else if (optionType === 'eyes') {
                newOptions.eyes = [option];
            } else if (optionType === 'eyebrows') {
                newOptions.eyebrows = [option];
            } else if (optionType === 'mouth') {
                newOptions.mouth = [option];
            } else if (optionType === 'earrings') {
                newOptions.earrings = [option];
            } else if (optionType === 'glasses') {
                newOptions.glasses = [option];
            } else if (optionType === 'features') {
                newOptions.features = [option];
            }
        }

        return newOptions;
    }, [currentOptions, optionType, isColor]);

    const data = useMemo(() => {
        const items = options.map(option => ({
            option,
            previewOptions: getPreviewOptions(option),
        }));
        if (isOptional) {
            return [{option: '__none__', previewOptions: currentOptions}, ...items];
        }
        return items;
    }, [options, getPreviewOptions, isOptional, currentOptions]);

    const renderItem = useCallback(({item}: {item: {option: string; previewOptions: AvatarOptions}}) => {
        if (item.option === '__none__') {
            return (
                <Pressable
                    onPress={() => onSelect(undefined)}
                    className={`rounded-xl p-1 mr-3 ${!selectedValue ? 'border-2 border-accent-pink' : 'border-2 border-transparent'}`}
                >
                    <View className="w-16 h-16 rounded-lg bg-container items-center justify-center">
                        <Text className="text-2xl">✕</Text>
                    </View>
                </Pressable>
            );
        }

        return (
            <OptionItem
                option={item.option}
                previewOptions={item.previewOptions}
                isSelected={selectedValue === item.option}
                onSelect={() => onSelect(item.option)}
                isColor={isColor}
            />
        );
    }, [selectedValue, onSelect, isColor]);

    const keyExtractor = useCallback((item: {option: string}) => item.option, []);

    return (
        <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-primary">{title}</Text>
            <FlatList
                horizontal
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={6}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews={true}
                getItemLayout={(_, index) => ({
                    length: 72,
                    offset: 72 * index,
                    index,
                })}
            />
        </View>
    );
}

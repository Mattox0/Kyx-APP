import {View, Pressable} from 'react-native';
import {Text} from '@/components/ui/Text';
import {AvatarOptions} from './Avatar';
import {useMemo, useCallback, Fragment} from 'react';
import OptionItem from './OptionItem';
import ColorItem from './ColorItem';
import ColorWheelIcon from '@/assets/icons/color-wheel.svg';
import useBottomSheet from '@/hooks/use-bottom-sheet';
import {ColorWheelBottomSheet} from '@/components/bottom-sheet/ColorWheelBottomSheet';

type OptionType = 'hair' | 'eyes' | 'eyebrows' | 'mouth' | 'skinColor' | 'glasses';

interface AvatarOptionSelectorProps {
    optionType: OptionType;
    options?: string[];
    currentOptions: AvatarOptions;
    selectedValue?: string | undefined;
    onSelect?: (value: string | undefined) => void;
    colorOptions?: string[];
    selectedColorValue?: string;
    onColorSelect?: (value: string) => void;
    isOptional?: boolean;
}

export default function AvatarOptionSelector({
    optionType,
    options = [],
    currentOptions,
    selectedValue,
    onSelect,
    colorOptions,
    selectedColorValue,
    onColorSelect,
    isOptional = false,
}: AvatarOptionSelectorProps) {
    const {showBottomSheet, hideBottomSheet} = useBottomSheet();

    const getPreviewOptions = useCallback((option: string): AvatarOptions => {
        const newOptions: AvatarOptions = {...currentOptions};

        switch (optionType) {
            case 'hair':
                newOptions.hair = option;
                break;
            case 'eyes':
                newOptions.eyes = option;
                break;
            case 'eyebrows':
                newOptions.eyebrows = option;
                break;
            case 'mouth':
                newOptions.mouth = option;
                break;
            case 'glasses':
                newOptions.glasses = option;
                break;
            case 'skinColor':
                newOptions.skinColor = option;
                break;
        }

        return newOptions;
    }, [currentOptions, optionType]);

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

    const isCustomColor = useMemo(() => {
        if (!selectedColorValue || !colorOptions) return false;
        return !colorOptions.includes(selectedColorValue);
    }, [selectedColorValue, colorOptions]);

    const openColorWheel = useCallback(() => {
        const initialColor = selectedColorValue
            ? `#${selectedColorValue}`
            : '#000000';

        showBottomSheet(
            <ColorWheelBottomSheet
                initialColor={initialColor}
                onCancel={hideBottomSheet}
                onConfirm={(color: string) => {
                    const colorWithoutHash = color.replace('#', '');
                    onColorSelect?.(colorWithoutHash);
                    // Delay to let reanimated animations complete before unmounting
                    setTimeout(hideBottomSheet, 50);
                }}
            />
        );
    }, [selectedColorValue, showBottomSheet, hideBottomSheet, onColorSelect]);

    const hasOptions = options.length > 0;

    return (
        <View className="mb-6 w-full">
            {hasOptions && (
                <View className="flex-row flex-wrap -mx-0.5">
                    {data.map((item) => {
                        if (item.option === '__none__') {
                            return (
                                <View key="__none__" className="flex-1 basis-0 min-w-[16.666%] max-w-[16.666%] items-center mb-2 px-0.5">
                                    <Pressable
                                        onPress={() => onSelect?.(undefined)}
                                        className={`rounded-xl ${!selectedValue ? 'border-2 border-pink' : 'border-2 border-transparent'}`}
                                    >
                                        <View className="w-[55px] h-[55px] rounded-lg bg-container items-center justify-center">
                                            <Text className="text-2xl">✕</Text>
                                        </View>
                                    </Pressable>
                                </View>
                            );
                        }

                        return (
                            <View key={item.option} className="flex-1 basis-0 min-w-[16.666%] max-w-[16.666%] items-center mb-2 px-0.5">
                                <OptionItem
                                    previewOptions={item.previewOptions}
                                    isSelected={selectedValue === item.option}
                                    onSelect={() => onSelect?.(item.option)}
                                />
                            </View>
                        );
                    })}
                </View>
            )}

            {colorOptions && colorOptions.length > 0 && (
                <Fragment>
                    {hasOptions && <View className="w-3/4 h-[3px] self-center bg-gray rounded-2xl mb-6 mt-2" />}
                    <View className="flex-row flex-wrap -mx-0.5">
                        <View className="w-[14.285%] items-center mb-2 px-0.5">
                            <Pressable
                                onPress={openColorWheel}
                                className={`rounded-full ${isCustomColor ? 'border-2 border-pink' : 'border-2 border-transparent'}`}
                            >
                                <ColorWheelIcon width={48} height={48} />
                            </Pressable>
                        </View>

                        {colorOptions.map((color) => (
                            <View key={color} className="w-[14.285%] items-center mb-2 px-0.5">
                                <ColorItem
                                    color={color}
                                    isSelected={selectedColorValue === color}
                                    onSelect={() => onColorSelect?.(color)}
                                />
                            </View>
                        ))}
                    </View>
                </Fragment>
            )}
        </View>
    );
}

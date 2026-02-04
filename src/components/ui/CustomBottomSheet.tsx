import Button from "@/components/ui/Button";
import {
    Keyboard, Platform,
    View,
} from "react-native";
import { Text } from '@/components/ui/Text';
import BottomSheet, {BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView} from "@gorhom/bottom-sheet";
import {forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState} from "react";
import {BackdropPressBehavior} from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";

export interface CustomBottomSheetRef {
    open: () => void;
    close: () => void;
}

interface CustomBottomSheetProps {
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryPress?: () => void;
    onSecondaryPress?: () => void;
    primaryButtonDisabled?: boolean;
    secondaryButtonDisabled?: boolean;
    initialIndex?: number;
    backdropPress?: BackdropPressBehavior;
    children?: ReactNode;
}

const CustomBottomSheet = forwardRef<CustomBottomSheetRef, CustomBottomSheetProps>(
    ({
         title,
         subtitle,
         primaryButtonText,
         secondaryButtonText,
         onPrimaryPress,
         onSecondaryPress,
         primaryButtonDisabled = false,
         secondaryButtonDisabled = false,
         initialIndex = -1,
         backdropPress = "close",
         children
     }, ref) => {
        const bottomSheetRef = useRef<BottomSheet>(null);
        const [isSheetOpen, setIsSheetOpen] = useState(initialIndex >= 0);

        useImperativeHandle(ref, () => ({
            open: () => {
                setIsSheetOpen(true);
                bottomSheetRef.current?.expand();
            },
            close: () => {
                setIsSheetOpen(false);
                bottomSheetRef.current?.close()
            },
        }));

        useEffect(() => {
            if (initialIndex >= 0) {
                const timer = setTimeout(() => {
                    bottomSheetRef.current?.expand();
                }, 100);

                return () => clearTimeout(timer);
            }
        }, [initialIndex]);

        useEffect(() => {
            if (!isSheetOpen) return;
            const eventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

            const keyboardHideListener = Keyboard.addListener(
                eventName,
                () => {
                    bottomSheetRef.current?.snapToIndex(0);
                }
            );

            return () => {
                keyboardHideListener.remove();
            };
        }, [isSheetOpen]);

        const renderBackdrop = (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior={backdropPress}
            />
        );

        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={initialIndex}
                enableDynamicSizing
                enablePanDownToClose={false}
                backdropComponent={renderBackdrop}
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjustResize"
                animateOnMount={true}
                onChange={(index) => {
                    setIsSheetOpen(index >= 0);
                }}
                style={{
                    overflow: "visible",
                }}
                backgroundStyle={{
                    backgroundColor: "#231C38",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
                handleIndicatorStyle={{
                    backgroundColor: "#E0E0E0",
                }}
            >
                <BottomSheetView className="px-6 pt-2 pb-10">
                    {title && (
                        <Text
                            className={`text-xl font-bold mb-3 text-center text-black`}>
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text
                            className={`text-lg text-primaryGrey mb-6 text-center leading-5`}>
                            {subtitle}
                        </Text>
                    )}

                    {children}

                    {!(!onSecondaryPress && !onPrimaryPress) && (
                        <View className="w-full">
                            <View className="flex-row gap-2 mt-2">
                                {onSecondaryPress && (
                                    <Button
                                        className="flex-1"
                                        onPress={onSecondaryPress}
                                        disabled={secondaryButtonDisabled}
                                    >
                                        {secondaryButtonText}
                                    </Button>
                                )}

                                {onPrimaryPress && (
                                    <Button
                                        className="flex-1"
                                        onPress={onPrimaryPress}
                                        disabled={primaryButtonDisabled}
                                    >
                                        {primaryButtonText}
                                    </Button>
                                )}
                            </View>
                        </View>
                    )}
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

CustomBottomSheet.displayName = "CustomBottomSheet";

export default CustomBottomSheet;

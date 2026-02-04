import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import useTranslations from "@/hooks/use-translations";
import ColorPicker, {ColorFormatsObject, Panel5} from "reanimated-color-picker";
import {useState} from "react";
import {StyleSheet, View} from "react-native";
import {useSharedValue} from "react-native-reanimated";

interface ColorWheelBottomSheetProps {
    onCancel: () => void;
    onConfirm: (color: string) => void;
    initialColor: string;
}

export const ColorWheelBottomSheet = ({
    onCancel,
    onConfirm,
    initialColor,
}: ColorWheelBottomSheetProps) => {
    const [resultColor, setResultColor] = useState(initialColor);
    const currentColor = useSharedValue(initialColor);

    const i18n = useTranslations();

    const onColorChange = (color: ColorFormatsObject) => {
        'worklet';
        currentColor.value = color.hex;
    };

    const onColorPick = (color: ColorFormatsObject) => {
        setResultColor(color.hex);
    };

    const handleConfirm = () => {
        onConfirm(resultColor);
    };

    return (
        <CustomBottomSheet
            initialIndex={0}
            title={i18n.t("home.colorWheel.title")}
            secondaryButtonText={i18n.t("common.cancel")}
            onSecondaryPress={onCancel}
            primaryButtonText={i18n.t("common.confirm")}
            onPrimaryPress={handleConfirm}
        >
            <View className="w-full my-4">
                <ColorPicker
                    value={resultColor}
                    sliderThickness={25}
                    thumbSize={24}
                    thumbShape='circle'
                    onChange={onColorChange}
                    onCompleteJS={onColorPick}
                >
                    <View className="flex-row justify-center items-center">
                        <Panel5 style={styles.panel}/>
                    </View>
                </ColorPicker>
            </View>
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    panel: {
        height: 250,
    },
});

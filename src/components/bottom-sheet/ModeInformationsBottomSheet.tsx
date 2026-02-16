import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import useTranslations from "@/hooks/use-translations";
import {useCallback} from "react";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import {Text} from "@/components/ui/Text";
import {LinearGradient} from "expo-linear-gradient";
import {parseStyledText} from "@/utils/parseStyledText";

export interface ModeInformationsBottomSheetProps {
    howToPlayText?: string;
    exampleText?: string;
}

export const ModeInformationsBottomSheet = ({ howToPlayText, exampleText }: ModeInformationsBottomSheetProps) => {
    const i18n = useTranslations();
    const { hideBottomSheet } = useBottomSheet();

    const onClose = useCallback(() => {
        hideBottomSheet();
    }, [hideBottomSheet])

    return (
        <CustomBottomSheet
            key={Date.now()}
            initialIndex={0}
            primaryButtonText={i18n.t("mode.instructions.confirm")}
            onPrimaryPress={onClose}
        >
            <Text className="text-2xl font-bold">{i18n.t("mode.instructions.howToPlay")}</Text>
            <LinearGradient
                colors={['#F6339A', '#AD46FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{height: 4, width: 60, alignSelf: 'stretch', marginTop: 4, borderRadius: 50}}
            />
            <Text className="mt-4">{howToPlayText}</Text>
            <Text className="mt-4 text-2xl font-bold">{i18n.t("mode.instructions.example")}</Text>
            <LinearGradient
                colors={['#F6339A', '#AD46FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{height: 4, width: 60, alignSelf: 'stretch', marginTop: 4, borderRadius: 50}}
            />
            {exampleText && parseStyledText(exampleText, "my-4 text-white")}
        </CustomBottomSheet>
    );
};
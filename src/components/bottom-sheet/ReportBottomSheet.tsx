import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import useTranslations from "@/hooks/use-translations";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import { Text } from "@/components/ui/Text";

export const ReportBottomSheet = () => {
    const i18n = useTranslations();
    const { hideBottomSheet } = useBottomSheet();

    return (
        <CustomBottomSheet
            key={Date.now()}
            initialIndex={0}
            primaryButtonText={i18n.t("game.report.confirm")}
            secondaryButtonText={i18n.t("game.report.cancel")}
            onPrimaryPress={hideBottomSheet}
            onSecondaryPress={hideBottomSheet}
        >
            <Text className="text-2xl font-bold">{i18n.t("game.report.title")}</Text>
            <Text className="text-gray mt-3 mb-4">{i18n.t("game.report.description")}</Text>
        </CustomBottomSheet>
    );
};

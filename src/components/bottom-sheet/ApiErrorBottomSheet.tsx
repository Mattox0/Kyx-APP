import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import useTranslations from "@/hooks/use-translations";

export const ApiErrorBottomSheet = ({ onClose }: { onClose: () => void }) => {
    const t = useTranslations();

    return (
        <CustomBottomSheet
            initialIndex={0}
            title={t.t("common.apiErrorTitle")}
            subtitle={t.t("common.apiErrorSubtitle")}
            primaryButtonText={t.t("common.close")}
            onPrimaryPress={onClose}
            backdropPress="none"
        />
    );
};

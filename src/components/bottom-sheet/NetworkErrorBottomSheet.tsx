import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import useTranslations from "@/hooks/use-translations";

export const NetworkErrorBottomSheet = ({onRetry}: {onRetry: () => void}) => {
    const t = useTranslations();

    return (
        <CustomBottomSheet
            initialIndex={0}
            title={t.t("common.networkErrorTitle")}
            subtitle={t.t("common.networkErrorSubtitle")}
            primaryButtonText={t.t("common.retry")}
            onPrimaryPress={onRetry}
            backdropPress="none"
        />
    );
}
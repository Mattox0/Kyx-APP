import {useEffect, useRef} from "react";
import CustomBottomSheet, {CustomBottomSheetRef} from "@/components/ui/CustomBottomSheet";
import useTranslations from "@/hooks/use-translations";

export const NetworkErrorBottomSheet = ({onRetry}: {onRetry: () => void}) => {
    const sheetRef = useRef<CustomBottomSheetRef>(null);
    const t = useTranslations();

    useEffect(() => {
        sheetRef.current?.open();
    }, []);

    return (
        <CustomBottomSheet
            ref={sheetRef}
            title={t.t("common.networkErrorTitle")}
            subtitle={t.t("common.networkErrorSubtitle")}
            primaryButtonText={t.t("common.retry")}
            onPrimaryPress={onRetry}
            backdropPress="none"
        />
    );
}
import { useEffect, useRef } from "react";
import { onApiError } from "@/lib/queryClient";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import { ApiErrorBottomSheet } from "@/components/bottom-sheet/ApiErrorBottomSheet";

export default function ApiErrorHandler() {
    const { showBottomSheet, hideBottomSheet } = useBottomSheet();
    const isShowingRef = useRef(false);

    useEffect(() => {
        return onApiError(() => {
            if (isShowingRef.current) return;
            isShowingRef.current = true;

            showBottomSheet(
                <ApiErrorBottomSheet
                    onClose={() => {
                        hideBottomSheet();
                        isShowingRef.current = false;
                    }}
                />
            );
        });
    }, [showBottomSheet, hideBottomSheet]);

    return null;
}

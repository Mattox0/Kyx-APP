import {useEffect, useRef} from "react";
import {onNetworkError, queryClient} from "@/lib/queryClient";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import {NetworkErrorBottomSheet} from "@/components/bottom-sheet/NetworkErrorBottomSheet";

export default function NetworkErrorHandler() {
    const {showBottomSheet, hideBottomSheet} = useBottomSheet();
    const isShowingRef = useRef(false);

    useEffect(() => {
        return onNetworkError(() => {
            if (isShowingRef.current) return;
            isShowingRef.current = true;

            showBottomSheet(
                <NetworkErrorBottomSheet
                    onRetry={() => {
                        hideBottomSheet();
                        isShowingRef.current = false;
                        queryClient.refetchQueries({type: 'active'});
                    }}
                />
            );
        });
    }, [showBottomSheet, hideBottomSheet]);

    return null;
}

import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import Settings from "@/containers/Settings";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface SettingsBottomSheetProps {
    onClose: () => void;
}

export const SettingsBottomSheet = ({ onClose }: SettingsBottomSheetProps) => {
    const insets = useSafeAreaInsets();

    return (
        <CustomBottomSheet
            key={Date.now()}
            initialIndex={0}
            snapPoints={['100%']}
            topInset={insets.top}
        >
            <Settings onClose={onClose} />
        </CustomBottomSheet>
    );
};
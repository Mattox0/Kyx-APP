import {useContext} from 'react';
import {BottomSheetContext} from '@/providers/BottomSheetProvider';

export default function useBottomSheet() {
    const context = useContext(BottomSheetContext);

    if (!context) {
        throw new Error('useBottomSheet must be used within a BottomSheetProvider');
    }

    return context;
}

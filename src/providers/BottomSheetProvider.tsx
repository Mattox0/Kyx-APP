import React, {createContext, useState, ReactNode, useCallback} from 'react';
import {Keyboard} from "react-native";

interface BottomSheetContextType {
    showBottomSheet: (component: ReactNode) => void;
    hideBottomSheet: () => void;
}

export const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider = ({children}: {children: ReactNode}) => {
    const [currentBottomSheet, setCurrentBottomSheet] = useState<ReactNode | null>(null);
    const [key, setKey] = useState(0);

    const showBottomSheet = useCallback((component: ReactNode) => {
        Keyboard.dismiss();
        setKey(prev => prev + 1);
        setCurrentBottomSheet(component);
    }, []);

    const hideBottomSheet = useCallback(() => {
        setCurrentBottomSheet(null);
    }, []);

    return (
        <BottomSheetContext.Provider value={{showBottomSheet, hideBottomSheet}}>
            {children}
            {currentBottomSheet && (
                <React.Fragment key={key}>
                    {currentBottomSheet}
                </React.Fragment>
            )}
        </BottomSheetContext.Provider>
    );
};

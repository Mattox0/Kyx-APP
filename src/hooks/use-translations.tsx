import { type I18n } from "i18n-js";
import { useContext } from "react";
import {i18nContext, I18nContextType} from "@/providers/TranslationProvider";

export default function useTranslations(): I18n {
    const context = useContext<I18nContextType>(i18nContext);

    if (!context) {
        throw new Error('useTranslations must be used within an AppProvider');
    }

    return context.i18n;
}

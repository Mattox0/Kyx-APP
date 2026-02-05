import {SafeAreaView} from "react-native-safe-area-context";
import Header, {HeaderButton} from "@/components/ui/Header";
import {ReactNode} from "react";
import {ScrollView} from "react-native-gesture-handler";
import {View} from "react-native";

interface PageProps {
    children: ReactNode;
    logoAction?: () => void;
    showSettings?: boolean;
    onBack?: () => void;
    scrollable?: boolean;
    showHeader?: boolean;
    containerClassName?: string;
    headerButtons?: HeaderButton[];
    bottomChildren?: ReactNode;
}

export const Page = ({
                         children,
                         logoAction,
                         showSettings = true,
                         onBack,
                         scrollable = true,
                         showHeader = true,
                         containerClassName = '',
                         headerButtons,
                         bottomChildren
                     }: PageProps) => {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView className="flex-1">
            {showHeader && (
                <Header
                    showSettings={showSettings}
                    logoAction={logoAction}
                    backButtonAction={onBack}
                    otherButtons={headerButtons}
                />
            )}
            <Container
                className={`flex-1 px-4 ${showHeader ? "mt-24" : ""} ${containerClassName}`}
                {...(scrollable && { contentContainerStyle: { flexGrow: 1 } })}
            >
                {children}
            </Container>
            {bottomChildren}
        </SafeAreaView>
    );
};
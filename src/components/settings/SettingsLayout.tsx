import {Pressable, View} from "react-native";
import {Text} from "@/components/ui/Text";
import CrossIcon from "@/assets/icons/cross.svg";
import {ReactNode} from "react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface SettingsLayoutProps {
    children: ReactNode;
    onClose?: () => void;
    onBack?: () => void;
    title: string
}

export default function SettingsLayout({ children, onClose, onBack, title }: SettingsLayoutProps) {
    const insets = useSafeAreaInsets();

    return (
        <View className="bg-background px-4 flex-1" style={{paddingTop: insets.top}}>
            <View className="flex-row items-center py-4 border-b-2 border-gray">
                <View className="w-12">
                    {onBack && (
                        <Pressable
                            onPress={onBack}
                            className="w-12 h-12 items-center justify-center border border-border bg-white/5 rounded-2xl"
                        >
                            <ArrowLeftIcon width={24} height={24} color="#99A1AF" />
                        </Pressable>
                    )}
                </View>
                <Text className="flex-1 text-2xl font-bold text-center">{title}</Text>
                <View className="w-12">
                    {onClose && (
                        <Pressable
                            onPress={onClose}
                            className="w-12 h-12 items-center justify-center border border-border bg-white/5 rounded-2xl"
                        >
                            <CrossIcon width={24} height={24} color="#99A1AF" />
                        </Pressable>
                    )}
                </View>
            </View>
            {children}
        </View>
    )
}
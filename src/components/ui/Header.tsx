import {ReactNode} from "react";
import {View, TouchableOpacity, Image} from "react-native";
import SettingIcon from "@/assets/icons/settings.svg";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface HeaderProps {
    backButtonAction?: () => void;
    logoAction?: () => void;
    showSettings?: boolean;
    otherButtons?: HeaderButton[];
}

export interface HeaderButton {
    icon: ReactNode;
    action: () => void;
}

export default function Header({
                                   backButtonAction,
                                   logoAction,
                                   showSettings,
                                   otherButtons = []
                               }: HeaderProps) {
    const insets = useSafeAreaInsets();
    return (
        <View
            className="absolute w-full px-4"
            style={{paddingTop: insets.top + 16}}

        >
            <View className="flex-row items-start justify-between border">
                <View className="flex-1 flex-row justify-start">
                    {backButtonAction && (
                        <TouchableOpacity
                            onPress={backButtonAction}
                            className="w-10 h-10 items-center justify-center border border-border bg-white/5  rounded-2xl p-7"
                        >
                            <ArrowLeftIcon width={24} height={24} color="#99A1AF"/>
                        </TouchableOpacity>
                    )}
                </View>

                {/*AJOUTER LA POLICE AULIEU D'UNE IMAGE*/}
                <View className="flex-1 items-center">
                    {logoAction && (
                        <TouchableOpacity
                            onPress={logoAction}
                            disabled={!logoAction}
                        >
                            <Image
                                source={require('@/assets/images/logo-header.png')}
                                className="w-24 h-20"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View className="flex-1 items-end gap-4">
                    {showSettings && (
                        <TouchableOpacity
                            onPress={() => console.log("open settings")}
                            className="w-10 h-10 items-center justify-center border border-[#2F3247] bg-white/5  rounded-2xl p-7"
                        >
                            <SettingIcon width={24} height={24} color="#99A1AF"/>
                        </TouchableOpacity>
                    )}

                    {otherButtons.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={button.action}
                            className="w-10 h-10 items-center justify-center border border-[#2F3247] bg-white/5  rounded-2xl p-7"
                        >
                            {button.icon}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}
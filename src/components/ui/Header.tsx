import {FC, ReactNode} from "react";
import {View, TouchableOpacity, Image} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import SettingIcon from "@/assets/icons/settings.svg";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Text} from "@/components/ui/Text";
import {SvgProps} from "react-native-svg";

interface HeaderProps {
    backButtonAction?: () => void;
    logoAction?: () => void;
    showSettings?: boolean;
    otherButtons?: HeaderButton[];
}

export interface HeaderButton {
    icon: FC<SvgProps>;
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
            className="absolute z-10 w-full px-4"
            style={{paddingTop: insets.top + 16}}
        >
            <View className="flex-row items-start justify-between">
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

                <View className="flex-1 items-center">
                    {logoAction && (
                        <View>
                            <Text className="font-kavoon text-5xl">
                                KYX
                            </Text>
                            <LinearGradient
                                colors={['#F6339A', '#AD46FF']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                                style={{height: 4, alignSelf: 'stretch', marginTop: 4, borderRadius: 50}}
                            />
                        </View>
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
                            <button.icon width={24} height={24} color="#99A1AF" />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}
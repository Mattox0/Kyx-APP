import {FC} from "react";
import {TouchableOpacity, View} from "react-native";
import {Text} from "@/components/ui/Text";
import {SvgProps} from "react-native-svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";

export interface SettingsGroupItem {
    icon: FC<SvgProps>;
    label: string;
    onPress: () => void;
}

interface SettingsGroupProps {
    title: string;
    items: SettingsGroupItem[];
}

export default function SettingsGroup({ title, items }: SettingsGroupProps) {
    return (
        <View className="gap-2">
            <Text className="pl-2 text-lg font-semibold text-gray tracking-widest px-1">
                {title}
            </Text>
            <View className="bg-container border border-border rounded-2xl overflow-hidden">
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={item.onPress}
                        className={`flex-row items-center gap-4 py-4 pl-4 pr-2 ${index < items.length - 1 ? "border-b border-border" : ""}`}
                    >
                        <View className="w-10 h-10 items-center justify-center bg-white/5 rounded-xl">
                            <item.icon width={20} height={20} color="#99A1AF" />
                        </View>
                        <Text className="flex-1 font-medium">{item.label}</Text>
                        <ChevronUpIcon
                            width={30}
                            height={30}
                            color="#99A1AF"
                            style={{transform: [{rotate: '90deg'}]}}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

import {Pressable, TouchableOpacity, View} from "react-native";
import {Text} from "@/components/ui/Text";
import CrossIcon from "@/assets/icons/cross.svg";
import {SettingsSection} from "@/containers/Settings";
import useTranslations from "@/hooks/use-translations";
import {Avatar} from "@/components/avatar";
import PenIcon from "@/assets/icons/pen.svg";
import NoteIcon from "@/assets/icons/note.svg";
import {useRouter} from "expo-router";
import useUser from "@/hooks/use-user";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import SettingsGroup from "@/components/settings/SettingsGroup";

interface SettingsMainProps {
    onNavigate: (section: SettingsSection) => void;
    onClose: () => void;
}

export default function SettingsMain({ onNavigate, onClose }: SettingsMainProps) {
    const i18n = useTranslations();
    const router = useRouter();
    const { hideBottomSheet } = useBottomSheet();
    const { user } = useUser();

    return (
        <View className="flex-1">
            <View className="flex-row items-center justify-center pb-6 border-b-2 border-gray">
                <Text className="text-2xl font-bold">{i18n.t("settings.title")}</Text>
                <TouchableOpacity
                    onPress={onClose}
                    className="absolute top-0 right-0 w-10 h-10 items-center justify-center border border-border bg-white/5 rounded-2xl"
                >
                    <CrossIcon width={16} height={16} color="#99A1AF" />
                </TouchableOpacity>
            </View>

            <View className="items-center justify-center my-4">
                <Pressable
                    onPress={() => {
                        router.push('/create-profile');
                        hideBottomSheet();
                    }}
                    className="relative mb-8"
                >
                    <Avatar options={user?.avatarOptions} />
                    <View className="absolute bottom-0 right-0">
                        <PenIcon width={24} height={24} color="#FFFFFF"/>
                    </View>
                </Pressable>
                {user?.name && (
                    <Text className="font-bold text-2xl">{user?.name}</Text>
                )}
            </View>

            <View className="gap-4 mt-4">
                <SettingsGroup
                    title={i18n.t("settings.game.title")}
                    items={[
                        { icon: NoteIcon, label: i18n.t("settings.game.createQuestion"), onPress: () => onNavigate('createQuestion') },
                    ]}
                />
            </View>
        </View>
    );
}

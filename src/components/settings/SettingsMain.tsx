import {Pressable, View} from "react-native";
import {Text} from "@/components/ui/Text";
import {SettingsSection} from "@/containers/Settings";
import useTranslations from "@/hooks/use-translations";
import {Avatar} from "@/components/avatar";
import PenIcon from "@/assets/icons/pen.svg";
import NoteIcon from "@/assets/icons/note.svg";
import {useRouter} from "expo-router";
import useUser from "@/hooks/use-user";
import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsLayout from "@/components/settings/SettingsLayout";

interface SettingsMainProps {
    onNavigate: (section: SettingsSection) => void;
    onClose: () => void;
}

export default function SettingsMain({ onNavigate, onClose }: SettingsMainProps) {
    const i18n = useTranslations();
    const router = useRouter();
    const { user } = useUser();

    return (
        <SettingsLayout title={i18n.t("settings.title")} onClose={onClose}>
            <View className="items-center justify-center my-4">
                <Pressable
                    onPress={() => router.push('/create-profile')}
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
                        { icon: NoteIcon, label: i18n.t("settings.game.createQuestion"), onPress: () => onNavigate('createQuestion')},
                    ]}
                />
            </View>
        </SettingsLayout>
    );
}

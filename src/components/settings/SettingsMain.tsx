import {Pressable, View} from "react-native";
import {Text} from "@/components/ui/Text";
import {SettingsSection} from "@/containers/Settings";
import useTranslations from "@/hooks/use-translations";
import {Avatar} from "@/components/avatar";
import PenIcon from "@/assets/icons/pen.svg";
import NoteIcon from "@/assets/icons/note.svg";
import StarIcon from "@/assets/icons/star.svg";
import ShareIcon from "@/assets/icons/share.svg";
import ChatIcon from "@/assets/icons/chat.svg";
import PowerIcon from "@/assets/icons/power.svg";
import CrossIcon from "@/assets/icons/cross.svg";
import {useRouter} from "expo-router";
import useUser from "@/hooks/use-user";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsLayout from "@/components/settings/SettingsLayout";
import DeleteAccountSheet from "@/components/settings/DeleteAccountSheet";
import {authClient} from "@/lib/auth";

interface SettingsMainProps {
    onNavigate: (section: SettingsSection) => void;
    onClose: () => void;
}

export default function SettingsMain({ onNavigate, onClose }: SettingsMainProps) {
    const i18n = useTranslations();
    const router = useRouter();
    const { user } = useUser();
    const { showBottomSheet, hideBottomSheet } = useBottomSheet();

    const handleLogout = async () => {
        await authClient.signOut();
        router.replace("/");
    };

    const handleDeleteAccount = () => {
        showBottomSheet(
            <DeleteAccountSheet
                onSuccess={() => {
                    hideBottomSheet();
                    router.replace("/");
                }}
                onCancel={hideBottomSheet}
            />
        );
    };

    return (
        <SettingsLayout title={i18n.t("settings.title")} onClose={onClose}>
            <View className="items-center justify-center my-4">
                <Pressable
                    onPress={() => user ? router.push('/create-profile') : router.push('/auth?redirect=/create-profile')}
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

            <View className="gap-8 mt-4">
                <SettingsGroup
                    title={i18n.t("settings.game.title")}
                    items={[
                        { icon: NoteIcon, label: i18n.t("settings.game.createQuestion"), onPress: () => onNavigate('createQuestion')},
                    ]}
                />

                <SettingsGroup
                    title={i18n.t("settings.app.title")}
                    items={[
                      { icon: StarIcon, label: i18n.t("settings.app.reviewApp"), onPress: () => {}},
                      { icon: ShareIcon, label: i18n.t("settings.app.shareApp"), onPress: () => {}},
                      { icon: ChatIcon, label: i18n.t("settings.app.chatApp"), onPress: () => {}},
                    ]}
                />

                {user && (
                    <SettingsGroup
                        title={i18n.t("settings.account.title")}
                        items={[
                            { icon: PowerIcon, label: i18n.t("settings.account.logout"), onPress: handleLogout },
                            { icon: CrossIcon, label: i18n.t("settings.account.deleteAccount"), onPress: handleDeleteAccount, danger: true },
                        ]}
                    />
                )}
            </View>
        </SettingsLayout>
    );
}

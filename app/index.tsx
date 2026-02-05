import {Page} from "@/containers/Page";
import {Text} from "@/components/ui/Text";
import Logo from "@/components/Logo";
import {Pressable, View} from "react-native";
import Button from "@/components/ui/Button";
import useTranslations from "@/hooks/use-translations";
import {useRouter} from "expo-router";
import {Avatar} from "@/components/avatar";
import useUser from "@/hooks/use-user";
import PenIcon from "@/assets/icons/pen.svg";

export default function Index() {
    const i18n = useTranslations();
    const router = useRouter();
    const { user } = useUser();

    return (
        <Page
            scrollable={true}
            bottomChildren={
                <View className="px-8 flex-col gap-2 pb-2">
                    <View className="px-8 text-center mb-4">
                        <Text className="text-center">{i18n.t("home.text.helperText")}</Text>
                    </View>
                    <Button onPress={() => router.push('/create-game')}>
                        {i18n.t("home.buttons.createParty")}
                    </Button>
                    <Button>
                        {i18n.t("home.buttons.joinParty")}
                    </Button>
                </View>
            }
        >
            <View className="items-center mb-8">
                <Logo />
            </View>
            <View className="items-center justify-center">
                <Pressable onPress={() => router.push('/create-profile')} className="relative mb-8">
                    <Avatar options={user?.avatarOptions} />
                    <View className="absolute bottom-0 right-0">
                        <PenIcon width={24} height={24} color="#FFFFFF"/>
                    </View>
                </Pressable>
                <Text className="font-bold text-2xl">{i18n.t("home.text.welcome", {username: user ? `, ${user?.name}` : ""})}</Text>
            </View>
            <View className="px-8 text-center my-4">
                <Text className="text-center">{i18n.t("home.text.instructions")}</Text>
            </View>
        </Page>
    )
}

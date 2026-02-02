import {Page} from "@/containers/Page";
import {Text} from "@/components/ui/Text";
import Logo from "@/components/Logo";
import {View} from "react-native";
import Button from "@/components/ui/Button";
import useTranslations from "@/hooks/use-translations";
import {useRouter} from "expo-router";

export default function Index() {
    const i18n = useTranslations();
    const router = useRouter();
    return (
        <Page
            scrollable={false}
        >
            <View className="items-center mb-8">
                <Logo/>
            </View>
            <View>
                
                <Text className="font-bold text-2xl">{i18n.t("home.text.welcome", {username: "Leopold"})}</Text>
            </View>
            <View className="px-8 text-center my-4">
                <Text className="text-center">{i18n.t("home.text.instructions")}</Text>
            </View>
            <View className="absolute bottom-0 w-full left-4 px-4 flex-col gap-2">
                <View className="px-8 text-center mb-4">
                    <Text className="text-center">{i18n.t("home.text.helperText")}</Text>
                </View>
                <Button onPress={() => router.replace('/create-profile')}>
                    {i18n.t("home.buttons.createParty")}
                </Button>
                <Button>
                    {i18n.t("home.buttons.joinParty")}
                </Button>
            </View>
        </Page>
    )
}

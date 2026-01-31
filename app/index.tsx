import {Page} from "@/containers/Page";
import {Text} from "@/components/ui/Text";
import Logo from "@/components/Logo";
import {View} from "react-native";
import Button from "@/components/ui/Button";
import useTranslations from "@/hooks/use-translations";

export default function Index() {
    const i18n = useTranslations();
    return (
        <Page
            showSettings
            scrollable={false}
        >
            <View className="items-center mb-8">
                <Logo />
            </View>
            <Text className="font-bold">BRUH</Text>
            <Text className="font-bold">BRUH</Text>
            <View className="absolute bottom-0 w-full left-4 px-4 flex-col gap-2">
                <Button>
                    {i18n.t("home.buttons.createParty")}
                </Button>
                <Button>
                    {i18n.t("home.buttons.joinParty")}
                </Button>
            </View>
        </Page>
    )
}

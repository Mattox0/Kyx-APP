import { Platform, Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import useTranslations from "@/hooks/use-translations";
import GoogleIcon from "@/assets/icons/logos/google.svg";
import AppleIcon from "@/assets/icons/logos/apple.svg";

const socialButtonStyle = (disabled: boolean) => ({
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center" as const,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    opacity: disabled ? 0.5 : 1,
    gap: 10,
});

interface Props {
    onGoogle: () => void;
    onApple: () => void;
    disabled: boolean;
}

export default function SocialButtons({ onGoogle, onApple, disabled }: Props) {
    const i18n = useTranslations();

    return (
        <>
            <View className="flex-row items-center mb-6 px-8">
                <View className="flex-1 h-px bg-white/10" />
                <Text className="text-white/40 text-xs mx-4">{i18n.t("auth.social.divider")}</Text>
                <View className="flex-1 h-px bg-white/10" />
            </View>

            <View className="gap-3 px-8">
                <Pressable onPress={onGoogle} disabled={disabled} style={socialButtonStyle(disabled)}>
                    <GoogleIcon width={20} height={20} />
                    <Text className="font-medium">{i18n.t("auth.social.google")}</Text>
                </Pressable>

                {Platform.OS === "ios" && (
                    <Pressable onPress={onApple} disabled={disabled} style={socialButtonStyle(disabled)}>
                        <AppleIcon width={20} height={20} color="#FFFFFF" />
                        <Text className="font-medium">{i18n.t("auth.social.apple")}</Text>
                    </Pressable>
                )}
            </View>
        </>
    );
}

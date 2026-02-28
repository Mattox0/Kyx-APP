import { TouchableOpacity, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Text } from "@/components/ui/Text";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import useTranslations from "@/hooks/use-translations";
import { authClient } from "@/lib/auth";

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function DeleteAccountSheet({ onSuccess, onCancel }: Props) {
    const i18n = useTranslations();

    const deleteMutation = useMutation({
        mutationFn: () => authClient.deleteUser(),
        onSuccess,
    });

    return (
        <CustomBottomSheet initialIndex={0} backdropPress="none">
            <View className="gap-6 pb-2">
                <View className="gap-2">
                    <Text className="text-xl font-bold text-center">
                        {i18n.t("settings.account.deleteTitle")}
                    </Text>
                    <Text className="text-white/60 text-center leading-5">
                        {i18n.t("settings.account.deleteSubtitle")}
                    </Text>
                </View>

                <View className="gap-3">
                    <TouchableOpacity
                        onPress={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                        className="bg-red/10 border border-red rounded-3xl py-4 items-center"
                        style={{ opacity: deleteMutation.isPending ? 0.5 : 1 }}
                    >
                        <Text className="text-red font-semibold">
                            {i18n.t("settings.account.deleteConfirm")}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onCancel}
                        disabled={deleteMutation.isPending}
                        className="py-4 items-center"
                    >
                        <Text className="text-white/60">
                            {i18n.t("settings.account.deleteCancel")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomBottomSheet>
    );
}

import { View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import type { AnimatedStyle } from "react-native-reanimated";
import { Text } from "@/components/ui/Text";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useTranslations from "@/hooks/use-translations";

interface Props {
    screenWidth: number;
    slideStyle: AnimatedStyle<ViewStyle>;
    email: string;
    onEmailChange: (text: string) => void;
    onEmailBlur: () => void;
    emailError: string | null;
    password: string;
    onPasswordChange: (text: string) => void;
    name: string;
    onNameChange: (text: string) => void;
    fieldError: string | null;
    isLoading: boolean;
    isEmailValid: boolean;
    onLogin: () => void;
    onRegister: () => void;
}

export default function AuthFormSlider({
    screenWidth,
    slideStyle,
    email,
    onEmailChange,
    onEmailBlur,
    emailError,
    password,
    onPasswordChange,
    name,
    onNameChange,
    fieldError,
    isLoading,
    isEmailValid,
    onLogin,
    onRegister,
}: Props) {
    const i18n = useTranslations();

    return (
        <View style={{ width: screenWidth, overflow: "hidden" }}>
            <Animated.View style={[{ flexDirection: "row", width: screenWidth * 2 }, slideStyle]}>

                <View style={{ width: screenWidth }} className="px-8">
                    <View className="mb-6">
                        <Text className="text-2xl font-bold mb-1">{i18n.t("auth.login.title")}</Text>
                        <Text className="text-white/60 text-sm">{i18n.t("auth.login.subtitle")}</Text>
                    </View>
                    <View className="gap-3 mb-6">
                        <Input
                            label={i18n.t("auth.fields.email")}
                            value={email}
                            onChangeText={onEmailChange}
                            onBlur={onEmailBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            editable={!isLoading}
                            error={emailError ?? undefined}
                        />
                        <Input
                            label={i18n.t("auth.fields.password")}
                            value={password}
                            onChangeText={onPasswordChange}
                            secureTextEntry
                            autoComplete="current-password"
                            editable={!isLoading}
                        />
                    </View>
                    {fieldError && (
                        <Text className="text-red text-sm mb-4 text-center">{fieldError}</Text>
                    )}
                    <Button
                        onPress={onLogin}
                        disabled={isLoading || !isEmailValid || !password}
                        className="mb-8"
                    >
                        {i18n.t("auth.login.submit")}
                    </Button>
                </View>

                <View style={{ width: screenWidth }} className="px-8">
                    <View className="mb-6">
                        <Text className="text-2xl font-bold mb-1">{i18n.t("auth.register.title")}</Text>
                        <Text className="text-white/60 text-sm">{i18n.t("auth.register.subtitle")}</Text>
                    </View>
                    <View className="gap-3 mb-6">
                        <Input
                            label={i18n.t("auth.fields.name")}
                            value={name}
                            onChangeText={onNameChange}
                            autoComplete="name"
                            autoCapitalize="words"
                            editable={!isLoading}
                        />
                        <Input
                            label={i18n.t("auth.fields.email")}
                            value={email}
                            onChangeText={onEmailChange}
                            onBlur={onEmailBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            editable={!isLoading}
                            error={emailError ?? undefined}
                        />
                        <Input
                            label={i18n.t("auth.fields.password")}
                            value={password}
                            onChangeText={onPasswordChange}
                            secureTextEntry
                            autoComplete="new-password"
                            editable={!isLoading}
                        />
                    </View>
                    {fieldError && (
                        <Text className="text-red text-sm mb-4 text-center">{fieldError}</Text>
                    )}
                    <Button
                        onPress={onRegister}
                        disabled={isLoading || !isEmailValid || !password || !name}
                        className="mb-8"
                    >
                        {i18n.t("auth.register.submit")}
                    </Button>
                </View>

            </Animated.View>
        </View>
    );
}

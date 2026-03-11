import { useCallback, useState } from "react";
import {
    Platform,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    useWindowDimensions,
} from "react-native";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import Logo from "@/components/Logo";
import AuthTabBar from "@/components/auth/AuthTabBar";
import AuthFormSlider from "@/components/auth/AuthFormSlider";
import SocialButtons from "@/components/auth/SocialButtons";
import { authClient } from "@/lib/auth";
import useTranslations from "@/hooks/use-translations";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";

type Tab = "login" | "register";

export default function AuthScreen() {
    const i18n = useTranslations();
    const router = useRouter();
    const { redirect } = useLocalSearchParams<{ redirect?: string }>();
    const { width: screenWidth } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const [tab, setTab] = useState<Tab>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldError, setFieldError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const tabProgress = useSharedValue(0);

    const loginUnderlineStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
    }));
    const registerUnderlineStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    }));
    const loginLabelStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1], [1, 0.4], Extrapolation.CLAMP),
    }));
    const registerLabelStyle = useAnimatedStyle(() => ({
        opacity: interpolate(tabProgress.value, [0, 1], [0.4, 1], Extrapolation.CLAMP),
    }));
    const slideStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(tabProgress.value, [0, 1], [0, -screenWidth], Extrapolation.CLAMP) }],
    }));

    const switchTab = (next: Tab) => {
        setTab(next);
        setFieldError(null);
        tabProgress.value = withTiming(next === "login" ? 0 : 1, { duration: 400, easing: Easing.out(Easing.cubic) });
    };

    const goBack = useCallback(() => {
        if (router.canGoBack()) router.back();
        else router.push("/");
    }, [router]);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === "object" && "code" in error) {
            const code = (error as { code: string }).code;
            if (code === "INVALID_EMAIL_OR_PASSWORD") return i18n.t("auth.errors.invalidCredentials");
            if (code === "USER_ALREADY_EXISTS") return i18n.t("auth.errors.emailTaken");
        }
        return i18n.t("auth.errors.generic");
    };

    const callbackURL = Constants.expoConfig?.extra?.slug + "://";

    const emailMutation = useMutation({
        onMutate: () => setFieldError(null),
        mutationFn: async () => {
            const result = tab === "login"
                ? await authClient.signIn.email({ email, password })
                : await authClient.signUp.email({ email, password, name });
            if (result.error) throw result.error;
            return result;
        },
        onSuccess: () => router.replace((redirect ?? "/") as Href),
        onError: (error) => setFieldError(getErrorMessage(error)),
    });

    const googleMutation = useMutation({
        onMutate: () => setFieldError(null),
        mutationFn: async () => {
            const result = await authClient.signIn.social({ provider: "google", callbackURL });
            if (result.error) throw result.error;
            return result;
        },
        onSuccess: (result) => {
            if (!result?.data) return;
            router.replace((redirect ?? "/") as Href);
        },
        onError: (error) => setFieldError(getErrorMessage(error)),
    });

    const appleMutation = useMutation({
        onMutate: () => setFieldError(null),
        mutationFn: async () => {
            const result = await authClient.signIn.social({ provider: "apple", callbackURL });
            if (result.error) throw result.error;
            return result;
        },
        onSuccess: (result) => {
            if (!result?.data) return;
            router.replace((redirect ?? "/") as Href);
        },
        onError: (error) => setFieldError(getErrorMessage(error)),
    });

    const isLoading = emailMutation.isPending || googleMutation.isPending || appleMutation.isPending;

    const handleEmailChange = (text: string) => {
        setEmail(text);
        setEmailError(null);
        setFieldError(null);
    };

    const handleEmailBlur = () => {
        if (email && !isValidEmail(email)) {
            setEmailError(i18n.t("auth.errors.invalidEmail"));
        }
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <LinearGradient
                colors={["rgba(10, 14, 39, 0.20)", "rgba(246, 51, 154, 0.20)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            />
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 py-16 justify-center">
                        <View className="items-center mb-12 px-8">
                            <Logo />
                        </View>

                        <AuthTabBar
                            loginLabelStyle={loginLabelStyle}
                            loginUnderlineStyle={loginUnderlineStyle}
                            registerLabelStyle={registerLabelStyle}
                            registerUnderlineStyle={registerUnderlineStyle}
                            onTabPress={switchTab}
                            disabled={isLoading}
                        />

                        <AuthFormSlider
                            screenWidth={screenWidth}
                            slideStyle={slideStyle}
                            name={name}
                            onNameChange={setName}
                            email={email}
                            onEmailChange={handleEmailChange}
                            onEmailBlur={handleEmailBlur}
                            emailError={emailError}
                            password={password}
                            onPasswordChange={(text) => { setPassword(text); setFieldError(null); }}
                            fieldError={fieldError}
                            isLoading={isLoading}
                            onLogin={() => emailMutation.mutate()}
                            onRegister={() => emailMutation.mutate()}
                            isEmailValid={isValidEmail(email)}
                        />

                        <SocialButtons
                            onGoogle={() => googleMutation.mutate()}
                            onApple={() => appleMutation.mutate()}
                            disabled={isLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View
                className="absolute left-4"
                pointerEvents="box-none"
                style={{ paddingTop: insets.top + 16 }}
            >
                <TouchableOpacity
                    onPress={goBack}
                    className="w-10 h-10 items-center justify-center border border-border bg-white/5 rounded-2xl p-7"
                >
                    <ArrowLeftIcon width={24} height={24} color="#99A1AF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

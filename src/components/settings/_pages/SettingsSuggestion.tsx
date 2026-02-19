import {TextInput, View, KeyboardAvoidingView, Platform, Keyboard, ScrollView} from "react-native";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";
import Button from "@/components/ui/Button";
import {Text} from "@/components/ui/Text";
import useTranslations from "@/hooks/use-translations";
import {GameModes} from "@/types/GameMode";
import CheckIcon from "@/assets/icons/check.svg";
import {useRef, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {TanstackQueryKey} from "@/types/TanstackQueryKey";
import {api} from "@/lib/api";
import {Mode} from "@/types/api/Mode";
import CustomSelect from "@/components/ui/CustomSelect";
import SettingsLayout from "@/components/settings/SettingsLayout";
import {LinearGradient} from "expo-linear-gradient";

interface SettingsSuggestionProps {
    onBack: () => void;
    onClose: () => void;
}

export default function SettingsSuggestion({onBack, onClose}: SettingsSuggestionProps) {
    const i18n = useTranslations();
    const scrollRef = useRef<ScrollView>(null);
    const [selectedGame, setSelectedGame] = useState<typeof GameModes[0] | null>(null);
    const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const {isPending: modesPending, data: modes} = useQuery<Mode[]>({
        queryKey: [TanstackQueryKey.MODES, selectedGame?.id],
        queryFn: async () => (await api.get(`/mode/game/${selectedGame?.id}`)).data,
        enabled: !!selectedGame,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const response = await api.post('/suggestion', {
                modeId: selectedMode?.id,
                content: message,
            });
            return response.data;
        },
        onSuccess: () => {
            setMessage('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1000);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleGameSelect = (game: typeof GameModes[0]) => {
        setSelectedGame(game);
        setSelectedMode(null);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <SettingsLayout title={i18n.t("settings.suggestion.title")} onBack={onBack} onClose={onClose}>
                <View style={{flex: 1}}>
                    <ScrollView
                        ref={scrollRef}
                        showsVerticalScrollIndicator={false}
                        className="mt-6"
                        contentContainerStyle={{gap: 16, paddingBottom: 100}}
                        keyboardShouldPersistTaps="handled"
                    >
                        <CustomSelect
                            label={i18n.t("settings.suggestion.gameLabel")}
                            placeholder={i18n.t("settings.suggestion.gamePlaceholder")}
                            options={GameModes}
                            selected={selectedGame}
                            onSelect={handleGameSelect}
                            getLabel={(g) => g.name.replace('\n', ' ')}
                            getId={(g) => g.id}
                        />

                        <CustomSelect
                            label={i18n.t("settings.suggestion.modeLabel")}
                            placeholder={i18n.t("settings.suggestion.modePlaceholder")}
                            options={modes ?? []}
                            selected={selectedMode}
                            onSelect={setSelectedMode}
                            getLabel={(m) => m.name}
                            getId={(m) => m.id}
                            isLoading={!!selectedGame && modesPending}
                            disabled={!selectedGame}
                        />

                        <View className="gap-2">
                            <Text className="text-white text-sm font-medium ml-2">{i18n.t("settings.suggestion.messageLabel")}</Text>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                textAlignVertical="top"
                                placeholder={i18n.t("settings.suggestion.messagePlaceholder")}
                                placeholderTextColor="rgba(153, 161, 175, 0.6)"
                                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 200)}
                                style={{
                                    borderWidth: 1.768,
                                    borderColor: 'rgba(255, 255, 255, 0.10)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 16,
                                    paddingHorizontal: 20,
                                    paddingVertical: 16,
                                    color: 'white',
                                    minHeight: 120,
                                    fontFamily: 'Poppins_400Regular',
                                    fontSize: 14,
                                }}
                            />
                        </View>

                        {showSuccess && (
                            <Animated.View
                                entering={FadeIn.duration(500)}
                                exiting={FadeOut.duration(500)}
                                style={{ alignItems: 'center', marginTop: 5 }}
                            >
                                <LinearGradient
                                    colors={['#E040FB', '#7B2FF7']}
                                    style={{
                                        zIndex: 10,
                                        width: 45,
                                        height: 45,
                                        borderRadius: 28,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: -22,
                                    }}
                                >
                                    <CheckIcon width={24} height={24} color="#FFFFFF" />
                                </LinearGradient>

                                <LinearGradient
                                    colors={['#2D1B69', '#1A1040']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        width: '100%',
                                        borderRadius: 16,
                                        paddingTop: 30,
                                        paddingBottom: 18,
                                        paddingHorizontal: 24,
                                        alignItems: 'center',
                                        gap: 16,
                                        borderWidth: 1.5,
                                        borderColor: '#E040FB',
                                    }}
                                >
                                    <Text className="text-white text-lg font-bold text-center">
                                        {i18n.t("settings.suggestion.successTitle")}
                                    </Text>
                                    <Text className="text-white/70 text-sm text-center">
                                        {i18n.t("settings.suggestion.successSubtitle")}
                                    </Text>
                                </LinearGradient>
                            </Animated.View>
                        )}
                    </ScrollView>

                    <View className="absolute bottom-8 left-0 right-0 pb-2">
                        <Button disabled={!selectedGame || !selectedMode || !message.trim() || isPending} onPress={() => {
                            Keyboard.dismiss();
                            mutate();
                        }}>
                            {isPending ? i18n.t("settings.suggestion.isCreating") : i18n.t("settings.suggestion.submit")}
                        </Button>
                    </View>
                </View>
            </SettingsLayout>
        </KeyboardAvoidingView>
    );
}

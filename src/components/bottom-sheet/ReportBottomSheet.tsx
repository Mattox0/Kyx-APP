import { useEffect, useRef, useState } from "react";
import { Keyboard, Platform, Pressable, View } from "react-native";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetScrollView,
    BottomSheetScrollViewMethods,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import CrossIcon from "@/assets/icons/cross.svg";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import useTranslations from "@/hooks/use-translations";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

const REPORT_OPTIONS = [
    { id: "INAPPROPRIATE_CONTENT", labelKey: "game.report.options.inappropriate" },
    { id: "INCORRECT_TRADUCTION", labelKey: "game.report.options.incorrect" },
    { id: "OFF_TOPIC", labelKey: "game.report.options.offTopic" },
    { id: "OTHER", labelKey: "game.report.options.other" },
] as const;

interface ReportBottomSheetProps {
    questionId: string;
}

export const ReportBottomSheet = ({ questionId }: ReportBottomSheetProps) => {
    const { hideBottomSheet } = useBottomSheet();
    const i18n = useTranslations();
    const { top } = useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
    const textareaY = useRef<number>(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const counterColor =
        comment.length >= 1000
            ? "#FF4D4D"
            : comment.length >= 900
                ? "#FFA500"
                : "rgba(153, 161, 175, 0.6)";

    useEffect(() => {
        const timer = setTimeout(() => {
            bottomSheetRef.current?.expand();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const show = Keyboard.addListener(showEvent, (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: textareaY.current, animated: true });
            }, 150);
        });

        const hide = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const { mutate: createReport, isPending } = useMutation({
        mutationFn: async () => {
            await api.post<void>(`/report`, { questionId: questionId, comment: comment, reason: selectedOption });
        },
        onSuccess: () => {
            hideBottomSheet();
        },
    });

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            pressBehavior="none"
        />
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            topInset={top}
            enablePanDownToClose={false}
            backdropComponent={renderBackdrop}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            animateOnMount
            backgroundStyle={{
                backgroundColor: "#231C38",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}
            handleIndicatorStyle={{ backgroundColor: "#E0E0E0" }}
        >
            <BottomSheetScrollView
                ref={scrollRef}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: 24 + keyboardHeight,
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-row items-center justify-between mb-2 pt-2">
                    <Text className="text-2xl font-bold flex-1 mr-4">
                        {i18n.t("game.report.title")}
                    </Text>
                    <Pressable onPress={hideBottomSheet} hitSlop={12}>
                        <CrossIcon width={20} height={20} color="#FFFFFF" />
                    </Pressable>
                </View>

                <Text className="text-gray mb-6">
                    {i18n.t("game.report.description")}
                </Text>

                <View className="gap-3 mb-6">
                    {REPORT_OPTIONS.map((option) => {
                        const isSelected = selectedOption === option.id;
                        return (
                            <Pressable
                                key={option.id}
                                onPress={() => setSelectedOption(option.id)}
                                className="flex-row items-center gap-3 p-4 rounded-2xl"
                                style={{
                                    borderWidth: 1,
                                    borderColor: isSelected
                                        ? "#AD46FF"
                                        : "rgba(255,255,255,0.10)",
                                    backgroundColor: isSelected
                                        ? "#3B344D"
                                        : "rgba(255,255,255,0.05)",
                                }}
                            >
                                <View
                                    className="w-5 h-5 rounded-full items-center justify-center"
                                    style={{
                                        borderWidth: 2,
                                        borderColor: isSelected
                                            ? "#AD46FF"
                                            : "rgba(153,161,175,0.6)",
                                    }}
                                >
                                    {isSelected && (
                                        <View
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: "#AD46FF" }}
                                        />
                                    )}
                                </View>
                                <Text className="flex-1">
                                    {i18n.t(option.labelKey)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Textarea */}
                <View
                    onLayout={(e) => {
                        textareaY.current = e.nativeEvent.layout.y;
                    }}
                >
                    <Text className="text-white text-sm font-medium ml-2 mb-2">
                        {i18n.t("game.report.informations.label")}
                    </Text>

                    <BottomSheetTextInput
                        placeholder={i18n.t("game.report.placeholder")}
                        placeholderTextColor="rgba(153, 161, 175, 0.6)"
                        multiline
                        value={comment}
                        onChangeText={setComment}
                        maxLength={1000}
                        style={{
                            borderWidth: 1.768,
                            borderColor: "rgba(255,255,255,0.10)",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderRadius: 16,
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                            color: "white",
                            fontSize: 14,
                            textAlignVertical: "top",
                            minHeight: 100,
                        }}
                    />

                    <Text
                        style={{
                            color: counterColor,
                            fontSize: 12,
                            textAlign: "right",
                            marginTop: 6,
                            marginBottom: 24,
                        }}
                    >
                        {comment.length}/1000
                    </Text>

                    <Button onPress={() => createReport()} disabled={!selectedOption || isPending}>
                        {isPending ? i18n.t("game.report.reportIncoming") : i18n.t("game.report.confirm")}
                    </Button>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};
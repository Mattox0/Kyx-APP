import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import { Text } from "@/components/ui/Text";
import { LinearGradient } from "expo-linear-gradient";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RelativePathString, useRouter } from "expo-router";
import GameIcon from "@/assets/icons/game.svg";
import Clipboard from "@react-native-clipboard/clipboard";

export default function JoinGameBottomSheet() {
    const { hideBottomSheet } = useBottomSheet();
    const router = useRouter();
    const [code, setCode] = useState("");
    const inputRef = useRef<TextInput>(null);

    const handleJoin = () => {
        if (code.length < 6) return;
        hideBottomSheet();
        router.push(`/(game-online)/lobby/online?code=${code}` as RelativePathString);
    };

    return (
        <CustomBottomSheet
            initialIndex={0}
            primaryButtonText="Rejoindre"
            primaryButtonDisabled={code.length < 6}
            onPrimaryPress={handleJoin}
        >
            <View className="items-center mb-6">
                <View
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: "rgba(97,95,255,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                    }}
                >
                    <GameIcon width={28} height={28} color="#F6339A" />
                </View>
                <Text className="text-xl font-bold">Rejoindre une partie</Text>
                <LinearGradient
                    colors={["#F6339A", "#AD46FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 3, width: 48, marginTop: 6, borderRadius: 50 }}
                />
            </View>

            <View className="mb-3">
                <Text className="text-white text-sm font-medium ml-2 mb-3">
                    Code de la partie
                </Text>

                <View style={{ position: "relative" }}>
                <BottomSheetTextInput
                    ref={inputRef as never}
                    value={code}
                    onChangeText={(text) => setCode(text.toUpperCase())}
                    autoCapitalize="characters"
                    maxLength={6}
                    onSubmitEditing={handleJoin}
                    caretHidden
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0, zIndex: 1 }}
                />

                <Pressable
                    onPress={() => inputRef.current?.focus()}
                    onLongPress={async () => {
                        const text = await Clipboard.getString();
                        if (text) setCode(text.toUpperCase().slice(0, 6));
                        inputRef.current?.focus();
                    }}
                    style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}
                >
                    {Array.from({ length: 6 }).map((_, i) => {
                        const isActive = i === code.length;
                        const isFilled = i < code.length;
                        return (
                            <View
                                key={i}
                                style={{
                                    width: 44,
                                    height: 54,
                                    borderRadius: 12,
                                    borderWidth: 1.768,
                                    borderColor: isActive
                                        ? "#615FFF"
                                        : isFilled
                                        ? "rgba(97,95,255,0.4)"
                                        : "rgba(255,255,255,0.1)",
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ fontSize: 22, color: "#FFFFFF" }}>
                                    {code[i] || ""}
                                </Text>
                            </View>
                        );
                    })}
                </Pressable>
                </View>
            </View>
        </CustomBottomSheet>
    );
}

import {Pressable, View} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {Text} from "@/components/ui/Text";
import {SvgUri} from "react-native-svg";
import Constants from "expo-constants";
import CheckmarkIcon from "@/assets/icons/checkmark.svg";

interface ModeCardProps {
    name: string;
    description: string;
    image: string;
    selected?: boolean;
    onPress?: () => void;
}

export default function ModeCard({name, description, image, selected = false, onPress}: ModeCardProps) {
    const imageUri = Constants.expoConfig?.extra?.apiUrl + "/" + image;

    return (
        <Pressable onPress={onPress}>
            <View
                className={`border-border border-2 bg-background rounded-2xl px-6 py-2 flex-row items-center gap-4 ${selected ? "border-pink" : "opacity-50"}`}
            >
                <View className="rounded-xl overflow-hidden" style={{width: 80, height: 80}}>
                    <SvgUri uri={imageUri} width={80} height={80} />
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-lg">{name}</Text>
                    <LinearGradient
                        colors={['#F6339A', '#AD46FF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={{height: 4, width: 60, alignSelf: 'stretch', marginTop: 4, borderRadius: 50}}
                    />
                    <Text className="text-gray text-sm mt-3">{description}</Text>
                </View>
                {selected && (
                    <View className="absolute ronded-full -top-4 -right-2 bg-pink border-border border-2 rounded-full p-2">
                        <CheckmarkIcon color="#FFFFFF" width={16} height={16} />
                    </View>
                )}
            </View>
        </Pressable>
    );
}

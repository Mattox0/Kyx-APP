import {Pressable, View} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {Text} from "@/components/ui/Text";

interface ModeCardProps {
    name: string;
    description: string;
    selected?: boolean;
    onPress?: () => void;
}

export default function ModeCard({name, description, selected = false, onPress}: ModeCardProps) {
    return (
        <Pressable onPress={onPress}>
            <View
                className="border-border border-2 rounded-2xl px-4 py-8 flex-row items-center gap-4"
                style={{
                    backgroundColor: selected ? '#2A2344' : '#1A1528',
                }}
            >
                <View
                    className="rounded-xl"
                    style={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#2F3247',
                    }}
                />
                <View className="flex-1">
                    <Text className="font-bold text-2xl">{name}</Text>
                    <LinearGradient
                        colors={['#F6339A', '#AD46FF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={{height: 4, width: 60, alignSelf: 'stretch', marginTop: 4, borderRadius: 50}}
                    />
                    <Text className="text-gray mt-3">{description}</Text>
                </View>
            </View>
        </Pressable>
    );
}

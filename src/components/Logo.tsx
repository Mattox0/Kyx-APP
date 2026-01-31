import {Text} from "@/components/ui/Text";
import {LinearGradient} from "expo-linear-gradient";
import {View} from "react-native";

export default function Logo() {
    return (
        <View className="">
            <Text className="font-kavoon text-7xl">KYX</Text>
            <LinearGradient
                colors={['#F6339A', '#AD46FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{height: 4, alignSelf: 'stretch', marginTop: 4, borderRadius: 50}}
            />
        </View>
    )
}
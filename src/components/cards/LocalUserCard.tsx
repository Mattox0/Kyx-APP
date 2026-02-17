import {Pressable, View} from "react-native";
import {LocalUser} from "@/types/api/User";
import {Text} from "@/components/ui/Text";
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";
import CrossIcon from "@/assets/icons/cross.svg";
import {LinearGradient} from "expo-linear-gradient";
import Animated, {FadeInDown} from "react-native-reanimated";
import {Gender} from "@/types/Gender";
import Switch from "@/components/ui/Switch";

interface LocalUserCardProps {
    user: LocalUser;
    setUser: (localUser: LocalUser, gender: Gender) => void;
    deleteUser: (user: LocalUser) => void;
}

export default function LocalUserCard({ user, setUser, deleteUser }: LocalUserCardProps) {
    const isMale = user.gender === Gender.MALE;

    return (
        <Animated.View entering={FadeInDown.duration(400)} className="flex flex-row items-center border-2 border-border bg-background p-4 rounded-2xl">
            <LinearGradient
                colors={['#F6339A', '#AD46FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 16 }}
            >
                <Text className="text-2xl">{user.name.slice(0, 1)}</Text>
            </LinearGradient>
            <Text className="px-4 flex-1" numberOfLines={1} ellipsizeMode="tail">{user.name}</Text>
            <View className="flex-row items-center gap-1">
                <MaleIcon width={40} height={40} color="#2B7FFF" style={{opacity: isMale ? 1 : 0.5}} />
                <Switch
                    value={!isMale}
                    onChange={(value) => setUser(user, value ? Gender.FEMALE : Gender.MALE)}
                />
                <FemaleIcon width={40} height={40} color="#F6339A" style={{opacity: isMale ? 0.5 : 1}} />
            </View>
            <Pressable onPress={() => deleteUser(user)}>
                <CrossIcon color="#C10007" width={40} height={40} />
            </Pressable>
        </Animated.View>
    )
}
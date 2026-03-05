import Avatar from "../avatar/Avatar";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";
import { OnlineUser } from "@/types/api/User";
import { Gender } from "@/types/Gender";
import CrossIcon from "@/assets/icons/cross.svg";
import CrownIcon from "@/assets/icons/crown.svg";

interface OnlineUserCardProps {
    user: OnlineUser;
    isHost: boolean;
    onDelete: () => void;
    myUserId?: string;
}

export default function OnlineUserCard({ user, myUserId, isHost, onDelete }: OnlineUserCardProps ) {
    return (
        <View
            className="bg-background rounded-2xl border border-border flex-row items-center p-3 gap-2"
        >
            <Avatar options={user.avatarOptions} size={56} />
            <View className="flex-1 flex-row items-center">
                <Text ellipsizeMode="tail" numberOfLines={1} className="font-semibold">{user.name}</Text>
                {user.isHost && (
                    <CrownIcon width={24} height={24} color="#FFDD09" style={{ marginLeft: 4 }} />
                )}
            </View>
            <View
                className="justify-center items-center"
            >
                {user.gender === Gender.MAN
                    ? <MaleIcon width={30} height={30} color="#2B7FFF" />
                    : <FemaleIcon width={30} height={30} color="#F6339A" />
                }
            </View>
            <View>
                {isHost && user.id !== myUserId && (
                    <Pressable onPress={onDelete} hitSlop={10}>
                        <CrossIcon width={30} height={30} color="#FF0000" />
                    </Pressable>
                )}
            </View>
        </View>
    )
}
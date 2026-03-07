import Avatar from "../avatar/Avatar";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";
import { OnlineUser } from "@/types/api/User";
import { Gender } from "@/types/Gender";
import CrossIcon from "@/assets/icons/cross.svg";
import CrownIcon from "@/assets/icons/crown.svg";
import UserAddIcon from "@/assets/icons/user-add.svg";
import UserSendIcon from "@/assets/icons/user-send.svg";
import UserCheckmarkIcon from "@/assets/icons/user-checkmark.svg";

export type FriendStatus = "none" | "sent" | "friend";

interface OnlineUserCardProps {
    user: OnlineUser;
    isHost: boolean;
    onDelete: () => void;
    myUserId?: string;
    friendStatus?: FriendStatus;
    onAddFriend?: () => void;
}

export default function OnlineUserCard({ user, myUserId, isHost, onDelete, friendStatus, onAddFriend }: OnlineUserCardProps) {
    const isMe = user.id === myUserId;

    return (
        <View className="bg-background rounded-2xl border border-border flex-row items-center p-3 gap-2">
            <Avatar options={user.avatarOptions} size={56} />
            <View className="flex-1 flex-row items-center">
                <Text ellipsizeMode="tail" numberOfLines={1} className="font-semibold">{user.name}</Text>
                {user.isHost && (
                    <CrownIcon width={24} height={24} color="#FFDD09" style={{ marginLeft: 4 }} />
                )}
            </View>
            {!isMe && (
                <View className="flex-row items-center gap-2">
                    {friendStatus === "none" && (
                        <Pressable
                            onPress={onAddFriend}
                            style={{
                                width: 36, height: 36, borderRadius: 18,
                                backgroundColor: "rgba(246,51,154,0.12)",
                                borderWidth: 1, borderColor: "rgba(246,51,154,0.3)",
                                alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <UserAddIcon width={20} height={20} color="#F6339A" />
                        </Pressable>
                    )}
                    {friendStatus === "sent" && (
                        <View style={{
                            width: 36, height: 36, borderRadius: 18,
                            backgroundColor: "rgba(173,70,255,0.12)",
                            borderWidth: 1, borderColor: "rgba(173,70,255,0.3)",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <UserSendIcon width={20} height={20} color="#AD46FF" />
                        </View>
                    )}
                    {friendStatus === "friend" && (
                        <View style={{
                            width: 36, height: 36, borderRadius: 18,
                            backgroundColor: "rgba(74,222,128,0.12)",
                            borderWidth: 1, borderColor: "rgba(74,222,128,0.3)",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <UserCheckmarkIcon width={20} height={20} color="#4ADE80" />
                        </View>
                    )}
                </View>
            )}
            <View className="justify-center items-center">
                {user.gender === Gender.MAN
                    ? <MaleIcon width={30} height={30} color="#2B7FFF" />
                    : <FemaleIcon width={30} height={30} color="#F6339A" />
                }
            </View>
            {isHost && !isMe && (
                <Pressable onPress={onDelete} hitSlop={10}>
                    <CrossIcon width={26} height={26} color="#FF0000" />
                </Pressable>
            )}
        </View>
    );
}
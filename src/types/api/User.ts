import {Gender} from "@/types/Gender";
import {AvatarOptions} from "@/components/avatar";

export interface User {
    id: string;
    name: string;
    gender: Gender;
    avatarUrl?: string;
    avatarOptions?: AvatarOptions;
    friendCode: string;
}

export interface LocalUser {
    id: string;
    name: string;
    gender: Gender;
}

export interface OnlineUser extends User {
    socketId: string;
    isHost: boolean;
}

export type GameUser = LocalUser | OnlineUser;
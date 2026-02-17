import {Gender} from "@/types/Gender";
import {AvatarOptions} from "@/components/avatar";

export interface User {
    name: string;
    gender: Gender;
    avatarUrl?: string;
    avatarOptions?: AvatarOptions;
}

export interface LocalUser {
    id: string;
    name: string;
    gender: Gender;
}

export interface OnlineUser extends LocalUser {

}

export type GameUser = LocalUser | OnlineUser;
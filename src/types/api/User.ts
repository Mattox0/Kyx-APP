import {Gender} from "@/types/Gender";
import {AvatarOptions} from "@/components/avatar";

export interface User {
    name: string;
    gender: Gender;
    avatarUrl?: string;
    avatarOptions?: AvatarOptions;
}
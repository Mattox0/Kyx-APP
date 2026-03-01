import { User } from "@/types/api/User";

export interface Friend {
    id: string;
    user: User;
    friend: User;
    createdAt: Date;
}

export interface FriendRequest {
    id: string;
    user: User;
    userRequested: User;
    createdAt: Date;
}

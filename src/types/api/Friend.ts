import { User } from "@/types/api/User";
import { Game } from "@/types/api/Game";

export interface Friend {
    id: string;
    user: User;
    friend: User;
    createdAt: Date;
    currentGame: Game | null;
}

export interface FriendRequest {
    id: string;
    user: User;
    userRequested: User;
    createdAt: Date;
}

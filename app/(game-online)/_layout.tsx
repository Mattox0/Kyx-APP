import { Slot } from "expo-router";
import { GameOnlineProvider } from '@/providers/GameOnlineProvider';

export default function GameOnlineLayout() {
  return (
    <GameOnlineProvider>
      <Slot />
    </GameOnlineProvider>
  );
}

import { useParams } from "react-router-dom";
import { NotFoundView } from "@/components/NotFoundView";
import { PlayerProfileCard } from "@/components/PlayerProfileCard";

export const PlayerProfileCardWrapper = () => {
  const { playerId } = useParams();

  return playerId ? (
    <PlayerProfileCard playerId={playerId} />
  ) : (
    <NotFoundView />
  );
};

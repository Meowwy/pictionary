import { PlayerRow } from "./player-row";

interface Player {
  id: string;
  name: string;
  isLocal: boolean;
}

interface PlayerTableProps {
  players: Player[];
  roomId: string;
}

export function PlayerTable({ players, roomId }: PlayerTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {players.map((player) => (
          <PlayerRow key={player.id} player={player} roomId={roomId} />
        ))}
      </div>
    </div>
  );
}

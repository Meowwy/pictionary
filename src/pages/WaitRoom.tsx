"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayerTable } from "@/components/player-table";
import { AddPlayerModal } from "@/components/add-player-modal";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getDeviceId } from "@/utils/simpleUtils";
import type { Player } from "convex/players";
import type { Id } from "convex/_generated/dataModel";
import { Pencil, MessageSquare, Hand } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  themesDrawingActivityMode,
  themesDrawingSimpleMode,
} from "../../convex/themes";

export default function WaitRoomPage() {
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isLocalPlayer, setisLocalPlayer] = useState(true);
  const navigate = useNavigate();
  const startGame = useMutation(api.game.startGame);
  const generateDrawingPromptsSimple = useAction(
    api.ai.generateDrawingPrompts_simple
  );
  const generateDrawingPromptsActivity = useAction(
    api.ai.generateDrawingPrompts_activity
  );

  // grab parameters from URL
  const { roomId: roomIdString } = useParams<{ roomId: string }>();
  // change the type to Convex id, since it is stored as plaintext in the database
  const roomId = roomIdString ? (roomIdString as Id<"game_rooms">) : undefined;

  const room = useQuery(api.rooms.getRoomForId, roomId ? { roomId } : "skip");
  const game = useQuery(
    api.game.getGameByRoomId,
    room
      ? {
          roomId: room._id as Id<"game_rooms">,
        }
      : "skip"
  );
  /*   const roomName = location.state?.roomName;
  const room =
    useQuery(api.rooms.getRoomByRoomName, { roomName: roomName }) ?? null; */
  /*const playersData =
    useQuery(
      api.rooms.getPlayersInRoom,
      room
        ? { roomId: room._id as Id<"game_rooms"> }
        : { roomId: "" as Id<"game_rooms"> }
    ) ?? [];*/
  useEffect(() => {
    if (game) {
      navigate(`/game/${game._id}`);
    }
  }, [game]);

  const playersData =
    useQuery(
      api.rooms.getPlayersInRoom,
      room ? { roomId: room._id as Id<"game_rooms"> } : "skip"
    ) ?? [];

  if (!room || !playersData) return <p>Loading...</p>;

  type PlayersForWaitList = {
    id: string;
    name: string;
    isLocal: boolean;
  };

  let players: Player[] = playersData as Player[];
  let playersForWaitList: PlayersForWaitList[] = [];
  if (players.length > 0) {
    playersForWaitList = players.map((player) => {
      return {
        id: player._id,
        name: player.nickname,
        isLocal: player.deviceId === getDeviceId(),
      };
    });
  }

  const localPlayer: Player | undefined = players.find(
    (player) => player.deviceId === getDeviceId()
  );

  // kick player out if they don't belong to the room
  // doesn't work
  /*
  useEffect(() => {
    if (playersData && playersData.length > 0 && !localPlayer) {
      setisLocalPlayer(false);
    }
  }, [playersData, localPlayer]);

  useEffect(() => {
    if (!isLocalPlayer) {
      navigate("/", { replace: true });
    }
  }, [isLocalPlayer, navigate]);*/

  const canStartGame = players.length >= 2;

  const handleStartGame = async () => {
    console.log("Starting game...");
    const gameId = await startGame({
      roomId: room?._id as Id<"game_rooms">,
    });
    await generateDrawingPromptsSimple({
      game_id: gameId,
      themes: themesDrawingSimpleMode,
    });
    await generateDrawingPromptsActivity({
      game_id: gameId,
      themes: themesDrawingActivityMode,
    });
    console.log("Prompts generation started");

    navigate(`/game/${gameId}`);
  };
  /*
  useEffect(() => {
    if (game) {
      navigate(`/game/${game._id}`);
    }
  }, [game]);*/

  const renderGameIcon = () => {
    switch (room?.gameMode) {
      case "drawing":
        return <Pencil className="w-8 h-8 md:w-10 md:h-10" />;
      case "describing":
        return <MessageSquare className="w-8 h-8 md:w-10 md:h-10" />;
      case "pantomime":
        return <Hand className="w-8 h-8 md:w-10 md:h-10" />;
      default:
        return <Pencil className="w-8 h-8 md:w-10 md:h-10" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="text-gray-800 dark:text-white">
              {renderGameIcon()}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              {room?.name}
            </h1>
            <div className="text-gray-800 dark:text-white">
              {renderGameIcon()}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              We're waiting for everybody to join. Administrator then can start
              the game!
            </p>
          </div>
        </div>

        {/* Players Table */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Players ({playersForWaitList.length})
          </h2>
          <PlayerTable
            players={playersForWaitList}
            roomId={room?._id as Id<"game_rooms">}
          />
        </div>

        {/* Add Player Section */}
        <div className="bg-blue-900 dark:bg-blue-950 rounded-lg p-6 shadow-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-3">
              Playing on the same device?
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Add another player to join from this device
            </p>
            <Button
              onClick={() => setIsAddPlayerModalOpen(true)}
              variant="secondary"
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-100 font-semibold"
            >
              Add Local Player
            </Button>
          </div>
        </div>

        {/* Start Game Button */}
        {localPlayer?.admin && (
          <div className="mt-8">
            <button
              onClick={handleStartGame}
              disabled={!canStartGame}
              className={`w-full py-6 px-6 rounded-lg text-lg font-bold transition-all duration-200 ${
                canStartGame
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white border-2 border-orange-500 text-orange-500 cursor-not-allowed"
              }`}
            >
              {canStartGame
                ? "When ready, press to start the game!"
                : "Waiting for at least one other player to join"}
            </button>
          </div>
        )}

        {/* Add Player Modal */}
        <AddPlayerModal
          isOpen={isAddPlayerModalOpen}
          roomId={room ? room._id : null}
          onClose={() => setIsAddPlayerModalOpen(false)}
        />
      </div>
    </div>
  );
}

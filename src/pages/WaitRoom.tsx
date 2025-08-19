"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayerTable } from "@/components/player-table";
import { AddPlayerModal } from "@/components/add-player-modal";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getDeviceId } from "@/utils/simpleUtils";
import type { Player } from "convex/players";

export default function WaitRoomPage() {
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const location = useLocation();

  const roomName = location.state?.roomName;
  const room =
    useQuery(api.rooms.getRoomByRoomName, { roomName: roomName }) ?? null;
  const playersData =
    useQuery(
      api.rooms.getPlayersInRoom,
      room ? { roomId: room._id } : { roomId: "" as any }
    ) ?? [];

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
  } // error ',' expected

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Waiting Room
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Welcome to "Fun Drawing Room"! We're waiting for more players to
              join. Get ready to draw and guess some amazing pictures!
            </p>
          </div>
        </div>

        {/* Players Table */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Players ({playersForWaitList.length})
          </h2>
          <PlayerTable players={playersForWaitList} />
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

"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateRoomModal } from "@/components/create-room-modal";
import { JoinRoomModal } from "@/components/join-room-modal";
import { RoomCard } from "@/components/room-card";
import { Users } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getDeviceId } from "@/utils/simpleUtils";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<
    (typeof roomsForCard)[0] | null
  >(null);
  const navigate = useNavigate();

  // check if the device already is in a room
  let localPlayer =
    useQuery(api.players.getlocalPlayerForRouting, {
      deviceId: getDeviceId(),
    }) ?? null;
  useEffect(() => {
    if (localPlayer) {
      navigate(`/waitRoom/${localPlayer.room_id}`);
    }
  }, [localPlayer, navigate]);

  // get created rooms
  let rooms = useQuery(api.rooms.getRooms) ?? [];

  let players = useQuery(api.rooms.getPlayers) ?? [];

  type RoomForCard = {
    _id: string;
    name: string;
    hasPassword: boolean;
    playerCount: number;
  };

  let roomsForCard: RoomForCard[] = [];
  if (rooms.length > 0) {
    roomsForCard = rooms.map((room) => {
      const playerCount = players.filter(
        (player) => player.room_id === room._id
      ).length;
      return {
        _id: room._id,
        name: room.name,
        playerCount: playerCount,
        hasPassword: room.password === undefined ? false : true,
      };
    });
  }

  const handleJoinRoom = (room: (typeof roomsForCard)[0]) => {
    setSelectedRoom(room);
    setIsJoinModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            Pictionary Game
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Draw, guess, and have fun with friends!
          </p>
        </div>

        {/* Create Room Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="lg"
            className="px-8 py-3 text-lg font-semibold"
          >
            Create New Room
          </Button>
        </div>

        {/* Available Rooms */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Available Rooms
          </h2>
          {/* If no rooms created */}
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md mx-auto border border-white/20 dark:border-gray-700/20">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No rooms available
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  There are currently no game rooms created. Be the first to
                  start a new room and invite your friends to play!
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2"
                >
                  Create Your First Room
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-0">
              {roomsForCard.map((room) => (
                <RoomCard room={room} onJoin={() => handleJoinRoom(room)} />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        <JoinRoomModal
          isOpen={isJoinModalOpen}
          onClose={() => {
            setIsJoinModalOpen(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { LeaveGameModal } from "@/components/leave-game-modal";

// Mock data for game state
const currentDrawer = "Paul";
const drawingCategory = "an animal";

const mockPlayers = [
  {
    id: "1",
    name: "Alice Johnson",
    score: 85,
    isLocal: true,
    hasBestScore: false,
  },
  { id: "2", name: "Paul", score: 92, isLocal: false, hasBestScore: true },
  {
    id: "3",
    name: "Charlie Brown",
    score: 78,
    isLocal: true,
    hasBestScore: false,
  },
  {
    id: "4",
    name: "Diana Prince",
    score: 81,
    isLocal: false,
    hasBestScore: false,
  },
];

export default function GamePage() {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const handleLeaveGame = () => {
    console.log("Leaving game...");
    // Leave game logic will go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Current Drawer Card */}
        <div className="bg-orange-500 rounded-lg p-6 shadow-lg mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="flex-1 h-px bg-white"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mx-4">
                {currentDrawer}
              </h2>
              <div className="flex-1 h-px bg-white"></div>
            </div>
            <p className="text-white text-lg md:text-xl">
              is drawing {drawingCategory}
            </p>
          </div>
        </div>

        {/* Players Scoreboard */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {mockPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center p-4 border-b border-black/20 dark:border-white/20 last:border-b-0"
              >
                {/* Order Number */}
                <div className="w-8 text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {index + 1}.
                </div>

                {/* Player Name with Crown and Mobile Icon */}
                <div className="flex-1 flex items-center justify-center gap-2">
                  {player.hasBestScore && (
                    <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                  <div className="flex items-center gap-1">
                    <span className="text-lg text-gray-800 dark:text-white">
                      {player.name}
                    </span>
                    {index === 0 && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 font-light">
                        {" "}
                        will draw next
                      </span>
                    )}
                    {player.isLocal && (
                      <svg
                        className="w-4 h-4 text-blue-500 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v14H7V4zm2 15h6v1H9v-1z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="w-16 text-right">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {player.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Game Button */}
        <div className="mt-8">
          <Button
            onClick={() => setIsLeaveModalOpen(true)}
            variant="destructive"
            size="default"
            className="py-3 px-6 text-base font-semibold"
          >
            Leave Game
          </Button>
        </div>

        {/* Leave Game Confirmation Modal */}
        <LeaveGameModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={handleLeaveGame}
          playerName="You"
        />
      </div>
    </div>
  );
}

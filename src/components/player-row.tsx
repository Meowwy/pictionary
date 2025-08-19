"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LeaveGameModal } from "./leave-game-modal"

interface Player {
  id: string
  name: string
  isLocal: boolean
}

interface PlayerRowProps {
  player: Player
}

export function PlayerRow({ player }: PlayerRowProps) {
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  const handleLeaveGame = () => {
    setShowLeaveModal(true)
  }

  const handleConfirmLeave = () => {
    console.log(`Player ${player.name} leaving game`)
    setShowLeaveModal(false)
    // Here you would add the actual leave game logic
  }

  return (
    <>
      <div
        className={`flex items-center justify-between p-4 ${
          player.isLocal ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : "bg-white dark:bg-gray-800"
        }`}
      >
        <div className="flex-1">
          <p
            className={`text-lg ${
              player.isLocal
                ? "font-bold text-blue-900 dark:text-blue-100"
                : "font-medium text-gray-800 dark:text-gray-200"
            }`}
          >
            {player.name}
            {player.isLocal && <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-300">(You)</span>}
          </p>
        </div>

        {player.isLocal && (
          <Button
            onClick={handleLeaveGame}
            variant="destructive"
            size="sm"
            className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Leave Game
          </Button>
        )}
      </div>

      <LeaveGameModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleConfirmLeave}
        playerName={player.name}
      />
    </>
  )
}

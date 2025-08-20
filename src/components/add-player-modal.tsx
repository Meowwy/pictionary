"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getDeviceId } from "@/utils/simpleUtils";
import type { Id } from "convex/_generated/dataModel";

interface AddPlayerModalProps {
  isOpen: boolean;
  roomId: string | null;
  onClose: () => void;
}

export function AddPlayerModal({
  isOpen,
  onClose,
  roomId,
}: AddPlayerModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addPlayer = useMutation(api.rooms.joinRoom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding local player:", playerName);
    if (!roomId) return;

    const result = await addPlayer({
      nickname: playerName,
      password: true,
      deviceId: getDeviceId(),
      roomId: roomId as Id<"game_rooms">,
    });

    if (result === "player already exists") {
      setError(
        "Player with this name already is in the room. Choose different name."
      );
    } else {
      setPlayerName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Local Player
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-sm font-medium">
              Player Name
            </Label>
            <Input
              id="playerName"
              type="text"
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!playerName.trim()}
            >
              Add Player
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}

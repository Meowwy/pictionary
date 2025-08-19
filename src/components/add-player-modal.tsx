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
import { api } from "convex/_generated/api";
import type { Room } from "convex/rooms";
import { getDeviceId } from "@/utils/simpleUtils";
import type { Id } from "convex/_generated/dataModel";

interface AddPlayerModalProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
}

export function AddPlayerModal({ isOpen, onClose, room }: AddPlayerModalProps) {
  const [playerName, setPlayerName] = useState("");

  const addPlayer = useMutation(api.rooms.joinRoom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding local player:", playerName);
    // Add player logic would go here
    if (!room) return;

    void addPlayer({
      nickname: playerName,
      password: true,
      deviceId: getDeviceId(),
      roomId: room._id as Id<"game_rooms">,
    });
    setPlayerName("");
    onClose();
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
      </DialogContent>
    </Dialog>
  );
}

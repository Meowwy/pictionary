"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface Room {
  _id: string;
  name: string;
  hasPassword: boolean;
  playerCount: number;
}

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export function JoinRoomModal({ isOpen, onClose, room }: JoinRoomModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle joining room logic here
    console.log("Joining room:", {
      roomId: room?._id,
      playerName,
      password: room?.hasPassword ? password : null,
    });
    onClose();
  };

  const handleClose = () => {
    setPlayerName("");
    setPassword("");
    onClose();
  };

  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Join Room
            {room.hasPassword && <Lock className="h-4 w-4 text-gray-500" />}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="font-medium text-gray-900 dark:text-white">
            {room.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {room.playerCount} player{room.playerCount !== 1 ? "s" : ""}{" "}
            currently playing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="join-player-name">Your Name</Label>
            <Input
              id="join-player-name"
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </div>

          {room.hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="join-password">Room Password</Label>
              <Input
                id="join-password"
                type="password"
                placeholder="Enter room password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Join Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

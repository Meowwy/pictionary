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
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const createRoom = useMutation(api.rooms.createRoom);

  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("room-name") as string;
    const player = formData.get("player-name") as string;
    const password = formData.get("password") as string;*/

    // because I keep the content of the form in the React state, I can just pass the variables
    void createRoom({
      name: roomName,
      password: usePassword ? password : undefined,
      player: playerName,
    });
    onClose();
    setRoomName(""); // reseting the form, because we use react state to get the values
    setPlayerName("");
    setPassword("");
  };

  const handleClose = () => {
    setRoomName("");
    setPlayerName("");
    setPassword("");
    setUsePassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Room
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              name="room-name"
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="player-name">Your Name</Label>
            <Input
              id="player-name"
              name="player-name"
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-password"
              checked={usePassword}
              onCheckedChange={(checked) => setUsePassword(checked as boolean)}
            />
            <Label htmlFor="use-password">Protect with password</Label>
          </div>

          {usePassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="text"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={usePassword}
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
              Create Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

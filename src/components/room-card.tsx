import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Users } from "lucide-react";
import type { Room } from "convex/rooms";

interface RoomCardProps {
  room: Room;
  onJoin: () => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer mx-2 sm:mx-0"
      onClick={onJoin}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-card-foreground truncate pr-2">
            {room.name}
          </h3>
          {room.hasPassword && (
            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {room.playerCount} player{room.playerCount !== 1 ? "s" : ""}
            </span>
          </div>

          <Button
            size="sm"
            className="px-4 pointer-events-none"
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
          >
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeaveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  playerName: string;
}

export function LeaveGameModal({
  isOpen,
  onClose,
  onConfirm,
  playerName,
}: LeaveGameModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Game?</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{playerName}</strong> from
            the room?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto bg-transparent"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Leave Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

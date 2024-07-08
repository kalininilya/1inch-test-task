import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react"; // Import the delete icon

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: string[];
  setTokens: (tokens: string[]) => void;
}

export default function SettingsDialog({
  isOpen,
  onClose,
  tokens,
  setTokens,
}: SettingsDialogProps) {
  const [newToken, setNewToken] = useState("");

  const addToken = () => {
    if (newToken && !tokens.includes(newToken)) {
      setTokens([...tokens, newToken]);
      setNewToken("");
    }
  };

  const deleteToken = (token: string) => {
    setTokens(tokens.filter((t) => t !== token));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] text-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Token List</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {tokens.map((token, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{token}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteToken(token)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              placeholder="New token contract"
              className="bg-[#334155] text-white placeholder:text-[#CBD5E1] rounded-md px-4 py-2"
            />
            <Button onClick={addToken} className="text-white">
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

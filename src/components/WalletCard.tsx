import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Settings } from "lucide-react";

interface WalletProps {
  address: string;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isWalletConnected: boolean;
  onSendClick: () => void;
  onSettingsClick: () => void;
}

export default function Wallet({
  address,
  onAddressChange,
  connectWallet,
  disconnectWallet,
  isWalletConnected,
  onSendClick,
  onSettingsClick,
}: WalletProps) {
  return (
    <Card className="relative w-[480px] h-[240px] bg-[#1E293B] border-[#6366F1] rounded-2xl overflow-hidden">
      <div className="relative z-10 h-full w-full p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <Avatar className="w-12 h-12 border-2 border-[#6366F1]">
            <AvatarImage src="/logo.svg" />
          </Avatar>
          <div className="text-right">
            <div className="text-sm text-[#CBD5E1]">1inch test task</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            value={address}
            placeholder="Wallet Address"
            onChange={onAddressChange}
            className="bg-[#334155] text-white placeholder:text-[#CBD5E1] rounded-md px-4 py-2"
            disabled={isWalletConnected}
          />
          <div className="flex justify-between">
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#CBD5E1] hover:text-white"
                onClick={onSendClick}
              >
                <Send className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#CBD5E1] hover:text-white"
                onClick={onSettingsClick}
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>
            <Button
              onClick={isWalletConnected ? disconnectWallet : connectWallet}
              className="px-4 py-2 rounded-md text-white"
            >
              {isWalletConnected ? "Disconnect" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

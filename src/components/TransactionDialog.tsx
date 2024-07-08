import React, { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ethers.providers.Web3Provider | null;
  isWalletConnected: boolean;
}

export default function TransactionDialog({
  isOpen,
  onClose,
  provider,
  isWalletConnected,
}: TransactionDialogProps) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleTransactionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (provider && isWalletConnected) {
      try {
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
          to,
          value: ethers.utils.parseEther(amount),
        });
        await tx.wait();
        toast({
          title: "Transaction successful!",
          description: "Your transaction has been successfully sent.",
        });
        onClose();
      } catch (error) {
        console.error("Transaction failed:", error);
        toast({
          title: "Transaction failed!",
          description: "An error occurred while processing the transaction.",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleTransactionSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">To Address</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipient address"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Amount (ETH)
            </label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
            />
          </div>
          <Button type="submit">Send transaction</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

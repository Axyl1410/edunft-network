"use client";

import getThirdwebContract from "@/services/get-contract";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { toast } from "sonner";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

interface EditFormProps {
  address: string;
}

export function EditForm({ address }: EditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newOwner, setNewOwner] = useState("");

  const contract = getThirdwebContract(address);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Set new Owner</Label>
        <div className="flex items-center gap-2">
          <Input
            placeholder="New owner address"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <TransactionButton
            transaction={() => {
              const tx = prepareContractCall({
                contract,
                method: "function setOwner(address _newOwner)",
                params: [newOwner],
              });

              return tx;
            }}
            onTransactionConfirmed={() => {
              setIsLoading(false);
              setNewOwner("");
            }}
            onError={() => {
              setIsLoading(false);
              toast.error("Failed to update owner");
            }}
            disabled={isLoading}
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "8px",
              paddingBottom: "8px",
              height: "36px",
            }}
          >
            Update
          </TransactionButton>
        </div>
      </div>
    </div>
  );
}

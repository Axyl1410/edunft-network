"use client";

import TransactionDialog, {
  TransactionStep,
} from "@/components/wallet/transaction-dialog";
import getThirdwebContract from "@/services/get-contract";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useRouter } from "next/navigation";
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

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

              setIsOpen(true);
              setCurrentStep("sent");

              return tx;
            }}
            onTransactionSent={() => {
              setCurrentStep("confirmed");
            }}
            onTransactionConfirmed={() => {
              setCurrentStep("success");
              setMessage("Transaction is being confirmed...");
              setIsLoading(false);
              toast.success("Owner updated successfully");
              router.push(`/explore/${address}`);
            }}
            onError={(error) => {
              setIsLoading(false);
              setCurrentStep("error");
              setMessage("Transaction failed: " + error.message);
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
      <TransactionDialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        currentStep={currentStep}
        title="Transaction Status"
        message={message}
      />
    </div>
  );
}

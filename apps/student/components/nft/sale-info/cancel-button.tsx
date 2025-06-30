import TransactionDialog, {
  TransactionStep,
} from "@/components/wallet/transaction-dialog";
import { MARKETPLACE } from "@/lib/thirdweb";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { cancelListing } from "thirdweb/extensions/marketplace";
import { TransactionButton } from "thirdweb/react";

interface CancelButtonProps {
  id?: bigint;
}

const CancelButton: React.FC<CancelButtonProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");
  const router = useRouter();

  if (id === undefined) return null;

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  return (
    <>
      <TransactionButton
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");
          return cancelListing({
            contract: MARKETPLACE,
            listingId: id,
          });
        }}
        onTransactionSent={() => {
          setCurrentStep("confirmed");
        }}
        onError={(error) => {
          setCurrentStep("error");
          setMessage(error.message);
        }}
        onTransactionConfirmed={(txResult) => {
          setCurrentStep("success");
          console.log(txResult);
          router.refresh();
        }}
      >
        Cancel Listing
      </TransactionButton>
      <TransactionDialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        currentStep={currentStep}
        title="Transaction Status"
        message={message}
      />
    </>
  );
};

export default CancelButton;

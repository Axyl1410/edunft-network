"use client";

import TransactionDialog, {
  TransactionStep,
} from "@/components/wallet/transaction-dialog";
import { MARKETPLACE } from "@/lib/thirdweb";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NFT as NFTType } from "thirdweb";
import { createListing } from "thirdweb/extensions/marketplace";
import { TransactionButton } from "thirdweb/react";

export default function DirectListingButton({
  nft,
  pricePerToken,
  address,
}: {
  nft: NFTType;
  pricePerToken: string;
  address: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  return (
    <>
      <TransactionButton
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");
          return createListing({
            contract: MARKETPLACE,
            assetContractAddress: address,
            tokenId: nft.id,
            pricePerToken,
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
          router.push(`/token/${address}/${nft.id.toString()}`);
        }}
      >
        List for Sale
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
}

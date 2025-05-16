"use client";

import TransactionDialog, {
  TransactionStep,
} from "@/components/wallet/transaction-dialog";
import { baseUrl } from "@/lib/client";
import { MARKETPLACE } from "@/lib/thirdweb";
import getMetadata from "@/services/get-metadata";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { buyFromListing, DirectListing } from "thirdweb/extensions/marketplace";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

type Props = {
  directListing?: DirectListing;
  contractAddress: string;
  tokenId: string;
};

export default function BuyListingButton({
  directListing,
  contractAddress,
  tokenId,
}: Props) {
  const account = useActiveAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  const handle = async () => {
    try {
      const metadataResult = await getMetadata(contractAddress);

      await Promise.all([
        axios.post(`${baseUrl}/collections/${account?.address}/holders`, {
          Address: contractAddress,
          TokenId: tokenId,
          name_collection: metadataResult.name,
        }),
        axios.delete(`${baseUrl}/collections/${account?.address}/holders`, {
          data: {
            Address: contractAddress,
            TokenId: tokenId,
          },
        }),
      ])
        .then(() => toast("Collection created successfully"))
        .catch((error) =>
          toast.error("Failed to create collection", {
            description: error instanceof Error ? error.message : undefined,
          }),
        );
    } catch (error) {
      toast.error("Failed to create collection", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const isDisabled =
    account?.address === directListing?.creatorAddress ||
    !directListing ||
    !account;

  return (
    <>
      <TransactionButton
        disabled={isDisabled}
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");
          if (!account) throw new Error("No account");
          if (directListing) {
            return buyFromListing({
              contract: MARKETPLACE,
              listingId: directListing.id,
              recipient: account.address,
              quantity: BigInt(1),
            });
          } else {
            throw new Error("No valid listing found for this NFT");
          }
        }}
        onTransactionSent={() => {
          setCurrentStep("confirmed");
        }}
        onError={(error) => {
          setCurrentStep("error");
          setMessage(error.message);
        }}
        onTransactionConfirmed={() => {
          handle();
          setCurrentStep("success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }}
      >
        Buy Now
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

"use client";

import { thirdwebClient } from "@/lib/thirdweb";
import getThirdwebContract from "@/services/get-contract";
import Loading from "@workspace/ui/components/loading";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer, useReadContract } from "thirdweb/react";

type Props = {
  address: string;
};

const DropdownCard: React.FC<Props> = ({ address }) => {
  const contract = getThirdwebContract(address);

  if (!contract) notFound();

  const {
    data: metadata,
    isLoading,
    error,
  } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex h-24 w-full items-center px-4">
      <div className="grid aspect-square h-16 w-16 place-items-center overflow-hidden rounded-md bg-gray-200 dark:bg-neutral-800">
        {metadata?.image ? (
          <MediaRenderer
            src={metadata.image}
            client={thirdwebClient}
            className="aspect-square h-full w-full object-cover object-center"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gray-200">
            <Image src={"/default-image.jpg"} alt="" height={300} width={300} />
          </div>
        )}
      </div>

      <p className="ml-4 text-sm/6 font-bold">{metadata?.name}</p>
    </div>
  );
};

export default DropdownCard;

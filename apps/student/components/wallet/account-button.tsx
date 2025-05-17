import { formatAddress } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { Blobbie } from "thirdweb/react";

interface User {
  profilePicture?: string;
}

export function AccountButton({
  user,
  address,
  onClick,
}: {
  user?: User;
  address: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant={"outline"}
      onClick={onClick}
      className="flex cursor-pointer items-center dark:bg-transparent"
    >
      {user?.profilePicture ? (
        <SkeletonImage
          src={user.profilePicture}
          alt="Avatar"
          width={24}
          height={24}
          rounded="rounded-full"
          className="mr-1 size-6 rounded-full"
        />
      ) : (
        <Blobbie address={address} className="mr-1 size-6 rounded-full" />
      )}
      {formatAddress(address)}
    </Button>
  );
}

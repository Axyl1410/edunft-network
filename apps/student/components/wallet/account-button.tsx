import { formatAddress } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { memo, useCallback } from "react";
import { Blobbie } from "thirdweb/react";

interface User {
  profilePicture?: string;
}

interface AccountButtonProps {
  user?: User;
  address: string;
  onClick: () => void;
}

const AccountButton = memo(({ user, address, onClick }: AccountButtonProps) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <Button
      variant={"outline"}
      onClick={handleClick}
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
});

AccountButton.displayName = "AccountButton";

export { AccountButton };

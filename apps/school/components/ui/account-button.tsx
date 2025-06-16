import { formatAddress } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { memo, useCallback } from "react";
import { Blobbie } from "thirdweb/react";

interface AccountButtonProps {
  address: string;
  onClick: () => void;
}

const AccountButton = memo(({ address, onClick }: AccountButtonProps) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <Button
      variant={"outline"}
      onClick={handleClick}
      className="flex cursor-pointer items-center dark:bg-transparent"
    >
      <Blobbie address={address} className="mr-1 size-6 rounded-full" />
      {formatAddress(address)}
    </Button>
  );
});

AccountButton.displayName = "AccountButton";

export { AccountButton };

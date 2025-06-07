import { Button } from "@workspace/ui/components/button";
import { memo, useCallback } from "react";

interface ConnectButtonProps {
  onClick: () => void;
}

const ConnectButton = memo(({ onClick }: ConnectButtonProps) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <Button onClick={handleClick} className="cursor-pointer">
      Connect
    </Button>
  );
});

ConnectButton.displayName = "ConnectButton";

export { ConnectButton };

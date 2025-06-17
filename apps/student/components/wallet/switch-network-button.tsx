import { Button } from "@workspace/ui/components/button";
import { memo, useCallback } from "react";

interface SwitchNetworkButtonProps {
  onClick: () => void;
}

const SwitchNetworkButton = memo(({ onClick }: SwitchNetworkButtonProps) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return <Button onClick={handleClick}>Switch network</Button>;
});

SwitchNetworkButton.displayName = "SwitchNetworkButton";

export { SwitchNetworkButton };

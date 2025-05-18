import { Button } from "@workspace/ui/components/button";

export function SwitchNetworkButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="cursor-pointer">
      Switch network
    </Button>
  );
}

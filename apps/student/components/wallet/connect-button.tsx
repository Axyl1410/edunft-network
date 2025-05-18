import { Button } from "@workspace/ui/components/button";

export function ConnectButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="cursor-pointer">
      Connect
    </Button>
  );
}

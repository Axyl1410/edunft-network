import { TextShimmer } from "@workspace/ui/components/text-shimmer";
import { cn } from "@workspace/ui/lib/utils";

interface LoadingProps {
  className?: string;
  duration?: number;
  text?: string;
  spread?: number;
}

export default function Loading(props: LoadingProps) {
  return (
    <TextShimmer
      className={cn("font-mono text-sm", props.className)}
      duration={props.duration || 1}
      spread={props.spread || 2}
    >
      {props.text || "Loading..."}
    </TextShimmer>
  );
}

"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { useState } from "react";

interface SkeletonImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  rounded?: string;
}

export function SkeletonImage({
  src,
  alt = "",
  className = "",
  width = "100%",
  height = "100%",
  rounded = "rounded-lg",
}: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ width, height }}
    >
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ display: loaded ? "block" : "none" }}
      />
    </div>
  );
}

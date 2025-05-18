"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface BackButtonProps {
  to?: string;
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "link"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export const BackButton: React.FC<BackButtonProps> = ({
  to,
  className = "",
  children,
  variant = "default",
}) => {
  if (to) {
    return (
      <Button asChild className={className} variant={variant}>
        <Link href={to} prefetch={false}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {children || "Back"}
        </Link>
      </Button>
    );
  }
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.history.back();
  };
  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant}
      className={className}
    >
      <ArrowLeft className="mr-1 h-4 w-4" />
      {children || "Back"}
    </Button>
  );
};

export default BackButton;

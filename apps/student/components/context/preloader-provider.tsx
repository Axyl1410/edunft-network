"use client";

import { cn } from "@workspace/ui/lib/utils";
import React, { useEffect, useState } from "react";
import Preloader from "../common/preloader";

const PreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [hidePreloader, setHidePreloader] = useState(false);

  useEffect(() => {
    const minimumDisplayTime = 1000;
    const startTime = Date.now();
    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = minimumDisplayTime - elapsedTime;
      if (remainingTime > 0) {
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => {
            setShowPreloader(false);
            setTimeout(() => {
              setShowContent(true);
              setHidePreloader(true);
            }, 500);
          }, 100);
        }, remainingTime);
      } else {
        setIsLoading(false);
        setTimeout(() => {
          setShowPreloader(false);
          setTimeout(() => {
            setShowContent(true);
            setHidePreloader(true);
          }, 500);
        }, 100);
      }
    };

    handleLoad();

    return () => {};
  }, []);

  return (
    <>
      {!hidePreloader && <Preloader show={showPreloader} />}

      <div
        className={cn(`transition-opacity duration-500`, {
          "opacity-100": showContent,
          "opacity-0": !showContent,
          "pointer-events-none": isLoading,
        })}
      >
        {children}
      </div>
    </>
  );
};

export default PreloaderProvider;

"use client";

import icon from "@/public/404.json";
import { Button } from "@workspace/ui/components/button";
import Lottie from "lottie-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-background grid min-h-screen place-items-center px-6 lg:px-8">
      <div className="text-center">
        <div className="flex w-full items-center justify-center">
          <div className="w-[200px] md:w-[300px]">
            <Lottie animationData={icon} loop autoplay />
          </div>
        </div>
        <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium sm:text-xl/8">
          Sorry, we couldn&rsquo;t find the page you&rsquo;re looking for.
        </p>
        <div className="mt-10 flex-col items-center justify-center gap-2 sm:flex sm:flex-row md:gap-6">
          <Link href="/">
            <Button className="cursor-pointer bg-blue-600 font-bold text-white hover:bg-blue-500">
              Go back home
            </Button>
          </Link>
          <a
            href="https://github.com/Axyl1410/"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant={"ghost"}
              className="mt-4 cursor-pointer font-bold sm:mt-0"
            >
              Contact support <span aria-hidden="true">→</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

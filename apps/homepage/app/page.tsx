import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col [&_a]:text-sky-600 [&_a]:underline">
      <div className="flex h-screen w-full items-center justify-center p-8 font-mono">
        <div className="flex flex-col gap-8 text-left sm:w-[25rem]">
          <div className="items-center gap-2 font-medium sm:flex">
            <Link className="inline-block" href="/">
              Edunft
            </Link>{" "}
            /{" "}
            <a href="https://edunft-monorepo-student.vercel.app/">
              for students
            </a>{" "}
            /{" "}
            <a href="#" className="cursor-not-allowed">
              for schools
            </a>{" "}
            /{" "}
            <a href="#" className="cursor-not-allowed">
              for enterprise
            </a>
          </div>
          <form className="flex flex-col gap-2">
            <p className="text-balance font-medium">
              We are run a newsletter about design, coding, ai and open source
              soon.
            </p>
            <div className="flex cursor-not-allowed items-center gap-2">
              <Input
                type="email"
                required
                placeholder="m@example.com"
                name="email"
                disabled
              />
              <Button type="submit" disabled>
                Sign up
              </Button>
            </div>
          </form>
          <a
            href="https://github.com/Axyl1410/edunft-monorepo"
            target="_blank"
            className="font-bold"
            rel="noreferrer"
          >
            Visit Our Work
          </a>
        </div>
      </div>
    </main>
  );
}

"use client";

import TransactionDialog, {
  TransactionStep,
} from "@/components/wallet/transaction-dialog";
import { baseUrl } from "@/lib/client";
import { FORMA_SKETCHPAD, thirdwebClient } from "@/lib/thirdweb";
import getMetadata from "@/services/get-metadata";
import { Button } from "@workspace/ui/components/button";
import { FileUpload } from "@workspace/ui/components/file-upload";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import LoadingScreen from "@workspace/ui/components/loading-screen";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { Textarea } from "@workspace/ui/components/textarea";
import axios from "axios";
import { Eye, EyeOff, Info, Newspaper } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { deployERC721Contract } from "thirdweb/deploys";
import { useActiveAccount } from "thirdweb/react";

function useLazyLoading() {
  const account = useActiveAccount();
  if (!account) {
    return { isLoading: true };
  }
  return { isLoading: false, account };
}

export default function Page() {
  // Account loading hook
  const { isLoading, account } = useLazyLoading();

  // State hooks
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [files, setFiles] = useState<File | null>();
  const [royalty, setRoyalty] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  const handleFileUpload = useCallback((files: File | null) => {
    setFiles(files);
  }, []);

  if (!account) return <LoadingScreen />;

  const handle = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    setIsOpen(true);
    setCurrentStep("sent");
    try {
      const contractObject = Promise.resolve(
        deployERC721Contract({
          chain: FORMA_SKETCHPAD,
          client: thirdwebClient,
          account: account,
          type: "TokenERC721",
          params: {
            platformFeeRecipient: "0x2349Db8bdf85bd80bFc4afb715a69fb4C6463B96",
            platformFeeBps: BigInt(200),
            royaltyRecipient: account.address,
            royaltyBps: BigInt(royalty * 100),
            name,
            description,
            symbol,
            image: files ?? undefined,
          },
        })
          .catch((error) => {
            throw error;
          })
          .finally(() => {
            setCurrentStep("confirmed");
          }),
      );

      const unwrapped = await contractObject;

      let contractAddress: string | undefined = undefined;

      if (
        typeof unwrapped === "object" &&
        unwrapped !== null &&
        "w" in unwrapped
      ) {
        const obj = unwrapped as { w: [string, string] };
        contractAddress = obj.w[1];
      } else if (typeof unwrapped === "string") {
        contractAddress = unwrapped;
      }

      if (!contractAddress)
        throw new Error("Failed to extract contract address");

      console.log("Contract address:", contractAddress);

      const { metadata } = await getMetadata(contractAddress);

      await axios.post(`${baseUrl}/collections/${account.address}/owners`, {
        address: contractAddress,
        name: (await metadata).name as string,
      });

      setCurrentStep("success");
    } catch (error) {
      console.error(error);
      setCurrentStep("error");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setMessage("Failed to deploy contract: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [account, royalty, name, description, symbol, files]);

  const handleContinue = useCallback(() => {
    if (!name) {
      toast.warning("Please enter a collection name first");
      return;
    }
    if (!files) {
      toast.warning("Please upload an image first");
      return;
    }
    handle();
  }, [name, files, handle]);

  if (isLoading || !account) return <LoadingScreen />;

  return (
    <div className="container mx-auto mt-2 flex w-full justify-center">
      <div className="flex w-full flex-col">
        <div className="mb-8 flex grid-cols-6 flex-col-reverse gap-12 md:grid">
          <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-bold sm:text-3xl">
                Let's create collection
              </h1>
              <p className="text-md">
                You need to deploy a contract to create a collection.{" "}
                <span className="text-link cursor-not-allowed">
                  What is a contract?
                </span>
              </p>
            </div>
            <div>
              <p className="dark:text-text-dark mb-2 flex items-center font-bold">
                Logo image
              </p>
              <div className="border-border mx-auto rounded-lg border border-dashed bg-white dark:border-neutral-800 dark:bg-black/50">
                <FileUpload onChange={handleFileUpload} accept="image/*" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <Label htmlFor="contract" className="flex items-center">
                  Contract name <span className="text-red-600"> *</span>
                </Label>
                <Input
                  type="text"
                  name="contract"
                  id="contract"
                  placeholder="My collection name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="mcn" className="flex items-center">
                  Token symbol
                  <span className="ml-1 cursor-pointer">
                    <Info size={16} />
                  </span>
                </Label>
                <Input
                  type="text"
                  name="mcn"
                  id="mcn"
                  placeholder="MCN"
                  value={symbol}
                  className="mt-2"
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="description">
                Description <span className="text-red-600"> *</span>
              </Label>
              <div className="mt-2">
                <Textarea
                  name="description"
                  id="description"
                  rows={3}
                  placeholder="Write a few description about."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label className="flex flex-col">Royalties (0-5%)</Label>
              <Input
                type="number"
                className="mt-2 w-full"
                min={0}
                max={5}
                placeholder="0"
                onChange={(e) => setRoyalty(parseFloat(e.target.value) || 0)}
              />
              <AnimatePresence>
                {(royalty < 0 || royalty > 5) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: royalty < 0 || royalty > 5 ? 1 : 0,
                      height: royalty < 0 || royalty > 5 ? "auto" : 0,
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    Royalty must be between 0 and 5%
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleContinue} disabled={loading}>
                Create
              </Button>
            </div>
          </div>

          <div className="col-span-2 flex flex-col-reverse gap-4 md:flex-col">
            {/* Live Preview - responsive: right on desktop, below on mobile */}
            <div className="mb-8 flex h-fit flex-col gap-4 rounded-md border border-dashed border-gray-200 bg-white p-8 shadow md:order-none md:mb-0 dark:border-neutral-700 dark:bg-neutral-900">
              <h1 className="text-md mb-2 font-bold">Live Preview</h1>
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
                  {files ? (
                    <SkeletonImage
                      src={URL.createObjectURL(files)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>
                <div className="w-full">
                  <div className="truncate text-lg font-semibold">
                    {name || (
                      <span className="text-gray-400">Collection name</span>
                    )}
                  </div>
                  <div className="mb-2 text-sm text-gray-500">
                    {symbol || <span className="text-gray-300">Symbol</span>}
                  </div>
                  <div className="mb-2 min-h-[48px] text-sm text-gray-700 dark:text-gray-300">
                    {description || (
                      <span className="text-gray-400">Description...</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Royalty:</span> {royalty}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-fit flex-col gap-4 rounded-md bg-gray-100 p-8 shadow dark:bg-neutral-800">
              <h1 className="text-md font-bold">After deployment</h1>
              <div className="flex gap-4">
                <Newspaper strokeWidth={1} size={20} className={"h-5 w-5"} />
                <div>
                  <p className="font-medium text-gray-700 dark:text-white">
                    You can edit collection details
                  </p>
                  <p className={"text-gray-600 dark:text-white"}>
                    You can edit your collection after deployment.
                  </p>
                </div>
              </div>
              <h1 className="text-md font-bold">Your community</h1>
              <div className="flex gap-4">
                <Eye strokeWidth={1} size={20} className={"h-5 w-5"} />
                <div>
                  <p className="font-medium text-gray-700 dark:text-white">
                    Anyone can view
                  </p>
                  <p className={"text-gray-600 dark:text-white"}>
                    Your deployed contract will be public.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <EyeOff strokeWidth={1} size={20} className={"h-5 w-5"} />
                <div>
                  <p className="font-medium text-gray-700 dark:text-white">
                    Anyone can view
                  </p>
                  <p className={"text-gray-600 dark:text-white"}>
                    This is your drop page message.
                  </p>
                </div>
              </div>
              <h1 className="text-md font-bold">Platform fee: 2.00%</h1>
            </div>
          </div>
        </div>
      </div>
      <TransactionDialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        currentStep={currentStep}
        title="Transaction Status"
        message={message}
      />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { BackButton } from "@/components/layout/back-button";
import AttributeInput from "@/components/nft/attribute-input";
import AttributeList from "@/components/nft/attribute-list";
import DropdownCard from "@/components/nft/dropdown-card";
import TransactionDialog, {
  TransactionStep,
} from "@/components/wallet/transaction-dialog";
import { baseUrl } from "@/lib/client";
import { uploadFile } from "@/services/file";
import getThirdwebContract from "@/services/get-contract";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { FileUpload } from "@workspace/ui/components/file-upload";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import LoadingScreen from "@workspace/ui/components/loading-screen";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { Textarea } from "@workspace/ui/components/textarea";
import axios from "axios";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { mintTo } from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

interface Collection {
  address: string;
  name: string;
}

interface Attribute {
  trait_type: string;
  value: string;
}

// Custom hook for managing attributes
function useAttributes() {
  const [traitType, setTraitType] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [attributesArray, setAttributesArray] = useState<Attribute[]>([]);

  const handleAddAttribute = useCallback(() => {
    if (traitType && attributeValue) {
      setAttributesArray((prev) => [
        ...prev,
        { trait_type: traitType, value: attributeValue },
      ]);
      setTraitType("");
      setAttributeValue("");
    }
  }, [attributeValue, traitType]);

  const handleRemoveAttribute = useCallback((indexToRemove: number) => {
    setAttributesArray((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }, []);

  return {
    traitType,
    setTraitType,
    attributeValue,
    setAttributeValue,
    attributesArray,
    handleAddAttribute,
    handleRemoveAttribute,
  };
}

export default function Page() {
  const [files, setFiles] = useState<File | null>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const account = useActiveAccount();
  const [selectedOption, setSelectedOption] = useState<React.ReactNode | null>(
    null,
  );
  const [selectAddress, setSelectAddress] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempSelectedOption, setTempSelectedOption] =
    useState<React.ReactNode | null>(null);
  const [tempSelectAddress, setTempSelectAddress] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);

  const {
    traitType,
    setTraitType,
    attributeValue,
    setAttributeValue,
    attributesArray,
    handleAddAttribute,
    handleRemoveAttribute,
  } = useAttributes();

  // Fetch user's collections
  useEffect(() => {
    if (!account?.address) return;

    setLoading(true);
    axios
      .get(`${baseUrl}/collections/${account.address}/owners`)
      .then((response) => {
        setCollections(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch collections:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account?.address]);

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  const handleFileUpload = (files: File | null) => setFiles(files);

  if (!account || loading) return <LoadingScreen />;

  const handleContract = (contractAddress: string) => {
    return getThirdwebContract(contractAddress);
  };

  return (
    <div className="my-4 flex w-full justify-center">
      <div className="mb-4 flex w-full flex-col">
        <div className="flex flex-col-reverse justify-between gap-8 pb-10 md:flex-row">
          <div>
            <h1 className="text-xl font-bold sm:text-3xl">Mint your NFT</h1>
            <p className="text-md font-bold sm:text-xl">
              Create a new NFT in your collection
            </p>
          </div>
          <BackButton className="h-fit" to="/" />
        </div>
        <div className="flex w-full flex-col gap-12 md:flex-row">
          <div className="flex flex-1 flex-col gap-8">
            {/* FileUpload cho ảnh NFT */}
            <div className="mx-auto w-full max-w-5xl gap-4 rounded-lg border border-dashed bg-white p-4 dark:bg-black">
              <Label className="mb-2 block font-semibold">
                Ảnh NFT <span className="text-red-600">*</span>
              </Label>
              <FileUpload onChange={setFiles} accept="image/*" />
              {files && (
                <div className="mt-2 text-xs text-gray-500">{files.name}</div>
              )}
            </div>
            {/* Nút chọn file đính kèm */}
            <div className="mx-auto flex w-full max-w-5xl items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFileDialogOpen(true)}
                className=""
              >
                {attachedFile
                  ? "Thay đổi tài liệu đính kèm"
                  : "Đính kèm tài liệu (private, optional)"}
              </Button>
              {attachedFile && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {attachedFile.name}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setAttachedFile(null)}
                    title="Xóa file đính kèm"
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
            {/* Dialog chọn file đính kèm */}
            <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Chọn tài liệu đính kèm (private)</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <FileUpload onChange={setAttachedFile} accept="*" />
                  {attachedFile && (
                    <div className="mt-2 text-xs text-gray-500">
                      {attachedFile.name}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setFileDialogOpen(false)}
                  >
                    Đóng
                  </Button>
                  <Button
                    onClick={() => setFileDialogOpen(false)}
                    disabled={!attachedFile}
                  >
                    Xác nhận
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* Live Preview */}
            <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold">NFT Preview</h2>
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  {files ? (
                    <SkeletonImage
                      src={URL.createObjectURL(files)}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">No image</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-2 text-xl font-semibold">
                    {name || <span className="text-gray-400">NFT Name</span>}
                  </div>
                  {selectedOption && (
                    <div className="mb-2 text-sm text-gray-500">
                      Collection: {selectedOption}
                    </div>
                  )}
                  <div className="mb-4 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                    {description || (
                      <span className="text-gray-400">No description</span>
                    )}
                  </div>
                  {attributesArray.length > 0 && (
                    <div className="mt-4">
                      <h3 className="mb-2 text-sm font-medium">Attributes</h3>
                      <div className="flex flex-wrap gap-2">
                        {attributesArray.map((attr, index) => (
                          <div
                            key={index}
                            className="rounded-md bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800"
                          >
                            <span className="font-medium">
                              {attr.trait_type}:
                            </span>{" "}
                            {attr.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <form
              className="flex flex-col gap-8"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {/* Collection Selector with Dialog */}
              <div>
                <Label
                  htmlFor="collection"
                  className="dark:text-text-dark text-sm/6 font-bold"
                >
                  Collection <span className="text-red-600"> *</span>
                </Label>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <div className="relative mt-2 flex h-24 w-full cursor-pointer items-center gap-4 overflow-hidden rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                      {selectedOption || (
                        <>
                          <div className="grid h-16 w-16 place-items-center rounded-md bg-gray-200 dark:bg-neutral-800">
                            <span className="text-gray-500">+</span>
                          </div>
                          <p className="text-sm/6 font-medium">
                            Select a collection
                          </p>
                        </>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select Collection</DialogTitle>
                    </DialogHeader>
                    <div className="relative my-2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search collections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <div className="mb-4 max-h-[300px] overflow-y-auto">
                      {collections.filter((c) =>
                        c.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      ).length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <p>
                            You don't have any collections yet.{" "}
                            <span className="cursor-pointer text-blue-500 hover:underline">
                              Create one
                            </span>
                          </p>
                        </div>
                      ) : (
                        collections
                          .filter((c) =>
                            c.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          )
                          .map((collection) => (
                            <div
                              key={collection.address}
                              className={`cursor-pointer border-b border-gray-100 p-1 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${tempSelectAddress === collection.address ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                              onClick={() => {
                                setTempSelectAddress(collection.address);
                                setTempSelectedOption(
                                  <DropdownCard address={collection.address} />,
                                );
                              }}
                            >
                              <DropdownCard address={collection.address} />
                            </div>
                          ))
                      )}
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDialogOpen(false);
                          setTempSelectAddress(null);
                          setTempSelectedOption(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!tempSelectAddress}
                        onClick={() => {
                          setSelectAddress(tempSelectAddress);
                          setSelectedOption(tempSelectedOption);
                          setDialogOpen(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div>
                <Label
                  htmlFor="title"
                  className="dark:text-text-dark text-sm/6 font-bold"
                >
                  NFT Name <span className="text-red-600"> *</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter a name for your NFT"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="dark:text-text-dark text-sm/6 font-bold text-gray-900"
                >
                  Description <span className="text-red-600"> *</span>
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                />
                <p className="mt-3 text-sm/6">
                  Write a few sentences about your NFT
                </p>
              </div>

              <AttributeInput
                traitType={traitType}
                attributeValue={attributeValue}
                setTraitType={setTraitType}
                setAttributeValue={setAttributeValue}
                handleAddAttribute={handleAddAttribute}
              />

              {attributesArray.length > 0 && (
                <AttributeList
                  attributesArray={attributesArray}
                  handleRemoveAttribute={handleRemoveAttribute}
                />
              )}

              <div className={"h-[45px]"}>
                <TransactionButton
                  disabled={
                    !name ||
                    !selectedOption ||
                    !files ||
                    !description ||
                    uploading
                  }
                  className={"!w-full"}
                  transaction={async () => {
                    let externalUrl: string | undefined = undefined;
                    if (attachedFile) {
                      setUploading(true);
                      try {
                        const uploadRes = await uploadFile({
                          file: attachedFile,
                          type: "private",
                        });
                        // Chỉ lấy cid hoặc id
                        const cid = uploadRes.cid || uploadRes.id;
                        externalUrl = cid;
                      } catch (err) {
                        setUploading(false);
                        setCurrentStep("error");
                        setMessage("Tải file đính kèm thất bại");
                        throw err;
                      }
                      setUploading(false);
                    }
                    const metadata = {
                      name,
                      description,
                      image: files,
                      attributes:
                        attributesArray.length > 0
                          ? attributesArray
                          : undefined,
                      ...(externalUrl ? { external_url: externalUrl } : {}),
                    };
                    setIsOpen(true);
                    setCurrentStep("sent");
                    return mintTo({
                      contract: handleContract(selectAddress as string) as any,
                      to: account.address,
                      nft: {
                        ...metadata,
                        image: files || undefined,
                      },
                    });
                  }}
                  onTransactionSent={() => {
                    setCurrentStep("confirmed");
                  }}
                  onTransactionConfirmed={() => {
                    setCurrentStep("success");
                    setMessage("Transaction is being confirmed...");
                    // Reset form after successful mint
                    setFiles(null);
                    setName("");
                    setDescription("");
                    setAttachedFile(null);
                  }}
                  onError={(error) => {
                    setCurrentStep("error");
                    setMessage("Transaction failed: " + error.message);
                  }}
                >
                  <span>{uploading ? "Đang tải file..." : "Mint NFT"}</span>
                </TransactionButton>
              </div>
            </form>
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

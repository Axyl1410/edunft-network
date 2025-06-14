import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import DropdownCard from "./dropdown-card";
import { Collection } from "@/types";

interface OptionContent {
  content: React.ReactNode;
  address: string;
}

interface CollectionDropdownProps {
  data: Collection[];
  selectedOption: React.ReactNode | null;
  setSelectedOption: (option: React.ReactNode | null) => void;
  setSelectAddress: (address: string | null) => void;
}

const CollectionDropdown: React.FC<CollectionDropdownProps> = ({
  data,
  selectedOption,
  setSelectedOption,
  setSelectAddress,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions =
    data
      .filter((collection) =>
        collection?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .map((collection: Collection) => ({
        content: <DropdownCard address={collection.address} />,
        address: collection.address,
        name: collection.name,
      })) || [];

  const handleOptionSelect = (option: OptionContent): void => {
    setSelectAddress(option.address);
    setSelectedOption(option.content);
    setShowDropdown(false);
  };

  return (
    <div>
      <Label
        htmlFor="collection"
        className="dark:text-text-dark text-sm/6 font-bold"
      >
        Collection <span className="text-red-600"> *</span>
      </Label>
      <div
        className="relative mt-2 flex h-24 w-full cursor-pointer items-center gap-4 overflow-hidden rounded-md bg-gray-100 p-4 shadow dark:border dark:bg-neutral-900"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedOption || (
          <>
            <div className="grid h-16 w-16 place-items-center rounded-md bg-gray-200 dark:bg-neutral-800">
              <Plus />
            </div>

            <p className="text-sm/6 font-bold">Select a collection</p>
          </>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "z-10 w-full rounded-md bg-white shadow-lg dark:bg-neutral-900",
                filteredOptions.length > 2 && "max-h-[300px] overflow-y-scroll",
              )}
            >
              <div className="sticky top-0 z-10 border-b bg-white p-2 dark:bg-neutral-900">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder={"Search collections..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {filteredOptions.length === 0 ? (
                <div className="w-full p-4 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? (
                    <p>No collections found</p>
                  ) : (
                    <p>
                      You don't have any collections yet.{" "}
                      <span className="text-link">
                        <Link href={"/create/collection"}>Create one</Link>
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-full cursor-pointer border-y px-4 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800",
                      index === 0 && "border-t-0",
                    )}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.content}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-sm/6">
        Not all collections are shown.{" "}
        <span className="text-link cursor-not-allowed">Learn more</span>
      </p>
    </div>
  );
};

export default CollectionDropdown;

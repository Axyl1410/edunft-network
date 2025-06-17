import { Attribute } from "@/types";
import { Label } from "@workspace/ui/components/label";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface AttributeListProps {
  attributesArray: Attribute[];
  handleRemoveAttribute: (index: number) => void;
}

const AttributeList: React.FC<AttributeListProps> = ({
  attributesArray,
  handleRemoveAttribute,
}) => {
  return (
    <div>
      <Label>Added Attributes</Label>
      <ul className="mt-2 space-y-2">
        <AnimatePresence>
          {attributesArray.map((attribute, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-1.5 dark:bg-neutral-800"
            >
              <div>
                <span className="font-semibold dark:text-white">
                  {attribute.trait_type}:
                </span>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {attribute.value}
                </span>
              </div>
              <button
                type="button"
                className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-neutral-700"
                onClick={() => handleRemoveAttribute(index)}
              >
                <X className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default AttributeList;

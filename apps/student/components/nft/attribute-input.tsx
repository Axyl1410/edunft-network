import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

interface AttributeInputProps {
  traitType: string;
  attributeValue: string;
  setTraitType: (value: string) => void;
  setAttributeValue: (value: string) => void;
  handleAddAttribute: () => void;
}

const AttributeInput: React.FC<AttributeInputProps> = ({
  traitType,
  attributeValue,
  setTraitType,
  setAttributeValue,
  handleAddAttribute,
}) => {
  return (
    <div>
      <Label>
        Attributes <span className="text-gray-600">(Optional)</span>
      </Label>
      <div className="mt-2 flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Trait type"
            value={traitType}
            onChange={(e) => setTraitType(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Value"
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
          />
        </div>
        <Button onClick={handleAddAttribute}>Add</Button>
      </div>
    </div>
  );
};

export default AttributeInput;

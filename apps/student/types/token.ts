export interface Collection {
  address: string;
  name: string;
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface NFT {
  address: string;
  tokenId: string;
}

export interface AttributeInputProps {
  traitType: string;
  attributeValue: string;
  setTraitType: (value: string) => void;
  setAttributeValue: (value: string) => void;
  handleAddAttribute: () => void;
}

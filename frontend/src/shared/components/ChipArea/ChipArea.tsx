import React from "react";
import { Chip } from "@heroui/react";

interface IChipAreaProps {
  chips: Array<string>;
  setChips: (chips: Array<string>) => void;
}
const ChipArea: React.FC<IChipAreaProps> = (props) => {
  const removeChip = (index: number) => {
    props.setChips(props.chips.filter((_, i) => i !== index));
  };

  return (
    <div className="py-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {props.chips.map((chip, index) => (
          <Chip
            key={index}
            className="bg-secondary text-white"
            classNames={{
              content: "font-medium",
            }}
            onClose={() => removeChip(index)}
          >
            {chip}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default ChipArea;

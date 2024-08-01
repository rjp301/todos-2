import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  setQuantity: (quantity: number) => void;
};

const QuantityEditor: React.FC<Props> = (props) => {
  const { quantity, setQuantity } = props;

  return (
    <div className="relative grid h-9 grid-cols-[1.5rem_1rem] items-center rounded-md border">
      <input
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="h-full rounded-l-md border-r text-center text-xs"
      />
      <div className="grid h-full grid-rows-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-auto w-auto rounded-none rounded-tr-md border-b"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size="0.5rem" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-auto w-auto rounded-none rounded-br-md"
          onClick={() => setQuantity(Math.max(quantity - 1, 1))}
        >
          <Minus size="0.5rem" />
        </Button>
      </div>
    </div>
  );
};

export default QuantityEditor;

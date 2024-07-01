import React from "react";
import { Button } from "./ui/button";

type Props = {
  quantity: number;
  setQuantity: (quantity: number) => void;
};

const QuantityEditor: React.FC<Props> = (props) => {
  const { quantity, setQuantity } = props;

  return (
    <div className="flex items-center">
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-muted-foreground"
        onClick={() => setQuantity(Math.max(quantity - 1, 1))}
      >
        -
      </Button>
      <span className="flex min-w-[2ch] justify-center text-sm">
        {quantity}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-muted-foreground"
        onClick={() => setQuantity(quantity + 1)}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityEditor;

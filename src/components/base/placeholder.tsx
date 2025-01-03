import { Text } from "@radix-ui/themes";
import React from "react";

interface Props {
  message: string;
}

const Placeholder: React.FC<Props> = (props) => {
  const { message } = props;

  return (
    <div className="flex h-full items-center justify-center">
      <Text size="2" color="gray">
        {message}
      </Text>
    </div>
  );
};

export default Placeholder;

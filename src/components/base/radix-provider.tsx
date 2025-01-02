import { Theme } from "@radix-ui/themes";
import React from "react";

const RadixProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Theme accentColor="grass" radius="large">
      {children}
    </Theme>
  );
};

export default RadixProvider;

import { Theme } from "@radix-ui/themes";
import React from "react";

const RadixProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Theme accentColor="grass" scaling="95%" radius="large">
      {children}
    </Theme>
  );
};

export default RadixProvider;

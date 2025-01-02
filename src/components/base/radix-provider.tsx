import { Theme } from "@radix-ui/themes";
import React from "react";

const RadixProvider = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <Theme ref={ref} accentColor="grass" radius="large">
        {children}
      </Theme>
    );
  },
);

export default RadixProvider;

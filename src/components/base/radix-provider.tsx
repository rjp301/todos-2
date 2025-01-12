import { ACCENT_COLOR } from "@/lib/constants";
import { Theme } from "@radix-ui/themes";
import React from "react";

const RadixProvider = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <Theme ref={ref} accentColor={ACCENT_COLOR} radius="large">
        {children}
      </Theme>
    );
  },
);

export default RadixProvider;

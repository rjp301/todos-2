import { Heading } from "@radix-ui/themes";
import React from "react";

const Logo: React.FC = () => {
  return (
    <Heading as="h2" asChild weight="bold" size="5">
      <a href="/" className="text-xl flex items-center gap-3">
        <i className="fa-solid fa-earth text-accentA-10" />
        LighterTravel
      </a>
    </Heading>
  );
};

export default Logo;

import { Earth } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center gap-2 px-2">
      <Earth size="1.5rem" className="text-primary" />
      <span className="text-xl font-bold">LighterTravel</span>
    </a>
  );
};

export default Logo;

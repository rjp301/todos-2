import { Earth } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to={"/"} className="flex items-center gap-2 px-2">
      <Earth size="1.5rem" className="text-primary" />
      <span className="text-xl font-bold">TrekReady</span>
    </Link>
  );
};

export default Logo;

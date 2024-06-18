import { Link } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <Link to={"/"} className="flex items-center gap-3 px-2">
      <Feather size="1.5rem" className="text-primary" />
      <span className="text-xl font-bold">PackLighter</span>
    </Link>
  );
};

export default Logo;

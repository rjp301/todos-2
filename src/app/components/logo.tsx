import { Link } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import React from "react";

export default function Logo(): ReturnType<React.FC> {
  return (
    <Link to={"/"} className="flex gap-3 items-center px-2">
      <Feather size="1.5rem" className="text-primary" />
      <span className="text-xl font-bold">PackLighter</span>
    </Link>
  );
}

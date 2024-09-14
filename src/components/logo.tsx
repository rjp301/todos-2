import React from "react";

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center gap-2 px-2 text-xl">
      <i className="fa-solid fa-earth text-primary" />
      <span className="font-bold">LighterTravel</span>
    </a>
  );
};

export default Logo;

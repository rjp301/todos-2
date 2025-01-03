import React from "react";
import type { UserSelect } from "@/lib/types";
import { Badge } from "@radix-ui/themes";

type Props = {
  owner: UserSelect;
};

const OwnerBadge: React.FC<Props> = (props) => {
  const { owner } = props;

  return (
    <Badge variant="soft">
      <span>
        Created by {owner.name} using{" "}
        <a href="/" className="text-primary font-medium hover:underline">
          LighterTravel
        </a>
      </span>
    </Badge>
  );
};

export default OwnerBadge;

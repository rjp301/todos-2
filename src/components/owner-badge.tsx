import React from "react";
import { Badge } from "@/components/ui/badge";
import type { UserSelect } from "@/lib/types";

type Props = {
  owner: UserSelect;
};

const OwnerBadge: React.FC<Props> = (props) => {
  const { owner } = props;

  return (
    <Badge variant="secondary">
      <span>
        Created by {owner.name} using{" "}
        <a href="/" className="font-medium text-primary hover:underline">
          TrekReady
        </a>
      </span>
    </Badge>
  );
};

export default OwnerBadge;

import React from "react";
import { Button, Heading, Text, type ButtonProps } from "@radix-ui/themes";

type Props = {
  title: string;
  action?: ButtonProps;
  count?: number;
};

const SidebarSectionHeader: React.FC<Props> = (props) => {
  const { title, action, count } = props;

  return (
    <header className="flex h-6 items-center justify-between gap-2">
      <Heading as="h2" size="2" weight="bold" className="uppercase">
        {title}
        <Text color="gray" weight="medium" className="font-mono ml-2">
          {count}
        </Text>
      </Heading>
      {action && <Button size="1" variant="ghost" {...action} />}
    </header>
  );
};

export default SidebarSectionHeader;

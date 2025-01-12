import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@radix-ui/themes";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { z } from "zod";

const schema = z.object({
  value: z.string().nonempty(),
});
type Schema = z.infer<typeof schema>;

const Form = React.forwardRef<
  HTMLFormElement,
  {
    initialValue: string;
    handleSubmit: (value: string) => void;
    handleCancel: () => void;
    textFieldProps?: React.ComponentProps<typeof TextField.Root>;
  }
>(({ initialValue, handleSubmit, handleCancel, textFieldProps }, ref) => {
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") handleCancel();
  });

  const form = useForm<Schema>({
    defaultValues: { value: initialValue },
    resolver: zodResolver(schema),
  });

  return (
    <form
      ref={ref}
      onSubmit={form.handleSubmit(({ value }) => handleSubmit(value))}
    >
      <Controller
        control={form.control}
        name="value"
        render={({ field }) => (
          <TextField.Root
            autoFocus
            onFocus={(e) => e.target.select()}
            {...textFieldProps}
            {...field}
          >
            <TextField.Slot side="right" className="gap-2">
              <Button size="1" type="submit">
                Save changes
              </Button>
              <Button
                size="1"
                variant="soft"
                color="amber"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </TextField.Slot>
          </TextField.Root>
        )}
      />
    </form>
  );
});

type Props = {
  value: string;
  handleSubmit: (value: string) => void;
  children: (props: { startEditing: () => void }) => React.ReactNode;
  textFieldProps?: React.ComponentProps<typeof TextField.Root>;
};

const ConditionalForm: React.FC<Props> = ({
  value,
  handleSubmit,
  children,
  textFieldProps,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  useOnClickOutside(formRef, () => setIsEditing(false));

  if (isEditing) {
    return (
      <Form
        ref={formRef}
        initialValue={value}
        handleCancel={() => {
          setIsEditing(false);
        }}
        handleSubmit={(value) => {
          setIsEditing(false);
          handleSubmit(value);
        }}
        textFieldProps={textFieldProps}
      />
    );
  }

  return children({ startEditing: () => setIsEditing(true) });
};

export default ConditionalForm;

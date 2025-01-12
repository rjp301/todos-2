import { ACCENT_COLOR } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, IconButton, TextField } from "@radix-ui/themes";
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
    formProps?: React.ComponentProps<"form">;
    compactButtons?: boolean;
  }
>(
  (
    {
      initialValue,
      handleSubmit,
      handleCancel,
      textFieldProps,
      formProps,
      compactButtons,
    },
    ref,
  ) => {
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
        {...formProps}
      >
        <Controller
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextField.Root
              autoFocus
              onFocus={(e) => e.target.select()}
              variant="soft"
              color="gray"
              {...textFieldProps}
              {...field}
            >
              <TextField.Slot side="right" className="gap-1">
                {compactButtons ? (
                  <>
                    <IconButton
                      type="submit"
                      variant="soft"
                      size="1"
                      color={ACCENT_COLOR}
                      aria-label="Save changes"
                    >
                      <i className="fa-solid fa-save" />
                    </IconButton>
                    <IconButton
                      type="button"
                      variant="soft"
                      size="1"
                      color="amber"
                      aria-label="Cancel"
                      onClick={handleCancel}
                    >
                      <i className="fa-solid fa-xmark" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      size="1"
                      type="submit"
                      variant="soft"
                      color={ACCENT_COLOR}
                    >
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
                  </>
                )}
              </TextField.Slot>
            </TextField.Root>
          )}
        />
      </form>
    );
  },
);

type Props = {
  value: string;
  handleSubmit: (value: string) => void;
  children: (props: {
    startEditing: () => void;
    displayValue: string;
  }) => React.ReactNode;
  textFieldProps?: React.ComponentProps<typeof TextField.Root>;
  formProps?: React.ComponentProps<"form">;
  compactButtons?: boolean;
};

const ConditionalForm: React.FC<Props> = ({
  value,
  handleSubmit,
  children,
  textFieldProps,
  formProps,
  compactButtons,
}) => {
  const [displayValue, setDisplayValue] = React.useState(value);
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
          setDisplayValue(value);
          setIsEditing(false);
          handleSubmit(value);
        }}
        textFieldProps={textFieldProps}
        formProps={formProps}
        compactButtons={compactButtons}
      />
    );
  }

  return children({ startEditing: () => setIsEditing(true), displayValue });
};

export default ConditionalForm;

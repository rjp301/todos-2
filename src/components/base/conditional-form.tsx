import { ACCENT_COLOR } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, IconButton, Text, TextField, Tooltip } from "@radix-ui/themes";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { z } from "zod";

type SharedProps = {
  textFieldProps?: React.ComponentProps<typeof TextField.Root>;
  formProps?: React.ComponentProps<"form">;
  customSchema?: z.ZodString;
  compactButtons?: boolean;
};

const Form = React.forwardRef<
  HTMLFormElement,
  {
    initialValue: string;
    handleSubmit: (value: string) => void;
    handleCancel: () => void;
  } & SharedProps
>(
  (
    {
      initialValue,
      handleSubmit,
      handleCancel,
      textFieldProps,
      formProps,
      customSchema,
      compactButtons,
    },
    ref,
  ) => {
    useEventListener("keydown", (e) => {
      if (e.key === "Escape") handleCancel();
    });

    const form = useForm({
      defaultValues: { value: initialValue },
      resolver: zodResolver(
        z.object({ value: customSchema || z.string().nonempty() }),
      ),
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
          render={({ field, fieldState: { error } }) => (
            <TextField.Root
              autoFocus
              onFocus={(e) => e.target.select()}
              variant="soft"
              color="gray"
              {...textFieldProps}
              {...field}
            >
              {error && (
                <TextField.Slot side="left">
                  <Tooltip content={error.message} side="top" align="center">
                    <Text size="1" color="red" aria-label="Error">
                      <i className="fa-solid fa-exclamation-circle cursor-help" />
                    </Text>
                  </Tooltip>
                </TextField.Slot>
              )}
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

type ConditionalFormProps = {
  value: string;
  handleSubmit: (value: string) => void;
  children: (props: {
    startEditing: () => void;
    displayValue: string;
  }) => React.ReactNode;
} & SharedProps;

const ConditionalForm: React.FC<ConditionalFormProps> = ({
  value,
  handleSubmit,
  children,
  ...rest
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
        {...rest}
      />
    );
  }

  return children({ startEditing: () => setIsEditing(true), displayValue });
};

export default ConditionalForm;

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

type FormInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    autoComplete?: string;
    description?: string;
    disabled?: boolean;
};

export function FormInput<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    autoComplete,
    description,
    disabled,
}: FormInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel>{label}</FieldLabel>

                    <Input
                        {...field}
                        value={field.value ?? ""}
                        type={type}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        disabled={disabled}
                    />

                    {description && (
                        <FieldDescription>{description}</FieldDescription>
                    )}

                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}
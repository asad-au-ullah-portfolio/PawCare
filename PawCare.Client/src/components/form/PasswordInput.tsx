import { useState } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Check, X, Eye, EyeOff } from "lucide-react";

type PasswordInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    disabled?: boolean;
};

export function PasswordInput<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "••••••••",
    disabled,
}: PasswordInputProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const value = (field.value ?? "") as string;

                const requirements = [
                    { label: "At least 8 characters", met: value.length >= 8 },
                    { label: "Must contain an uppercase letter", met: /[A-Z]/.test(value) },
                    { label: "Must contain a lowercase letter", met: /[a-z]/.test(value) },
                    { label: "Must contain a number", met: /[0-9]/.test(value) },
                    { label: "Must contain a special character", met: /[^a-zA-Z0-9]/.test(value) },
                ];

                const metCount = requirements.filter((req) => req.met).length;
                const progress = (metCount / requirements.length) * 100;

                let strengthColor = "bg-muted";
                if (metCount > 0 && metCount <= 2) strengthColor = "bg-destructive";
                else if (metCount === 3 || metCount === 4) strengthColor = "bg-yellow-500";
                else if (metCount === 5) strengthColor = "bg-green-500";

                return (
                    <Field>
                        <FieldLabel>{label}</FieldLabel>
                        <div className="relative">
                            <Input
                                {...field}
                                value={value}
                                type={showPassword ? "text" : "password"}
                                placeholder={placeholder}
                                autoComplete="new-password"
                                disabled={disabled}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* Strength Meter */}
                        <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                                className={`h-full transition-all duration-500 ease-in-out ${strengthColor}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Dynamic Checklist */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {requirements.map((req, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                                        req.met ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
                                    }`}
                                >
                                    {req.met ? (
                                        <Check className="h-4 w-4 shrink-0" />
                                    ) : (
                                        <X className="h-4 w-4 shrink-0 opacity-50" />
                                    )}
                                    <span>{req.label}</span>
                                </div>
                            ))}
                        </div>
                    </Field>
                );
            }}
        />
    );
}

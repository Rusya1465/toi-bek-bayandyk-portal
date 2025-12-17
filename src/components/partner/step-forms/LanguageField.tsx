import { Control, FieldValues, Path } from "react-hook-form";
import { LanguageFormTabs } from "@/components/LanguageFormTabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface LanguageFieldProps<T extends FieldValues> {
  control: Control<T>;
  mainName: Path<T>;
  altName: Path<T>;
  label: string;
  placeholder: string;
  alternateLanguage: "ky" | "ru";
  description?: string;
  type?: "input" | "textarea";
  textareaClassName?: string;
}

export function LanguageField<T extends FieldValues>({
  control,
  mainName,
  altName,
  label,
  placeholder,
  alternateLanguage,
  description,
  type = "input",
  textareaClassName = "min-h-[150px]",
}: LanguageFieldProps<T>) {
  const InputComponent = type === "textarea" ? Textarea : Input;
  const inputProps = type === "textarea" ? { className: textareaClassName } : {};

  return (
    <LanguageFormTabs
      mainContent={
        <FormField
          control={control}
          name={mainName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <InputComponent placeholder={placeholder} {...inputProps} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
      alternateContent={
        <FormField
          control={control}
          name={altName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <InputComponent placeholder={placeholder} {...inputProps} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
      alternateLanguage={alternateLanguage}
      description={description}
    />
  );
}

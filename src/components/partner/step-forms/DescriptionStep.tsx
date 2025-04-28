
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface DescriptionStepProps {
  form: UseFormReturn<any>;
  descriptionLabel: string;
  descriptionPlaceholder: string;
}

export const DescriptionStep = ({
  form,
  descriptionLabel,
  descriptionPlaceholder
}: DescriptionStepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{descriptionLabel}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={descriptionPlaceholder}
                className="min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

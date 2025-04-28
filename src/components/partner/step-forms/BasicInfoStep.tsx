
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BasicInfoStepProps {
  form: UseFormReturn<any>;
  nameLabel: string;
  namePlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  capacityLabel?: string;
  capacityPlaceholder?: string;
  genreLabel?: string;
  experienceLabel?: string;
  experienceOptions?: React.ReactNode;
  specsLabel?: string;
  specsPlaceholder?: string;
}

export const BasicInfoStep = ({
  form,
  nameLabel,
  namePlaceholder,
  addressLabel,
  addressPlaceholder,
  capacityLabel,
  capacityPlaceholder,
  genreLabel,
  experienceLabel,
  experienceOptions,
  specsLabel,
  specsPlaceholder
}: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{nameLabel}</FormLabel>
            <FormControl>
              <Input placeholder={namePlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Conditional fields based on what's needed */}
      {addressLabel && (
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{addressLabel}</FormLabel>
              <FormControl>
                <Input placeholder={addressPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {capacityLabel && (
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{capacityLabel}</FormLabel>
              <FormControl>
                <Input placeholder={capacityPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {genreLabel && experienceOptions}

      {experienceLabel && !experienceOptions && (
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{experienceLabel}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {specsLabel && (
        <FormField
          control={form.control}
          name="specs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{specsLabel}</FormLabel>
              <FormControl>
                <Input placeholder={specsPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

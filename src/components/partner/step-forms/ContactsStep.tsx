
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ContactsStepProps {
  form: UseFormReturn<any>;
  priceLabel: string;
  pricePlaceholder: string;
  contactsLabel: string;
  contactsPlaceholder: string;
}

export const ContactsStep = ({
  form,
  priceLabel,
  pricePlaceholder,
  contactsLabel,
  contactsPlaceholder
}: ContactsStepProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{priceLabel}</FormLabel>
            <FormControl>
              <Input placeholder={pricePlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contacts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{contactsLabel}</FormLabel>
            <FormControl>
              <Input placeholder={contactsPlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

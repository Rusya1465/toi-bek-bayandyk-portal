import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export type ResetFormValues = {
  resetEmail: string;
};

interface ResetPasswordFormProps {
  onSubmit: (values: ResetFormValues) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ResetPasswordForm = ({ onSubmit, onCancel, loading }: ResetPasswordFormProps) => {
  const { t } = useTranslation();

  const resetSchema = z.object({
    resetEmail: z.string().email(t("auth.invalidEmail")),
  });

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      resetEmail: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="resetEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.sending")}
            </>
          ) : (
            t("auth.sendResetLink")
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;

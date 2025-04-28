
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, "Толук атыңыз эң аз дегенде 2 белги болушу керек"),
  email: z.string().email("Туура эмес электрондук почта"),
  password: z.string().min(6, "Сырсөз эң аз дегенде 6 белги болушу керек"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  loading: boolean;
}

const RegisterForm = ({ onSubmit, loading }: RegisterFormProps) => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Толук аты-жөнүңүз</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сырсөз</FormLabel>
              <FormControl>
                <Input
                  type="password"
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
              Каттоодо...
            </>
          ) : (
            "Катталуу"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;

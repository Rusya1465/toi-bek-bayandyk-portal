
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Туура эмес электрондук почта"),
  password: z.string().min(6, "Сырсөз эң аз дегенде 6 белги болушу керек"),
  rememberMe: z.boolean().default(true),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onForgotPassword: () => void;
  loading: boolean;
}

const LoginForm = ({ onSubmit, onForgotPassword, loading }: LoginFormProps) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Мени эстеп калуу
                </FormLabel>
              </FormItem>
            )}
          />
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={(e) => {
              e.preventDefault();
              onForgotPassword();
            }}
          >
            Сырсөздү унуттуңузбу?
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Кирүүдө...
            </>
          ) : (
            "Кирүү"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;

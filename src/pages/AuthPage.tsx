
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Туура эмес электрондук почта"),
  password: z.string().min(6, "Сырсөз эң аз дегенде 6 белги болушу керек"),
  rememberMe: z.boolean().default(true),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Толук атыңыз эң аз дегенде 2 белги болушу керек"),
  email: z.string().email("Туура эмес электрондук почта"),
  password: z.string().min(6, "Сырсөз эң аз дегенде 6 белги болушу керек"),
});

const resetSchema = z.object({
  resetEmail: z.string().email("Туура эмес электрондук почта"),
});

const AuthPage = () => {
  // Form states
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  // Reset password form
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      resetEmail: "",
    },
  });
  
  const { signIn, signUp, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getErrorMessage = (error: any): string => {
    const message = error?.message || "Күтүлбөгөн ката кетти";
    
    if (message.includes("Invalid login credentials")) {
      return "Туура эмес электрондук почта же сырсөз";
    } else if (message.includes("Email not confirmed")) {
      return "Электрондук почтаңызды тастыктаңыз";
    } else if (message.includes("User already registered")) {
      return "Бул электрондук почта менен катталган колдонуучу бар";
    } else if (message.includes("Email rate limit exceeded")) {
      return "Өтө көп аракет кылдыңыз. Кийинчерээк кайра аракет кылыңыз";
    } else if (message.includes("Password should be")) {
      return "Сырсөз эң аз дегенде 6 белги болушу керек";
    }
    
    return message;
  };

  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);

    try {
      await signIn(values.email, values.password, values.rememberMe);
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);

    try {
      await signUp(values.email, values.password, values.fullName);
      toast({
        description: "Каттоо ийгиликтүү болду. Эми кирсеңиз болот.",
      });
      setActiveTab("login");
      loginForm.setValue("email", values.email);
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (values: z.infer<typeof resetSchema>) => {
    setLoading(true);
    
    try {
      await requestPasswordReset(values.resetEmail);
      toast({
        description: "Сырсөздү калыбына келтирүү үчүн электрондук почтаңызды текшериңиз",
      });
      setIsResettingPassword(false);
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  if (isResettingPassword) {
    return (
      <div className="container max-w-md py-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Сырсөздү калыбына келтирүү
            </CardTitle>
            <CardDescription className="text-center">
              Сырсөздү калыбына келтирүү шилтемеси электрондук почтаңызга жөнөтүлөт
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="resetEmail"
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Жөнөтүлүүдө...
                    </>
                  ) : (
                    "Шилтеме жөнөтүү"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => setIsResettingPassword(false)}
              disabled={loading}
            >
              Кирүүгө кайтуу
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {activeTab === "login" ? "Кирүү" : "Катталуу"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login"
              ? "Системага кирүү үчүн маалыматтарыңызды киргизиңиз"
              : "Жаңы аккаунт түзүү үчүн маалыматтарыңызды киргизиңиз"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Кирүү</TabsTrigger>
              <TabsTrigger value="register">Катталуу</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
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
                    control={loginForm.control}
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
                      control={loginForm.control}
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
                        setIsResettingPassword(true);
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
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

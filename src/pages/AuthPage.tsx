
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

const AuthPage = () => {
  // Form states
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "login") {
        await signIn(email, password, rememberMe);
      } else {
        if (!fullName) {
          toast({
            variant: "destructive",
            description: "Толук атыңызды киргизиңиз",
          });
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName);
        toast({
          description: "Каттоо ийгиликтүү болду. Эми кирсеңиз болот.",
        });
        setActiveTab("login");
      }
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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await requestPasswordReset(resetEmail);
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
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Сырсөз</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={() => setRememberMe(!rememberMe)}
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Мени эстеп калуу
                    </Label>
                  </div>
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
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Толук аты-жөнүңүз</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Сырсөз</Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

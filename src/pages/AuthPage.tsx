
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
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
      if (isLogin) {
        await signIn(email, password);
        toast({
          description: "Ийгиликтүү кирдиңиз",
        });
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
          description: "Каттоо ийгиликтүү болду",
        });
      }
      navigate("/");
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

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isLogin ? "Кирүү" : "Катталуу"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Системага кирүү үчүн маалыматтарыңызды киргизиңиз"
              : "Жаңы аккаунт түзүү үчүн маалыматтарыңызды киргизиңиз"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Толук аты-жөнүңүз</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {isLogin ? "Кирүү" : "Катталуу"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin
                ? "Аккаунтуңуз жокпу? Катталыңыз"
                : "Аккаунтуңуз барбы? Кириңиз"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, X } from "lucide-react";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import type { LoginFormValues } from "@/components/auth/LoginForm";
import type { RegisterFormValues } from "@/components/auth/RegisterForm";
import type { ResetFormValues } from "@/components/auth/ResetPasswordForm";
import { useIsMobile } from "@/hooks/use-mobile";

const AuthPage = () => {
  // Form states
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, requestPasswordReset } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Prevent body scrolling on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('overflow-hidden');
      
      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }
  }, [isMobile]);

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

  const handleLoginSubmit = async (values: LoginFormValues) => {
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

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setLoading(true);

    try {
      await signUp(values.email, values.password, values.fullName);
      toast({
        description: "Каттоо ийгиликтүү болду. Эми кирсеңиз болот.",
      });
      setActiveTab("login");
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

  const handlePasswordReset = async (values: ResetFormValues) => {
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

  const handleBack = () => {
    // If we came from somewhere else in the app, go back there
    if (location.key !== "default") {
      navigate(-1);
    } else {
      // Otherwise go to home
      navigate("/");
    }
  };

  // Mobile header with back button
  const MobileHeader = () => (
    <div className="flex items-center justify-between pt-4 px-4 md:hidden">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleBack}
        className="hover:bg-transparent -ml-3"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleBack}
        className="hover:bg-transparent -mr-3"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );

  if (isResettingPassword) {
    return (
      <>
        {isMobile && <MobileHeader />}
        <AuthContainer 
          title="Сырсөздү калыбына келтирүү"
          description="Сырсөздү калыбына келтирүү шилтемеси электрондук почтаңызга жөнөтүлөт"
          footer={
            <Button 
              variant="link" 
              onClick={() => setIsResettingPassword(false)}
              disabled={loading}
            >
              Кирүүгө кайтуу
            </Button>
          }
        >
          <ResetPasswordForm 
            onSubmit={handlePasswordReset} 
            onCancel={() => setIsResettingPassword(false)} 
            loading={loading} 
          />
        </AuthContainer>
      </>
    );
  }

  return (
    <>
      {isMobile && <MobileHeader />}
      <AuthContainer
        title={activeTab === "login" ? "Кирүү" : "Катталуу"}
        description={
          activeTab === "login"
            ? "Системага кирүү үчүн маалыматтарыңызды киргизиңиз"
            : "Жаңы аккаунт түзүү үчүн маалыматтарыңызды киргизиңиз"
        }
      >
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Кирүү</TabsTrigger>
            <TabsTrigger value="register">Катталуу</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              onSubmit={handleLoginSubmit} 
              onForgotPassword={() => setIsResettingPassword(true)} 
              loading={loading} 
            />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm 
              onSubmit={handleRegisterSubmit} 
              loading={loading} 
            />
          </TabsContent>
        </Tabs>
      </AuthContainer>
    </>
  );
};

export default AuthPage;

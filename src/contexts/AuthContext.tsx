import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AuthState, Profile } from "@/lib/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  isProfileLoading: boolean;
}>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  isProfileLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState & { session: Session | null }>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  });
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session: session,
        }));

        if (session?.user) {
          // Defer profile fetch to avoid potential deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
          
          if (event === 'SIGNED_IN') {
            toast({
              description: "Сиз ийгиликтүү кирдиңиз",
            });
            navigate("/");
          }
        } else {
          setAuthState(prev => ({ ...prev, profile: null }));
          
          if (event === 'SIGNED_OUT') {
            toast({
              description: "Сиз чыктыңыз",
            });
            navigate("/");
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session: session,
        loading: false,
      }));

      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  const fetchProfile = async (userId: string) => {
    setIsProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          description: "Профилди жүктөөдө ката кетти",
        });
      } else if (data) {
        setAuthState(prev => ({ ...prev, profile: data as Profile }));
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe = true) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const resetPassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    if (error) throw error;
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!authState.user?.id) {
      throw new Error("No user signed in");
    }
    
    setIsProfileLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", authState.user.id);

      if (error) throw error;
      
      // Refetch profile to get updated data
      await fetchProfile(authState.user.id);
      
      toast({
        description: "Профиль ийгиликтүү жаңыртылды",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        description: "Профилди жаңыртууда ката кетти",
      });
      throw error;
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        isProfileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

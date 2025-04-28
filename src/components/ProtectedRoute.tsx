
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        description: "Сизге кирүү керек",
        variant: "destructive",
      });
    } else if (!loading && user && roles.length > 0 && profile && !roles.includes(profile.role)) {
      toast({
        description: "Сизде жетиштүү укуктар жок",
        variant: "destructive",
      });
    }
  }, [loading, user, profile, roles, toast]);

  // Still loading, show nothing
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Жүктөлүүдө...</div>;
  }

  // No user, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // User doesn't have required role
  if (roles.length > 0 && profile && !roles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  // User is allowed
  return <>{children}</>;
};

export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  roles = [], 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Log access attempts for security monitoring
      console.log('🔒 ProtectedRoute check:', { 
        user: !!user, 
        userRole: profile?.role,
        requiredRoles: roles,
        path: location.pathname 
      });

      if (!user) {
        toast({
          description: "Кирүү талап кылынат",
          variant: "destructive",
        });
      } else if (roles.length > 0 && profile && !roles.includes(profile.role)) {
        // Log unauthorized access attempts
        console.warn('⚠️ Unauthorized access attempt:', {
          userId: user.id,
          userRole: profile.role,
          requiredRoles: roles,
          path: location.pathname
        });
        toast({
          description: "Жетиштүү укуктар жок",
          variant: "destructive",
        });
      }
    }
  }, [loading, user, profile, roles, toast, location.pathname]);

  // Still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <Loader className="h-10 w-10 animate-spin mb-2" />
        <p className="text-muted-foreground">Жүктөлүүдө...</p>
      </div>
    );
  }

  // No user, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User doesn't have required role
  if (roles.length > 0 && profile && !roles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  // User is allowed
  return <>{children}</>;
};

export default ProtectedRoute;

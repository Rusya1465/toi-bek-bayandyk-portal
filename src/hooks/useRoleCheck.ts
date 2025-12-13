import { useAuth } from '@/contexts/AuthContext';

export const useRoleCheck = () => {
  const { profile, loading } = useAuth();

  const isAdmin = profile?.role === 'admin';
  const isPartner = profile?.role === 'partner' || isAdmin;
  const isUser = !!profile;

  const hasRole = (roles: string[]): boolean => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  const canManageService = (ownerId: string): boolean => {
    if (!profile) return false;
    return isAdmin || profile.id === ownerId;
  };

  return {
    isAdmin,
    isPartner,
    isUser,
    hasRole,
    canManageService,
    currentRole: profile?.role || null,
    loading
  };
};

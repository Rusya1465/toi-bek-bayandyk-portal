
import { Link } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Plus, 
  Edit, 
  Settings, 
  Heart,
  History,
  ShoppingBag,
  UserCog
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Profile } from "@/lib/types/auth";

interface UserDropdownProps {
  user: any;
  profile: Profile | null;
  handleSignOut: () => void;
  isAdmin: boolean;
  isPartner: boolean;
  navigate: (path: string) => void;
}

const UserDropdown = ({ 
  user, 
  profile, 
  handleSignOut, 
  isAdmin, 
  isPartner,
  navigate
}: UserDropdownProps) => {
  const { t } = useTranslation();

  const getInitials = (name: string | null) => {
    if (!name) return "КБ";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 md:h-10 md:w-10 rounded-full"
        >
          <Avatar className="h-9 w-9 md:h-10 md:w-10 border">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || t("nav.profile")} />
            ) : null}
            <AvatarFallback className={cn(
              "text-background",
              isAdmin ? "bg-red-500" : 
              isPartner ? "bg-purple-500" : 
              "bg-kyrgyz-yellow"
            )}>
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {profile?.full_name && (
              <p className="font-medium">{profile.full_name}</p>
            )}
            <p className="text-xs text-muted-foreground truncate w-[180px]">
              {user.email}
            </p>
            {profile?.role && (
              <p className="text-xs font-medium text-primary">
                {profile.role === "admin" 
                  ? t("nav.admin") 
                  : profile.role === "partner"
                  ? "Өнөктөш"
                  : t("nav.profile")}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t("nav.profile")}</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/profile/settings" className="flex items-center">
            <UserCog className="mr-2 h-4 w-4" />
            <span>{t("nav.settings")}</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/profile/favorites" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>{t("nav.favorites")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/profile/history" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            <span>{t("nav.history")}</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {isPartner && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/create-event" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>{t("nav.createEvent")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/apply-event" className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                <span>{t("nav.applyEvent")}</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/profile/services" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>{t("nav.services")}</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
          </>
        )}
        
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("nav.admin")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("nav.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;


import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        description: "Системадан ийгиликтүү чыктыңыз",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Ката кетти",
      });
    }
  };

  const isAdmin = profile?.role === "admin";
  const isPartner = profile?.role === "partner" || isAdmin;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl text-kyrgyz-red">
              ToiBek
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Башкы бет
            </Link>
            <Link
              to="/catalog"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/catalog") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Каталог
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/admin") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Админ панели
              </Link>
            )}
          </div>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {loading ? (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted">...</AvatarFallback>
            </Avatar>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || "Колдонуучу"} />
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
                          ? "Администратор" 
                          : profile.role === "partner"
                          ? "Өнөктөш"
                          : "Колдонуучу"}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Жеке кабинет</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings" className="flex items-center">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Профиль жөндөөлөрү</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/profile/favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Тандалмалар</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/profile/history" className="flex items-center">
                    <History className="mr-2 h-4 w-4" />
                    <span>Тарых</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {isPartner && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/create-event" className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Майрамды чогултуу</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/apply-event" className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Майрамга арыз берүү</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/profile/services" className="flex items-center">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Менин кызматтарым</span>
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
                        <span>Админ панели</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Чыгуу</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={() => navigate("/auth")}>
              Кирүү
            </Button>
          )}

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t py-4">
          <div className="container flex flex-col space-y-3">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary", 
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Башкы бет
            </Link>
            <Link
              to="/catalog"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary", 
                isActive("/catalog") ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Каталог
            </Link>
            
            {user && (
              <>
                <Link
                  to="/profile"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary", 
                    isActive("/profile") ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Жеке кабинет
                </Link>
                <Link
                  to="/profile/favorites"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary", 
                    isActive("/profile/favorites") ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Тандалмалар
                </Link>
              </>
            )}
            
            {isPartner && (
              <>
                <Link
                  to="/profile/services"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary", 
                    isActive("/profile/services") ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Менин кызматтарым
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/admin") ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Админ панели
              </Link>
            )}
            
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="mt-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Чыгуу
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
                className="mt-2"
              >
                <User className="mr-2 h-4 w-4" />
                Кирүү
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

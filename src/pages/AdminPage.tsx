import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "@/components/admin/UsersTab";
import { CatalogItemsTab } from "@/components/admin/CatalogItemsTab";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { Loader } from "lucide-react";

const AdminPage = () => {
  const { isAdmin, loading, currentRole } = useRoleCheck();
  const navigate = useNavigate();

  useEffect(() => {
    // Double-check on client side for extra security
    if (!loading && !isAdmin) {
      console.warn('⚠️ Non-admin attempted to access admin page, role:', currentRole);
      navigate('/');
    }
  }, [isAdmin, loading, navigate, currentRole]);

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Extra guard before rendering
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Администратор панели</h1>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Колдонуучулар</TabsTrigger>
          <TabsTrigger value="catalog">Каталог</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="catalog">
          <CatalogItemsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;

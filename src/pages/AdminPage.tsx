
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "@/components/admin/UsersTab";
import { CatalogItemsTab } from "@/components/admin/CatalogItemsTab";

const AdminPage = () => {
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

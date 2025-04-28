
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlacesTab } from "./catalog/PlacesTab";
import { ArtistsTab } from "./catalog/ArtistsTab";
import { RentalsTab } from "./catalog/RentalsTab";

export const CatalogItemsTab = () => {
  return (
    <Tabs defaultValue="places">
      <TabsList className="mb-6">
        <TabsTrigger value="places">Жайлар</TabsTrigger>
        <TabsTrigger value="artists">Артисттер</TabsTrigger>
        <TabsTrigger value="rentals">Ижара</TabsTrigger>
      </TabsList>
      
      <TabsContent value="places">
        <PlacesTab />
      </TabsContent>
      
      <TabsContent value="artists">
        <ArtistsTab />
      </TabsContent>
      
      <TabsContent value="rentals">
        <RentalsTab />
      </TabsContent>
    </Tabs>
  );
};

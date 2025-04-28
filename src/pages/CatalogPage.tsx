
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterControls } from "@/components/catalog/FilterControls";
import { VenuesTab } from "@/components/catalog/VenuesTab";
import { ArtistsTab } from "@/components/catalog/ArtistsTab";
import { RentalsTab } from "@/components/catalog/RentalsTab";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";

const CatalogPage = () => {
  const { searchQuery, setSearchQuery, priceSort, setPriceSort, filterItems } = useCatalogFilters();

  return (
    <div className="container px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Каталог</h1>
      
      <FilterControls 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priceSort={priceSort}
        onPriceSortChange={setPriceSort}
      />

      <Tabs defaultValue="venues">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="venues">Жайлар</TabsTrigger>
          <TabsTrigger value="artists">Артисттер</TabsTrigger>
          <TabsTrigger value="equipment">Ижара</TabsTrigger>
        </TabsList>
        
        <TabsContent value="venues">
          <VenuesTab filterItems={filterItems} />
        </TabsContent>
        
        <TabsContent value="artists">
          <ArtistsTab filterItems={filterItems} />
        </TabsContent>
        
        <TabsContent value="equipment">
          <RentalsTab filterItems={filterItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogPage;

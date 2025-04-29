
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterControls } from "@/components/catalog/FilterControls";
import { VenuesTab } from "@/components/catalog/VenuesTab";
import { ArtistsTab } from "@/components/catalog/ArtistsTab";
import { RentalsTab } from "@/components/catalog/RentalsTab";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { useTranslation } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const CatalogPage = () => {
  const { searchQuery, setSearchQuery, priceSort, setPriceSort, filterItems } = useCatalogFilters();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="container px-4 py-4 md:py-8 animate-fade-in max-w-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">{t("nav.catalog")}</h1>
      
      <FilterControls 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priceSort={priceSort}
        onPriceSortChange={setPriceSort}
      />

      <Tabs defaultValue="venues" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
          <TabsTrigger value="venues" className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-3">
            {t("catalog.categories.venues")}
          </TabsTrigger>
          <TabsTrigger value="artists" className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-3">
            {t("catalog.categories.artists")}
          </TabsTrigger>
          <TabsTrigger value="equipment" className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-3">
            {t("catalog.categories.equipment")}
          </TabsTrigger>
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

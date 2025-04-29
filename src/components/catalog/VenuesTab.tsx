
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaceCard } from "./PlaceCard";
import { useTranslation } from "@/contexts/LanguageContext";

interface VenuesTabProps {
  filterItems: <T extends { name: string; description?: string; price?: string }>(items: T[]) => T[];
}

export const VenuesTab = ({ filterItems }: VenuesTabProps) => {
  const { t } = useTranslation();
  const { data: places = [], isLoading } = useQuery({
    queryKey: ['places'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div className="text-center py-4 md:py-8">{t("common.loading")}</div>;
  }

  const filteredPlaces = filterItems(places);

  if (filteredPlaces.length === 0) {
    return <div className="text-center py-4 md:py-8">{t("catalog.noItems")}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredPlaces.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};

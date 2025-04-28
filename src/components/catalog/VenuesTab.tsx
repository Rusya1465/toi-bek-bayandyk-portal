
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaceCard } from "./PlaceCard";

interface VenuesTabProps {
  filterItems: <T extends { name: string; description?: string; price?: string }>(items: T[]) => T[];
}

export const VenuesTab = ({ filterItems }: VenuesTabProps) => {
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
    return <div className="text-center py-8">Жүктөлүүдө...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filterItems(places).map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArtistCard } from "./ArtistCard";

interface ArtistsTabProps {
  filterItems: <T extends { name: string; description?: string; price?: string }>(items: T[]) => T[];
}

export const ArtistsTab = ({ filterItems }: ArtistsTabProps) => {
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
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
      {filterItems(artists).map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
};

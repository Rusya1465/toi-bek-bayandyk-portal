
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArtistCard } from "./ArtistCard";
import { useTranslation } from "@/contexts/LanguageContext";

interface ArtistsTabProps {
  filterItems: <T extends { name: string; description?: string; price?: string }>(items: T[]) => T[];
}

export const ArtistsTab = ({ filterItems }: ArtistsTabProps) => {
  const { t } = useTranslation();
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
    return <div className="text-center py-4 md:py-8">{t("common.loading")}</div>;
  }

  const filteredArtists = filterItems(artists);

  if (filteredArtists.length === 0) {
    return <div className="text-center py-4 md:py-8">{t("catalog.noItems")}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredArtists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
};

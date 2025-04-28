
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    genre?: string;
    image_url?: string;
    rating?: number;
    name_ru?: string;
    name_kg?: string;
    description_ru?: string;
    description_kg?: string;
    price_ru?: string;
    price_kg?: string;
    genre_ru?: string;
    genre_kg?: string;
  };
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const { getLocalizedField, t } = useTranslation();

  const name = getLocalizedField(artist, "name");
  const description = getLocalizedField(artist, "description");
  const price = getLocalizedField(artist, "price");
  const genre = getLocalizedField(artist, "genre");
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img 
          src={artist.image_url || "https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-base sm:text-lg line-clamp-1">{name}</CardTitle>
          <span className="px-2 py-1 bg-muted text-xs sm:text-sm rounded-md whitespace-nowrap ml-2">
            ⭐ {artist.rating || t("catalog.newItem")}
          </span>
        </div>
        <CardDescription className="mb-3 line-clamp-2 text-xs sm:text-sm">
          {description || t("catalog.noDescription")}
        </CardDescription>
        <div className="flex flex-col space-y-1 text-xs sm:text-sm mt-auto mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("catalog.price")}:</span>
            <span className="font-medium truncate max-w-[60%] text-right">{price || t("catalog.priceOnRequest")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("catalog.genre")}:</span>
            <span className="font-medium truncate max-w-[60%] text-right">{genre || t("catalog.notSpecified")}</span>
          </div>
        </div>
        <Button className="w-full text-sm h-9" asChild>
          <Link to={`/artists/${artist.id}`}>{t("catalog.moreDetails")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

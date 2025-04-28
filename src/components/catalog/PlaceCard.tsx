
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    capacity?: string;
    address?: string;
    image_url?: string;
    rating?: number;
    name_ru?: string;
    name_kg?: string;
    description_ru?: string;
    description_kg?: string;
    price_ru?: string;
    price_kg?: string;
    capacity_ru?: string;
    capacity_kg?: string;
    address_ru?: string;
    address_kg?: string;
  };
}

export const PlaceCard = ({ place }: PlaceCardProps) => {
  const { getLocalizedField, t } = useTranslation();

  const name = getLocalizedField(place, "name");
  const description = getLocalizedField(place, "description");
  const price = getLocalizedField(place, "price");
  const capacity = getLocalizedField(place, "capacity");
  const address = getLocalizedField(place, "address");
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img 
          src={place.image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-base sm:text-lg line-clamp-1">{name}</CardTitle>
          <span className="px-2 py-1 bg-muted text-xs sm:text-sm rounded-md whitespace-nowrap ml-2">
            ⭐ {place.rating || t("catalog.newItem")}
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
            <span className="text-muted-foreground">{t("catalog.capacity")}:</span>
            <span className="font-medium truncate max-w-[60%] text-right">{capacity || t("catalog.notSpecified")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("catalog.address")}:</span>
            <span className="font-medium truncate max-w-[60%] text-right">{address || t("catalog.notSpecified")}</span>
          </div>
        </div>
        <Button className="w-full text-sm h-9" asChild>
          <Link to={`/places/${place.id}`}>{t("catalog.moreDetails")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

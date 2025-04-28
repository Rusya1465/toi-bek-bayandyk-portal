
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";

interface RentalCardProps {
  rental: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    specs?: string;
    image_url?: string;
    rating?: number;
    name_ru?: string;
    name_kg?: string;
    description_ru?: string;
    description_kg?: string;
    price_ru?: string;
    price_kg?: string;
    specs_ru?: string;
    specs_kg?: string;
  };
}

export const RentalCard = ({ rental }: RentalCardProps) => {
  const { getLocalizedField, t } = useTranslation();

  const name = getLocalizedField(rental, "name");
  const description = getLocalizedField(rental, "description");
  const price = getLocalizedField(rental, "price");
  const specs = getLocalizedField(rental, "specs");
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img 
          src={rental.image_url || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{name}</CardTitle>
          <span className="px-2 py-1 bg-muted text-sm rounded-md">
            ⭐ {rental.rating || t("catalog.newItem")}
          </span>
        </div>
        <CardDescription className="mb-4">{description || t("catalog.noDescription")}</CardDescription>
        <div className="flex flex-col space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("catalog.price")}:</span>
            <span className="font-medium">{price || t("catalog.priceOnRequest")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("catalog.specs")}:</span>
            <span className="font-medium">{specs || t("catalog.notSpecified")}</span>
          </div>
        </div>
        <Button className="w-full mt-4" asChild>
          <Link to={`/rentals/${rental.id}`}>{t("catalog.moreDetails")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

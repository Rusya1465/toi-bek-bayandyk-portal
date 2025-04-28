
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const PlaceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, getLocalizedField } = useTranslation();

  const { data: place, isLoading, error } = useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error(t("catalog.placeNotFound"));
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-8 flex justify-center">{t("common.loading")}</div>;
  }

  if (error || !place) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("common.error")}</h1>
          <p className="mb-4">{error instanceof Error ? error.message : t("catalog.placeNotFound")}</p>
          <Button asChild><Link to="/catalog">{t("catalog.backToCatalog")}</Link></Button>
        </div>
      </div>
    );
  }

  // Get localized fields
  const name = getLocalizedField(place, "name");
  const description = getLocalizedField(place, "description");
  const address = getLocalizedField(place, "address");
  const capacity = getLocalizedField(place, "capacity");
  const price = getLocalizedField(place, "price");
  const contacts = getLocalizedField(place, "contacts");

  return (
    <div className="container py-8">
      <Link to="/catalog" className="flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>{t("catalog.backToCatalog")}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-lg mb-4">
            <img 
              src={place.image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="flex items-center px-2 py-1 bg-muted rounded-md">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
              <span>{place.rating || t("catalog.newItem")}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{description || t("catalog.noDescription")}</p>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">{t("catalog.price")}:</span>
              <span>{price || t("catalog.priceOnRequest")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("catalog.capacity")}:</span>
              <span>{capacity || t("catalog.notSpecified")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("catalog.address")}:</span>
              <span>{address || t("catalog.notSpecified")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("catalog.contacts")}:</span>
              <span>{contacts || t("catalog.notSpecified")}</span>
            </div>
          </div>

          <Button className="w-full">{t("catalog.requestPlace")}</Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;

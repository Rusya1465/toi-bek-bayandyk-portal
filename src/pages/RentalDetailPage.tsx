
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const RentalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, getLocalizedField } = useTranslation();

  const { data: rental, isLoading, error } = useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error(t("catalog.rentalNotFound"));
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-8 flex justify-center">{t("common.loading")}</div>;
  }

  if (error || !rental) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("common.error")}</h1>
          <p className="mb-4">{error instanceof Error ? error.message : t("catalog.rentalNotFound")}</p>
          <Button asChild><Link to="/catalog">{t("catalog.backToCatalog")}</Link></Button>
        </div>
      </div>
    );
  }

  // Get localized fields
  const name = getLocalizedField(rental, "name");
  const description = getLocalizedField(rental, "description");
  const specs = getLocalizedField(rental, "specs");
  const price = getLocalizedField(rental, "price");
  const contacts = getLocalizedField(rental, "contacts");

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
              src={rental.image_url || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
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
              <span>{rental.rating || t("catalog.newItem")}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{description || t("catalog.noDescription")}</p>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">{t("catalog.specs")}:</span>
              <span>{specs || t("catalog.notSpecified")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("catalog.price")}:</span>
              <span>{price || t("catalog.priceOnRequest")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("catalog.contacts")}:</span>
              <span>{contacts || t("catalog.notSpecified")}</span>
            </div>
          </div>

          <Button className="w-full">{t("catalog.requestRental")}</Button>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailPage;

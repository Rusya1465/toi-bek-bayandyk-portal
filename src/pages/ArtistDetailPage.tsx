
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Music, Clock, CalendarDays } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, getLocalizedField } = useTranslation();

  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error(t("catalog.artistNotFound"));
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("common.error")}</h1>
          <p className="mb-4">{error instanceof Error ? error.message : t("catalog.artistNotFound")}</p>
          <Button asChild><Link to="/catalog">{t("catalog.backToCatalog")}</Link></Button>
        </div>
      </div>
    );
  }

  // Get localized fields
  const name = getLocalizedField(artist, "name");
  const description = getLocalizedField(artist, "description");
  const genre = getLocalizedField(artist, "genre");
  const price = getLocalizedField(artist, "price");
  const experience = getLocalizedField(artist, "experience");
  const contacts = getLocalizedField(artist, "contacts");

  return (
    <div className="container py-6 md:py-8">
      <Link to="/catalog" className="flex items-center text-muted-foreground mb-4 md:mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>{t("catalog.backToCatalog")}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-lg mb-4">
            <img 
              src={artist.image_url || "https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={name} 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
          
          {/* Mobile title section (visible only on mobile) */}
          <div className="lg:hidden mb-4">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
              <div className="flex items-center px-2 py-1 bg-muted rounded-md">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span>{artist.rating || t("catalog.newItem")}</span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {genre && (
                <div className="flex items-start text-sm">
                  <Music className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{genre}</span>
                </div>
              )}
              
              {experience && (
                <div className="flex items-start text-sm">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{experience}</span>
                </div>
              )}
              
              {price && (
                <div className="flex items-start text-sm">
                  <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{price} / {t("catalog.perPerformance")}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="prose max-w-none prose-sm sm:prose-base">
            <h2 className="text-xl font-semibold mb-2">{t("catalog.description")}</h2>
            <p>{description || t("catalog.noDescription")}</p>
          </div>
        </div>

        <div className="space-y-4 order-first lg:order-last">
          {/* Desktop title section (hidden on mobile) */}
          <div className="hidden lg:block">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{name}</h1>
              <div className="flex items-center px-2 py-1 bg-muted rounded-md">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span>{artist.rating || t("catalog.newItem")}</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-3 shadow-sm border">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("catalog.price")}:</span>
                <span className="text-lg font-semibold text-primary">{price || t("catalog.priceOnRequest")}</span>
              </div>
              
              <div className="h-px bg-border"></div>
              
              <div className="space-y-2">
                {genre && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("catalog.genre")}:</span>
                    <span>{genre}</span>
                  </div>
                )}
                
                {experience && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("catalog.experience")}:</span>
                    <span>{experience}</span>
                  </div>
                )}
                
                {contacts && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("catalog.contacts")}:</span>
                    <span className="text-right max-w-[60%]">{contacts}</span>
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full mt-2">{t("catalog.requestArtist")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailPage;

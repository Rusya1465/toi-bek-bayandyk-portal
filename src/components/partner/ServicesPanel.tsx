
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PlacesList } from "./services/PlacesList";
import { ArtistsList } from "./services/ArtistsList";
import { RentalsList } from "./services/RentalsList";
import { useTranslation } from "@/contexts/LanguageContext";

export const ServicesPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("places");
  const [loading, setLoading] = useState<boolean>(true);
  const [places, setPlaces] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user, activeTab]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      if (activeTab === "places" || activeTab === "all") {
        const { data: placesData, error: placesError } = await supabase
          .from("places")
          .select("*")
          .eq("owner_id", user?.id);
        
        if (placesError) throw placesError;
        setPlaces(placesData || []);
      }

      if (activeTab === "artists" || activeTab === "all") {
        const { data: artistsData, error: artistsError } = await supabase
          .from("artists")
          .select("*")
          .eq("owner_id", user?.id);
        
        if (artistsError) throw artistsError;
        setArtists(artistsData || []);
      }

      if (activeTab === "rentals" || activeTab === "all") {
        const { data: rentalsData, error: rentalsError } = await supabase
          .from("rentals")
          .select("*")
          .eq("owner_id", user?.id);
        
        if (rentalsError) throw rentalsError;
        setRentals(rentalsData || []);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: t("services.messages.updateError") + ": " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = () => {
    navigate(`/create-service/${activeTab}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("nav.services")}</h2>
        <Button onClick={handleCreateService}>
          <Plus className="h-4 w-4 mr-2" />
          {t("services.buttons.createService")}
        </Button>
      </div>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="places">{t("catalog.categories.venues")}</TabsTrigger>
          <TabsTrigger value="artists">{t("catalog.categories.artists")}</TabsTrigger>
          <TabsTrigger value="rentals">{t("catalog.categories.equipment")}</TabsTrigger>
        </TabsList>

        <TabsContent value="places">
          <PlacesList places={places} loading={loading} onRefresh={fetchServices} />
        </TabsContent>
        
        <TabsContent value="artists">
          <ArtistsList artists={artists} loading={loading} onRefresh={fetchServices} />
        </TabsContent>
        
        <TabsContent value="rentals">
          <RentalsList rentals={rentals} loading={loading} onRefresh={fetchServices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

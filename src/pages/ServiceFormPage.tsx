
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/contexts/LanguageContext";

// Import new step form components (we'll create these next)
import { PlaceStepForm } from "@/components/partner/forms/PlaceStepForm";
import { ArtistStepForm } from "@/components/partner/forms/ArtistStepForm";
import { RentalStepForm } from "@/components/partner/forms/RentalStepForm";

type ServiceType = "places" | "artists" | "rentals";

const ServiceFormPage = () => {
  const { type = "places", id } = useParams<{ type?: string; id?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<any>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      fetchServiceData();
    }
  }, [id, type]);

  const fetchServiceData = async () => {
    setLoading(true);
    try {
      let table: ServiceType;
      switch (type) {
        case "artists":
          table = "artists";
          break;
        case "rentals":
          table = "rentals";
          break;
        default:
          table = "places";
      }

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Verify ownership
      if (data.owner_id !== user?.id && profile?.role !== "admin") {
        toast({
          variant: "destructive",
          description: t("services.messages.updateError"),
        });
        navigate("/profile/services");
        return;
      }

      setServiceData(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: t("services.messages.updateError") + ": " + error.message,
      });
      navigate("/profile/services");
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    const baseKey = isEditing 
      ? "services.editTitle"
      : "services.createTitle";
      
    switch (type) {
      case "artists":
        return t(`${baseKey}.artists`);
      case "rentals":
        return t(`${baseKey}.rentals`);
      default:
        return t(`${baseKey}.places`);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("common.loading")}</span>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{getFormTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={type} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger
                value="places"
                onClick={() => !isEditing && navigate("/create-service/places")}
                disabled={isEditing}
              >
                {t("catalog.categories.venues")}
              </TabsTrigger>
              <TabsTrigger
                value="artists"
                onClick={() => !isEditing && navigate("/create-service/artists")}
                disabled={isEditing}
              >
                {t("catalog.categories.artists")}
              </TabsTrigger>
              <TabsTrigger
                value="rentals"
                onClick={() => !isEditing && navigate("/create-service/rentals")}
                disabled={isEditing}
              >
                {t("catalog.categories.equipment")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="places">
              <PlaceStepForm initialData={serviceData} isEditing={isEditing} />
            </TabsContent>

            <TabsContent value="artists">
              <ArtistStepForm initialData={serviceData} isEditing={isEditing} />
            </TabsContent>

            <TabsContent value="rentals">
              <RentalStepForm initialData={serviceData} isEditing={isEditing} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceFormPage;

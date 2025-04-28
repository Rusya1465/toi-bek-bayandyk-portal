
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceForm } from "@/components/partner/forms/PlaceForm";
import { ArtistForm } from "@/components/partner/forms/ArtistForm";
import { RentalForm } from "@/components/partner/forms/RentalForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceType = "places" | "artists" | "rentals";

const ServiceFormPage = () => {
  const { type = "places", id } = useParams<{ type?: string; id?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<any>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
          description: "Сизде бул кызматты редактирлөөгө уруксат жок",
        });
        navigate("/profile/services");
        return;
      }

      setServiceData(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: "Кызмат маалыматтарын алууда ката кетти: " + error.message,
      });
      navigate("/profile/services");
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    const action = isEditing ? "Редактирлөө" : "Түзүү";
    switch (type) {
      case "artists":
        return `Артист ${action}`;
      case "rentals":
        return `Ижара ${action}`;
      default:
        return `Жай ${action}`;
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader className="h-8 w-8 animate-spin" />
        <span className="ml-2">Жүктөлүүдө...</span>
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
                Жайлар
              </TabsTrigger>
              <TabsTrigger
                value="artists"
                onClick={() => !isEditing && navigate("/create-service/artists")}
                disabled={isEditing}
              >
                Артисттер
              </TabsTrigger>
              <TabsTrigger
                value="rentals"
                onClick={() => !isEditing && navigate("/create-service/rentals")}
                disabled={isEditing}
              >
                Ижара
              </TabsTrigger>
            </TabsList>

            <TabsContent value="places">
              <PlaceForm initialData={serviceData} isEditing={isEditing} />
            </TabsContent>

            <TabsContent value="artists">
              <ArtistForm initialData={serviceData} isEditing={isEditing} />
            </TabsContent>

            <TabsContent value="rentals">
              <RentalForm initialData={serviceData} isEditing={isEditing} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceFormPage;

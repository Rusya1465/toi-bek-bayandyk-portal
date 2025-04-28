
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

const PlaceDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: place, isLoading, error } = useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Жай табылган жок');
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-8 flex justify-center">Жүктөлүүдө...</div>;
  }

  if (error || !place) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ката кетти</h1>
          <p className="mb-4">{error instanceof Error ? error.message : 'Жай табылган жок'}</p>
          <Button asChild><Link to="/catalog">Каталогго кайтуу</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link to="/catalog" className="flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Каталогго кайтуу</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-lg mb-4">
            <img 
              src={place.image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={place.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{place.name}</h1>
            <div className="flex items-center px-2 py-1 bg-muted rounded-md">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
              <span>{place.rating || "Жаңы"}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{place.description || "Сүрөттөмө жок"}</p>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Баасы:</span>
              <span>{place.price || "Келишим боюнча"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Сыйымдуулугу:</span>
              <span>{place.capacity || "Көрсөтүлгөн эмес"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Дареги:</span>
              <span>{place.address || "Көрсөтүлгөн эмес"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Байланыш:</span>
              <span>{place.contacts || "Көрсөтүлгөн эмес"}</span>
            </div>
          </div>

          <Button className="w-full">Кабыл алуу үчүн суранам</Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;

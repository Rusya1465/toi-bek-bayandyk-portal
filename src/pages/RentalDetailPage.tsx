
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

const RentalDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: rental, isLoading, error } = useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Жабдык табылган жок');
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-8 flex justify-center">Жүктөлүүдө...</div>;
  }

  if (error || !rental) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ката кетти</h1>
          <p className="mb-4">{error instanceof Error ? error.message : 'Жабдык табылган жок'}</p>
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
              src={rental.image_url || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={rental.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{rental.name}</h1>
            <div className="flex items-center px-2 py-1 bg-muted rounded-md">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
              <span>{rental.rating || "Жаңы"}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{rental.description || "Сүрөттөмө жок"}</p>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Техникалык мүнөздөмө:</span>
              <span>{rental.specs || "Көрсөтүлгөн эмес"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Баасы:</span>
              <span>{rental.price || "Келишим боюнча"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Байланыш:</span>
              <span>{rental.contacts || "Көрсөтүлгөн эмес"}</span>
            </div>
          </div>

          <Button className="w-full">Ижарага алуу үчүн суранам</Button>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailPage;

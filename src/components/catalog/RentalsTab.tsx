
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RentalCard } from "./RentalCard";

interface RentalsTabProps {
  filterItems: <T extends { name: string; description?: string; price?: string }>(items: T[]) => T[];
}

export const RentalsTab = ({ filterItems }: RentalsTabProps) => {
  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ['rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Жүктөлүүдө...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filterItems(rentals).map((rental) => (
        <RentalCard key={rental.id} rental={rental} />
      ))}
    </div>
  );
};

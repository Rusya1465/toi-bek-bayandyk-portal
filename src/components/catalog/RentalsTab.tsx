
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RentalCard } from "./RentalCard";
import { useTranslation } from "@/contexts/LanguageContext";

interface RentalsTabProps {
  filterItems: <T extends { name: string; description?: string; price?: string }>(items: T[]) => T[];
}

export const RentalsTab = ({ filterItems }: RentalsTabProps) => {
  const { t } = useTranslation();
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
    return <div className="text-center py-4 md:py-8">{t("common.loading")}</div>;
  }

  const filteredRentals = filterItems(rentals);

  if (filteredRentals.length === 0) {
    return <div className="text-center py-4 md:py-8">{t("catalog.noItems")}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredRentals.map((rental) => (
        <RentalCard key={rental.id} rental={rental} />
      ))}
    </div>
  );
};

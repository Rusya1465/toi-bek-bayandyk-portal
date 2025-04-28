
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export const RentalsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch rentals
  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ['admin-rentals'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('rentals').select('*');
        if (error) throw error;
        return data;
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: "Ижараларды жүктөөдө ката: " + error.message,
        });
        return [];
      }
    },
  });

  // Delete rental mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rentals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        description: "Элемент ийгиликтүү өчүрүлдү",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-rentals'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: "Өчүрүүдө ката кетти: " + error.message,
      });
    }
  });

  // Delete rental
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ижара</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Аталышы</TableHead>
                  <TableHead>Тех. мүнөздөмө</TableHead>
                  <TableHead>Баасы</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Аракеттер</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Ижаралар табылган жок
                    </TableCell>
                  </TableRow>
                ) : (
                  rentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>{rental.name}</TableCell>
                      <TableCell>{rental.specs || '-'}</TableCell>
                      <TableCell>{rental.price || '-'}</TableCell>
                      <TableCell>{rental.rating || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(rental.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Өчүрүү
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

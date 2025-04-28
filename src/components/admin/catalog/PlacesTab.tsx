
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

export const PlacesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch catalog items
  const { data: places = [], isLoading } = useQuery({
    queryKey: ['admin-places'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('places').select('*');
        if (error) throw error;
        return data;
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: "Жайларды жүктөөдө ката: " + error.message,
        });
        return [];
      }
    },
  });

  // Delete catalog item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        description: "Элемент ийгиликтүү өчүрүлдү",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-places'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: "Өчүрүүдө ката кетти: " + error.message,
      });
    }
  });

  // Delete catalog item
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Жайлар</CardTitle>
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
                  <TableHead>Дареги</TableHead>
                  <TableHead>Баасы</TableHead>
                  <TableHead>Сыйымдуулугу</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Аракеттер</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {places.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Жайлар табылган жок
                    </TableCell>
                  </TableRow>
                ) : (
                  places.map((place) => (
                    <TableRow key={place.id}>
                      <TableCell>{place.name}</TableCell>
                      <TableCell>{place.address || '-'}</TableCell>
                      <TableCell>{place.price || '-'}</TableCell>
                      <TableCell>{place.capacity || '-'}</TableCell>
                      <TableCell>{place.rating || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(place.id)}
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

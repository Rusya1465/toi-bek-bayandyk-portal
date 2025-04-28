
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

export const ArtistsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch artists
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('artists').select('*');
        if (error) throw error;
        return data;
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: "Артисттерди жүктөөдө ката: " + error.message,
        });
        return [];
      }
    },
  });

  // Delete artist mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        description: "Элемент ийгиликтүү өчүрүлдү",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: "Өчүрүүдө ката кетти: " + error.message,
      });
    }
  });

  // Delete artist
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Артисттер</CardTitle>
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
                  <TableHead>Аты-жөнү</TableHead>
                  <TableHead>Жанр</TableHead>
                  <TableHead>Тажрыйба</TableHead>
                  <TableHead>Баасы</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Аракеттер</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Артисттер табылган жок
                    </TableCell>
                  </TableRow>
                ) : (
                  artists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell>{artist.name}</TableCell>
                      <TableCell>{artist.genre || '-'}</TableCell>
                      <TableCell>{artist.experience || '-'}</TableCell>
                      <TableCell>{artist.price || '-'}</TableCell>
                      <TableCell>{artist.rating || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(artist.id)}
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

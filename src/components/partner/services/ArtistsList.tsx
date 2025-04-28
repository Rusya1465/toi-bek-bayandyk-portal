
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Artist {
  id: string;
  name: string;
  genre: string | null;
  experience: string | null;
  price: string | null;
  image_url: string | null;
}

interface ArtistsListProps {
  artists: Artist[];
  loading: boolean;
  onRefresh: () => void;
}

export const ArtistsList = ({ artists, loading, onRefresh }: ArtistsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    navigate(`/edit-service/artists/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/artists/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("artists")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        description: "Артист ийгиликтүү өчүрүлдү",
      });
      onRefresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: "Артистти өчүрүүдө ката кетти: " + error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Сиз али эч кандай артист түзө элексиз</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artists.map((artist) => (
        <Card key={artist.id} className="overflow-hidden">
          <CardHeader className="p-0">
            {artist.image_url ? (
              <img
                src={artist.image_url}
                alt={artist.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Сүрөт жок</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{artist.name}</CardTitle>
            {artist.genre && <p className="text-sm text-muted-foreground">Жанр: {artist.genre}</p>}
            {artist.experience && <p className="text-sm">Тажрыйба: {artist.experience}</p>}
            {artist.price && <p className="font-medium mt-2">Баасы: {artist.price}</p>}
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0">
            <Button variant="outline" size="sm" onClick={() => handleView(artist.id)}>
              <Eye className="h-4 w-4 mr-1" /> Көрүү
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(artist.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Өчүрүүнү каалайсызбы?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Бул аракетти артка кайтаруу мүмкүн эмес. Бул артист биротоло өчүрүлөт.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Жок</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(artist.id)}>Ооба, өчүрүү</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

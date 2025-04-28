
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    genre?: string;
    image_url?: string;
    rating?: number;
  };
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img 
          src={artist.image_url || "https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
          alt={artist.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{artist.name}</CardTitle>
          <span className="px-2 py-1 bg-muted text-sm rounded-md">
            ⭐ {artist.rating || "Жаңы"}
          </span>
        </div>
        <CardDescription className="mb-4">{artist.description || "Сүрөттөмө жок"}</CardDescription>
        <div className="flex flex-col space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Баасы:</span>
            <span className="font-medium">{artist.price || "Келишим боюнча"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Жанр:</span>
            <span className="font-medium">{artist.genre || "Көрсөтүлгөн эмес"}</span>
          </div>
        </div>
        <Button className="w-full mt-4" asChild>
          <Link to={`/artists/${artist.id}`}>Көбүрөөк маалымат</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

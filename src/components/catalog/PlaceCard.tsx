
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    capacity?: string;
    address?: string;
    image_url?: string;
    rating?: number;
  };
}

export const PlaceCard = ({ place }: PlaceCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img 
          src={place.image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
          alt={place.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{place.name}</CardTitle>
          <span className="px-2 py-1 bg-muted text-sm rounded-md">
            ⭐ {place.rating || "Жаңы"}
          </span>
        </div>
        <CardDescription className="mb-4">{place.description || "Сүрөттөмө жок"}</CardDescription>
        <div className="flex flex-col space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Баасы:</span>
            <span className="font-medium">{place.price || "Келишим боюнча"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Сыйымдуулугу:</span>
            <span className="font-medium">{place.capacity || "Көрсөтүлгөн эмес"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Дареги:</span>
            <span className="font-medium">{place.address || "Көрсөтүлгөн эмес"}</span>
          </div>
        </div>
        <Button className="w-full mt-4" asChild>
          <Link to={`/places/${place.id}`}>Көбүрөөк маалымат</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

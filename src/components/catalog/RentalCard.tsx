
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RentalCardProps {
  rental: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    specs?: string;
    image_url?: string;
    rating?: number;
  };
}

export const RentalCard = ({ rental }: RentalCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img 
          src={rental.image_url || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
          alt={rental.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{rental.name}</CardTitle>
          <span className="px-2 py-1 bg-muted text-sm rounded-md">
            ⭐ {rental.rating || "Жаңы"}
          </span>
        </div>
        <CardDescription className="mb-4">{rental.description || "Сүрөттөмө жок"}</CardDescription>
        <div className="flex flex-col space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Баасы:</span>
            <span className="font-medium">{rental.price || "Келишим боюнча"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Техникалык мүнөздөмө:</span>
            <span className="font-medium">{rental.specs || "Көрсөтүлгөн эмес"}</span>
          </div>
        </div>
        <Button className="w-full mt-4" asChild>
          <Link to={`/rentals/${rental.id}`}>Көбүрөөк маалымат</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

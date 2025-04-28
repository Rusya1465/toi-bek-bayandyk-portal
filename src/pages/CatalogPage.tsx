
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSort, setPriceSort] = useState("");

  // Fetch places from Supabase
  const { data: places = [], isLoading: placesLoading } = useQuery({
    queryKey: ['places'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch artists from Supabase
  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch rentals from Supabase
  const { data: rentals = [], isLoading: rentalsLoading } = useQuery({
    queryKey: ['rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  const filterItems = (items: any[]) => {
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (priceSort === "asc") {
          return parseInt(a.price || '0') - parseInt(b.price || '0');
        } else if (priceSort === "desc") {
          return parseInt(b.price || '0') - parseInt(a.price || '0');
        }
        return 0;
      });
  };

  return (
    <div className="container px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Каталог</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Издөө..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger>
              <SelectValue placeholder="Баасы боюнча" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Баасы боюнча</SelectItem>
              <SelectItem value="asc">Арзандан кымбатка</SelectItem>
              <SelectItem value="desc">Кымбаттан арзанга</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="venues">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="venues">Жайлар</TabsTrigger>
          <TabsTrigger value="artists">Артисттер</TabsTrigger>
          <TabsTrigger value="equipment">Ижара</TabsTrigger>
        </TabsList>
        
        <TabsContent value="venues">
          {placesLoading ? (
            <div className="text-center py-8">Жүктөлүүдө...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItems(places).map((place) => (
                <Card key={place.id} className="overflow-hidden">
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
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="artists">
          {artistsLoading ? (
            <div className="text-center py-8">Жүктөлүүдө...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItems(artists).map((artist) => (
                <Card key={artist.id} className="overflow-hidden">
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
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="equipment">
          {rentalsLoading ? (
            <div className="text-center py-8">Жүктөлүүдө...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItems(rentals).map((rental) => (
                <Card key={rental.id} className="overflow-hidden">
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
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogPage;

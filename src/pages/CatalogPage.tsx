
import { useState } from "react";
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

interface Venue {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  capacity: string;
  rating: number;
  location: string;
}

interface Artist {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  specialization: string;
  rating: number;
}

interface Equipment {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  condition: string;
  rating: number;
}

const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSort, setPriceSort] = useState("");

  const venues: Venue[] = [
    {
      id: 1,
      name: "Ак Кеме",
      description: "Шаардын борборунда жайгашкан заманбап ресторан",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "30000 сом",
      capacity: "200 киши",
      rating: 4.8,
      location: "Бишкек, Чүй проспектиси",
    },
    {
      id: 2,
      name: "Хан Теңир",
      description: "Улуттук стилдеги ажайып банкеттик зал",
      image: "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "25000 сом",
      capacity: "150 киши",
      rating: 4.5,
      location: "Бишкек, Ахунбаев көчөсү",
    },
    {
      id: 3,
      name: "Золотой Дракон",
      description: "Чыгыш стилиндеги атмосфералык ресторан",
      image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "40000 сом",
      capacity: "300 киши",
      rating: 4.7,
      location: "Бишкек, Манас көчөсү",
    },
  ];

  const artists: Artist[] = [
    {
      id: 1,
      name: "Мирбек Атабеков",
      description: "Белгилүү ырчы, залкар үн ээси",
      image: "https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "50000 сом",
      specialization: "Эстрадалык ырчы",
      rating: 5,
    },
    {
      id: 2,
      name: "Гүлзат Алманбетова",
      description: "Кыргыз эстрадасынын жылдызы",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "45000 сом",
      specialization: "Эстрадалык ырчы",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Асан Үсөн уулу",
      description: "Тойлорду жогорку деңгээлде алып баруучу",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "20000 сом",
      specialization: "Тамада",
      rating: 4.7,
    },
  ];

  const equipment: Equipment[] = [
    {
      id: 1,
      name: "Үн күчөткүч система",
      description: "Заманбап үн күчөткүч аппаратура",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "15000 сом",
      condition: "Жаңы",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Жарык системалары",
      description: "RGB жарык эффекттери менен комплект",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "10000 сом",
      condition: "Жаңы",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Проектор жана экран",
      description: "HD сапаттагы проектор жана экран",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      price: "8000 сом",
      condition: "Мыкты",
      rating: 4.5,
    },
  ];

  const filterItems = (items: any[]) => {
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (priceSort === "asc") {
          return parseInt(a.price) - parseInt(b.price);
        } else if (priceSort === "desc") {
          return parseInt(b.price) - parseInt(a.price);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterItems(venues).map((venue) => (
              <Card key={venue.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <span className="px-2 py-1 bg-muted text-sm rounded-md">
                      ⭐ {venue.rating}
                    </span>
                  </div>
                  <CardDescription className="mb-4">{venue.description}</CardDescription>
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Баасы:</span>
                      <span className="font-medium">{venue.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сыйымдуулугу:</span>
                      <span className="font-medium">{venue.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Дареги:</span>
                      <span className="font-medium">{venue.location}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Көбүрөөк маалымат</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="artists">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterItems(artists).map((artist) => (
              <Card key={artist.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{artist.name}</CardTitle>
                    <span className="px-2 py-1 bg-muted text-sm rounded-md">
                      ⭐ {artist.rating}
                    </span>
                  </div>
                  <CardDescription className="mb-4">{artist.description}</CardDescription>
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Баасы:</span>
                      <span className="font-medium">{artist.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Адистик:</span>
                      <span className="font-medium">{artist.specialization}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Көбүрөөк маалымат</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="equipment">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterItems(equipment).map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <span className="px-2 py-1 bg-muted text-sm rounded-md">
                      ⭐ {item.rating}
                    </span>
                  </div>
                  <CardDescription className="mb-4">{item.description}</CardDescription>
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Баасы:</span>
                      <span className="font-medium">{item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Абалы:</span>
                      <span className="font-medium">{item.condition}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Көбүрөөк маалымат</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogPage;

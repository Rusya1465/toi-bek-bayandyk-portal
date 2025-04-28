
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/lib/types/auth";

interface User {
  id: string;
  email: string;
  created_at: string;
  profile?: Profile;
}

const AdminPage = () => {
  const { toast } = useToast();

  // Fetch all users with their profiles
  const { data: users = [], refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all users from Supabase Auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        toast({
          variant: "destructive",
          description: "Колдонуучуларды алууда ката кетти: " + authError.message,
        });
        return [];
      }

      // Get all profiles from the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        toast({
          variant: "destructive",
          description: "Профилдерди алууда ката кетти: " + profilesError.message,
        });
        return [];
      }

      // Combine users with their profiles
      return authUsers.users.map(user => {
        const profile = profiles?.find(p => p.id === user.id);
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          profile,
        };
      });
    },
  });

  // Fetch catalog items
  const { data: places = [], refetch: refetchPlaces } = useQuery({
    queryKey: ['admin-places'],
    queryFn: async () => {
      const { data, error } = await supabase.from('places').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: artists = [], refetch: refetchArtists } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      const { data, error } = await supabase.from('artists').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: rentals = [], refetch: refetchRentals } = useQuery({
    queryKey: ['admin-rentals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rentals').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Update user role
  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        description: "Колдонуучунун ролу ийгиликтүү жаңыртылды",
      });
      
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Катачылык: " + (error instanceof Error ? error.message : String(error)),
      });
    }
  };

  // Delete catalog item
  const deleteCatalogItem = async (table: 'places' | 'artists' | 'rentals', id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        description: "Элемент ийгиликтүү өчүрүлдү",
      });
      
      if (table === 'places') refetchPlaces();
      if (table === 'artists') refetchArtists();
      if (table === 'rentals') refetchRentals();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Катачылык: " + (error instanceof Error ? error.message : String(error)),
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Администратор панели</h1>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Колдонуучулар</TabsTrigger>
          <TabsTrigger value="catalog">Каталог</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Колдонуучулар</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Аты-жөнү</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Кошулган күнү</TableHead>
                      <TableHead>Аракеттер</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.profile?.full_name || '-'}</TableCell>
                        <TableCell>{user.profile?.phone || '-'}</TableCell>
                        <TableCell>
                          <Select
                            value={user.profile?.role || 'user'}
                            onValueChange={(value) => updateUserRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Колдонуучу</SelectItem>
                              <SelectItem value="partner">Өнөктөш</SelectItem>
                              <SelectItem value="admin">Админ</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled
                          >
                            Өчүрүү
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="catalog">
          <Tabs defaultValue="places">
            <TabsList className="mb-6">
              <TabsTrigger value="places">Жайлар</TabsTrigger>
              <TabsTrigger value="artists">Артисттер</TabsTrigger>
              <TabsTrigger value="rentals">Ижара</TabsTrigger>
            </TabsList>
            
            <TabsContent value="places">
              <Card>
                <CardHeader>
                  <CardTitle>Жайлар</CardTitle>
                </CardHeader>
                <CardContent>
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
                        {places.map((place) => (
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
                                onClick={() => deleteCatalogItem('places', place.id)}
                              >
                                Өчүрүү
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="artists">
              <Card>
                <CardHeader>
                  <CardTitle>Артисттер</CardTitle>
                </CardHeader>
                <CardContent>
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
                        {artists.map((artist) => (
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
                                onClick={() => deleteCatalogItem('artists', artist.id)}
                              >
                                Өчүрүү
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rentals">
              <Card>
                <CardHeader>
                  <CardTitle>Ижара</CardTitle>
                </CardHeader>
                <CardContent>
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
                        {rentals.map((rental) => (
                          <TableRow key={rental.id}>
                            <TableCell>{rental.name}</TableCell>
                            <TableCell>{rental.specs || '-'}</TableCell>
                            <TableCell>{rental.price || '-'}</TableCell>
                            <TableCell>{rental.rating || '-'}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteCatalogItem('rentals', rental.id)}
                              >
                                Өчүрүү
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;

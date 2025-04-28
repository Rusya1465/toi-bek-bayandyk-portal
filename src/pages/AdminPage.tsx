
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile } from "@/lib/types/auth";
import { Loader } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  profile?: Profile;
}

const AdminPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users with their profiles
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        // Get all profiles (Supabase auth.admin.listUsers is only available on Edge Functions)
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

        // Get all users that have profiles
        const userIds = profiles.map(profile => profile.id);
        
        try {
          // Try to use admin API first
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (!authError && authData) {
            // If admin API worked, combine users with their profiles
            return authData.users.map(user => {
              const profile = profiles?.find(p => p.id === user.id);
              return {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
                profile,
              };
            });
          }
        } catch (adminError) {
          console.log("Admin API not available:", adminError);
        }
        
        // Fallback to regular user data if admin API fails
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          toast({
            variant: "destructive",
            description: "Колдонуучуларды алууда ката кетти",
          });
          return [];
        }
        
        // Return just the current user with their profile
        if (userData.user) {
          const profile = profiles.find(p => p.id === userData.user.id);
          return [{
            id: userData.user.id,
            email: userData.user.email,
            created_at: userData.user.created_at,
            profile
          }];
        }
        return [];
        
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: "Колдонуучуларды жүктөөдө ката: " + error.message,
        });
        return [];
      }
    },
  });

  // Fetch catalog items
  const { data: places = [], isLoading: placesLoading } = useQuery({
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

  const { data: artists = [], isLoading: artistsLoading } = useQuery({
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

  const { data: rentals = [], isLoading: rentalsLoading } = useQuery({
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

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Fixed: Properly specify the parameter types in the rpc function
      const { data, error } = await supabase.rpc('change_user_role', {
        user_id: userId,
        new_role: role
      } as {
        user_id: string;
        new_role: string;
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        description: "Колдонуучунун ролу ийгиликтүү жаңыртылды",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: "Ролду жаңыртууда ката кетти: " + error.message,
      });
    }
  });

  // Delete catalog item mutation
  const deleteCatalogItemMutation = useMutation({
    mutationFn: async ({ table, id }: { table: 'places' | 'artists' | 'rentals', id: string }) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { table, id };
    },
    onSuccess: ({ table }) => {
      toast({
        description: "Элемент ийгиликтүү өчүрүлдү",
      });
      queryClient.invalidateQueries({ queryKey: [`admin-${table}`] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: "Өчүрүүдө ката кетти: " + error.message,
      });
    }
  });

  // Update user role
  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  // Delete catalog item
  const handleDeleteCatalogItem = (table: 'places' | 'artists' | 'rentals', id: string) => {
    deleteCatalogItemMutation.mutate({ table, id });
  };

  const isLoading = usersLoading || placesLoading || artistsLoading || rentalsLoading || 
                    updateRoleMutation.isPending || deleteCatalogItemMutation.isPending;

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
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              ) : (
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
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            Колдонуучулар табылган жок
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.profile?.full_name || '-'}</TableCell>
                            <TableCell>{user.profile?.phone || '-'}</TableCell>
                            <TableCell>
                              <Select
                                value={user.profile?.role || 'user'}
                                onValueChange={(value) => handleRoleChange(user.id, value)}
                                disabled={isLoading}
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
                                disabled={true}
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
                  {placesLoading ? (
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
                                    onClick={() => handleDeleteCatalogItem('places', place.id)}
                                    disabled={isLoading}
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
            </TabsContent>
            
            <TabsContent value="artists">
              <Card>
                <CardHeader>
                  <CardTitle>Артисттер</CardTitle>
                </CardHeader>
                <CardContent>
                  {artistsLoading ? (
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
                                    onClick={() => handleDeleteCatalogItem('artists', artist.id)}
                                    disabled={isLoading}
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
            </TabsContent>
            
            <TabsContent value="rentals">
              <Card>
                <CardHeader>
                  <CardTitle>Ижара</CardTitle>
                </CardHeader>
                <CardContent>
                  {rentalsLoading ? (
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
                                    onClick={() => handleDeleteCatalogItem('rentals', rental.id)}
                                    disabled={isLoading}
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
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;

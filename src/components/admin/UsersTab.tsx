
import { useState } from "react";
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

// Define interface for change_user_role function parameters
interface ChangeUserRoleParams {
  user_id: string;
  new_role: string;
}

export const UsersTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users with their profiles
  const { data: users = [], isLoading } = useQuery({
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

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Use type assertion since database functions aren't in the generated types
      const { data, error } = await (supabase as any).rpc('change_user_role', {
        user_id: userId,
        new_role: role
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

  // Update user role
  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Колдонуучулар</CardTitle>
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
                          disabled={updateRoleMutation.isPending}
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
  );
};

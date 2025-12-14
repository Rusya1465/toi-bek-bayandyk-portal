import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Loader, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  email: string;
  created_at: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
}

export const UsersTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; newRole: string } | null>(null);

  // Fetch all users via RPC function
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      console.log('🔍 Fetching all users via get_all_users...');
      
      const { data, error } = await supabase.rpc('get_all_users' as any);
      
      if (error) {
        console.error('❌ Error fetching users:', error);
        throw error;
      }
      
      console.log('✅ Users fetched successfully:', data?.length || 0, data);
      return (data as unknown as User[]) || [];
    },
    retry: 1,
  });

  // Mutation for changing role
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      console.log('🔄 Changing role:', { userId, role });
      
      const { data, error } = await supabase.rpc('change_user_role', {
        target_user_id: userId,
        new_role: role
      } as any);
      
      if (error) {
        console.error('❌ Error changing role:', error);
        throw error;
      }
      
      console.log('✅ Role changed successfully:', data);
      return data;
    },
    onSuccess: () => {
      toast({
        description: "Колдонуучунун ролу ийгиликтүү өзгөртүлдү",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
      setSelectedUser(null);
    },
    onError: (error: any) => {
      console.error('❌ Mutation error:', error);
      toast({
        variant: "destructive",
        description: "Ролду өзгөртүүдө ката кетти: " + (error.message || 'Unknown error'),
      });
      setSelectedUser(null);
    }
  });

  const handleRoleChangeRequest = (userId: string, userName: string, newRole: string) => {
    setSelectedUser({ id: userId, name: userName, newRole });
  };

  const confirmRoleChange = () => {
    if (selectedUser) {
      changeRoleMutation.mutate({ 
        userId: selectedUser.id, 
        role: selectedUser.newRole 
      });
    }
  };

  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      'admin': 'Администратор',
      'partner': 'Өнөктөш',
      'user': 'Колдонуучу'
    };
    return roles[role] || role;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Колдонуучулар</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">
              Колдонуучуларды жүктөөдө ката кетти: {(error as any).message}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Сиздин аккаунтуңуз админ укугуна ээ экенин текшериңиз
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Кайра аракет
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Колдонуучулар</CardTitle>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Жаңылоо
          </Button>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        Колдонуучулар табылган жок
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.full_name || '-'}</TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role || 'user'}
                            onValueChange={(value) => 
                              handleRoleChangeRequest(user.id, user.full_name || user.email, value)
                            }
                            disabled={changeRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-40">
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
                          {new Date(user.created_at).toLocaleDateString('ru-RU')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!isLoading && users.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Жалпы колдонуучулар: {users.length}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ролду өзгөртүү</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && (
                <>
                  <strong>{selectedUser.name}</strong> колдонуучусунун ролун{' '}
                  <strong>{getRoleName(selectedUser.newRole)}</strong> кылып өзгөртүүнү каалайсызбы?
                  <br /><br />
                  Бул аракет дароо аткарылат жана колдонуучунун укуктарын өзгөртөт.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Жокко чыгаруу</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRoleChange}
              disabled={changeRoleMutation.isPending}
            >
              {changeRoleMutation.isPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Өзгөртүлүүдө...
                </>
              ) : (
                'Ооба, өзгөртүү'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

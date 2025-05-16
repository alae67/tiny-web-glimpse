
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AddUserDialog from "@/components/users/AddUserDialog";
import { Lock, UserMinus, Ban, UserX } from "lucide-react";
import ChangePasswordDialog from "@/components/users/ChangePasswordDialog";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";

interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'user';
  isBlocked?: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isAdmin, blockUser, unblockUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Only admins can access this page
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can access user management.",
        variant: "destructive",
      });
      return;
    }

    // Load users from localStorage
    const loadUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        // Filter out sensitive information like passwords
        const filteredUsers = storedUsers.map((user: any) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          isBlocked: user.isBlocked || false
        }));
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadUsers();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      loadUsers();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAdmin, toast]);

  const handleUserAdded = () => {
    // Reload users after a new user is added
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const filteredUsers = storedUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      isBlocked: user.isBlocked || false
    }));
    setUsers(filteredUsers);
  };

  const handleOpenChangePassword = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordDialogOpen(true);
  };

  const handleOpenDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleUserUpdated = () => {
    // Reload users after a user is updated
    handleUserAdded();
  };

  const handleBlockUser = async (user: User) => {
    const success = await blockUser(user.id);
    if (success) {
      handleUserUpdated();
    }
  };

  const handleUnblockUser = async (user: User) => {
    const success = await unblockUser(user.id);
    if (success) {
      handleUserUpdated();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage system users and permissions</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            All registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenChangePassword(user)}
                        title="Change Password"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      
                      {user.username !== 'admin' && (
                        <>
                          {user.isBlocked ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => handleUnblockUser(user)}
                              title="Unblock User"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                              onClick={() => handleBlockUser(user)}
                              title="Block User"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleOpenDeleteUser(user)}
                            title="Delete User"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AddUserDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onUserAdded={handleUserAdded}
      />

      {selectedUser && (
        <>
          <ChangePasswordDialog
            open={isChangePasswordDialogOpen}
            onOpenChange={setIsChangePasswordDialogOpen}
            onPasswordChanged={handleUserUpdated}
            userId={selectedUser.id}
            username={selectedUser.username}
          />
          <DeleteUserDialog
            open={isDeleteUserDialogOpen}
            onOpenChange={setIsDeleteUserDialogOpen}
            onUserDeleted={handleUserUpdated}
            userId={selectedUser.id}
            username={selectedUser.username}
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;

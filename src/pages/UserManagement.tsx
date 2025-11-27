import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Plus, Settings, Trash2, Edit, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useMoHUsers, useDeleteMoHUser } from "@/hooks/use-hkit-data";
import { MoHUser } from "@/api/hkit";
import { Skeleton } from "@/components/ui/skeleton";
import { MoHUserDialog } from "@/components/user-management/MoHUserDialog";

const UserManagement = () => {
  const { data: users, isLoading, isError } = useMoHUsers();
  const deleteMutation = useDeleteMoHUser();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<MoHUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = "User & Role Management | Hkit Portal";
  }, []);

  const handleAddUser = () => {
    setUserToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: MoHUser) => {
    setUserToEdit(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user ${name}? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };
  
  const filteredUsers = users?.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const renderUserList = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 border-border">
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      );
    }
    
    if (isError || !users) {
        return (
            <Card className="p-8 border-destructive/20 bg-destructive/10 text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
                <p className="text-destructive">Error loading user data.</p>
            </Card>
        );
    }
    
    if (filteredUsers.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                {searchTerm ? "No users match your search criteria." : "No MoH users found."}
            </div>
        );
    }

    return (
      <div className="space-y-3">
        {filteredUsers.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{u.firstName} {u.lastName}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-border">
                {u.role}
              </Badge>
              <Badge 
                variant="outline" 
                className={u.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}
              >
                {u.status}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleEditUser(u)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteUser(u.id, u.firstName)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User & Role Management</h1>
          <p className="text-muted-foreground">Manage internal Ministry of Health system users and access roles.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddUser}>
          <Plus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10 bg-secondary border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-border" disabled>
            <Settings className="w-4 h-4 mr-2" />
            Filter by Role (Mock)
          </Button>
        </div>

        {renderUserList()}
      </Card>
      
      {(deleteMutation.isPending || isLoading) && (
        <div className="fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-lg shadow-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {deleteMutation.isPending ? "Processing deletion..." : "Loading users..."}
        </div>
      )}
      
      <MoHUserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userToEdit={userToEdit}
      />
    </div>
  );
};

export default UserManagement;
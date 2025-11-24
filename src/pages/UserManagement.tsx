import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Plus, Settings, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const mockUsers = [
  { id: 1, name: "Dr. Amina Bello", role: "MoH Administrator", email: "amina.bello@moh.kwara.ng", status: "Active" },
  { id: 2, name: "Engr. Tunde Ojo", role: "System Developer", email: "tunde.ojo@moh.kwara.ng", status: "Active" },
  { id: 3, name: "Mr. Segun Adekunle", role: "Data Analyst", email: "segun.a@moh.kwara.ng", status: "Inactive" },
];

const UserManagement = () => {
  const handleAddUser = () => {
    toast.info("Action: Opening Add New User form (Mock Action)");
  };

  const handleEditUser = (id: number) => {
    toast.info(`Action: Editing user ID: ${id} (Mock Action)`);
  };

  const handleDeleteUser = (id: number) => {
    toast.warning(`Action: Deleting user ID: ${id} (Mock Action)`);
  };

  return (
    <div className="p-6 space-y-6">
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
            />
          </div>
          <Button variant="outline" className="border-border">
            <Settings className="w-4 h-4 mr-2" />
            Filter by Role
          </Button>
        </div>

        <div className="space-y-3">
          {mockUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{u.name}</p>
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
                  onClick={() => handleEditUser(u.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteUser(u.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
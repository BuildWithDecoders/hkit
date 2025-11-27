import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoHUser, MoHInternalRole } from "@/api/hkit";
import { useCreateMoHUser, useUpdateMoHUser } from "@/hooks/use-hkit-data";

const MoH_ROLES: MoHInternalRole[] = ["MoH", "DataAnalyst", "SystemDeveloper"];

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(MoH_ROLES as any, { required_error: "Role is required" }),
  password: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface MoHUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit: MoHUser | null;
}

export function MoHUserDialog({ isOpen, onOpenChange, userToEdit }: MoHUserDialogProps) {
  const isEdit = !!userToEdit;
  const createMutation = useCreateMoHUser();
  const updateMutation = useUpdateMoHUser();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema.extend({
        // Require password only for creation
        password: isEdit 
            ? z.string().optional() 
            : z.string().min(6, "Password must be at least 6 characters"),
    })),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "DataAnalyst", // Default to a non-MoH role for safety
      password: "",
    },
  });

  useEffect(() => {
    if (userToEdit) {
      form.reset({
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        role: userToEdit.role,
        password: "", // Never pre-fill password
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        role: "DataAnalyst",
        password: "",
      });
    }
  }, [userToEdit, form]);

  const onSubmit = async (data: UserFormValues) => {
    if (isEdit && userToEdit) {
      const updateParams = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        ...(data.password && { password: data.password }), // Only include password if provided
      };
      await updateMutation.mutateAsync({ id: userToEdit.id, params: updateParams }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      await createMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        password: data.password,
      } as any, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isEdit ? `Edit User: ${userToEdit?.firstName}` : "Add New MoH User"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update user details and role." : "Create a new internal administrator or staff account."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MoH_ROLES.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEdit ? "New Password (Optional)" : "Password"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={isEdit ? "Leave blank to keep current password" : "********"} {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                isEdit ? <Edit className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isEdit ? "Save Changes" : "Create User"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
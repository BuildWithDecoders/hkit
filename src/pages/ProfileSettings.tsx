import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Building2, Shield, Loader2, Save, Settings, Code2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile, ProfileUpdateParams } from "@/hooks/use-profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
  const { user, role, isLoading } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const [currentFirstName, currentLastName] = user?.name?.split(/\s+(.*)/s) || ['', ''];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentFirstName,
      lastName: currentLastName,
    },
  });

  // Update form defaults when user data loads or changes
  useEffect(() => {
    if (user) {
      // Split name into first and last, handling cases where last name might be empty
      const parts = user.name?.split(' ') || [];
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
      
      form.reset({
        firstName: fName,
        lastName: lName,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfileMutation.mutateAsync(data as ProfileUpdateParams);
  };

  const handlePasswordChange = () => {
    toast.info("Action: Opening Password Change Dialog (Not Implemented)");
  };

  const getRoleDetails = () => {
    switch (role) {
      case "MoH":
        return {
          title: "Ministry of Health Administrator",
          details: [
            { label: "Role Level", value: "System Oversight", icon: Shield },
          ],
        };
      case "FacilityAdmin":
        return {
          title: "Facility Administrator",
          details: [
            { label: "Facility", value: user?.facilityName || "N/A", icon: Building2 },
            { label: "Facility ID", value: user?.facilityId?.toString() || "N/A", icon: Building2 },
          ],
        };
      case "Developer":
        return {
          title: "Developer / Vendor Access",
          details: [
            { label: "Access Type", value: "API Integration", icon: Code2 },
          ],
        };
      default:
        return { title: "Guest User", details: [] };
    }
  };

  const roleDetails = getRoleDetails();

  if (isLoading || !user) {
    return (
      <div className="p-6 flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account & Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 border-border lg:col-span-1 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
            
            <Separator className="my-4" />

            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium text-foreground">{roleDetails.title}</p>
                </div>
              </div>
              {roleDetails.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-3">
                  <detail.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                    <p className="font-medium text-foreground">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-secondary border-border" disabled={updateProfileMutation.isPending} />
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
                            <Input {...field} className="bg-secondary border-border" disabled={updateProfileMutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Read-Only)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border">
                <p className="font-medium text-foreground">Change Password</p>
                <Button variant="outline" onClick={handlePasswordChange}>
                  Update Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border">
                <p className="font-medium text-foreground">Two-Factor Authentication (2FA)</p>
                <Button variant="outline" disabled>
                  Enable (Mock)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
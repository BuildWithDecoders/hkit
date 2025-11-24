import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus } from "lucide-react";
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
import { RegistrationRequest } from "@/api/hkit";
import { useCreateApprovedUser } from "@/hooks/use-hkit-data";

// Only email is required now, as password is auto-generated
const userCreationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type UserCreationFormValues = z.infer<typeof userCreationSchema>;

interface UserCreationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: RegistrationRequest | null;
}

export function UserCreationDialog({ isOpen, onOpenChange, request }: UserCreationDialogProps) {
  const createApprovedUserMutation = useCreateApprovedUser();
  
  const form = useForm<UserCreationFormValues>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      email: request?.type === 'facility' ? request.data.contactEmail : request?.data.technicalContactEmail,
    },
  });

  React.useEffect(() => {
    if (request) {
      form.reset({
        email: request.type === 'facility' ? request.data.contactEmail : request.data.technicalContactEmail,
      });
    }
  }, [request, form]);

  const onSubmit = async (data: UserCreationFormValues) => {
    if (!request) return;

    const role = request.type === 'facility' ? 'FacilityAdmin' : 'Developer';
    const name = request.type === 'facility' ? request.data.contactName : request.data.technicalContactName;
    
    createApprovedUserMutation.mutate({
      requestId: request.id,
      requestType: request.type,
      requestData: request.data,
      email: data.email,
      name: name,
      role: role,
    }, {
      onSuccess: () => {
        // Password display handled by the mutation hook's onSuccess
        onOpenChange(false);
      },
      // Error handling is also handled by the mutation hook
    });
  };

  const isSubmitting = createApprovedUserMutation.isPending;
  const roleLabel = request?.type === 'facility' ? 'Facility Administrator' : 'Developer';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create {roleLabel} Account
          </DialogTitle>
          <DialogDescription>
            The system will auto-generate a temporary password and send it to the user's email.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Email</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Create Account & Approve Request
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
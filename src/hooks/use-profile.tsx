import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/hkit";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export interface ProfileUpdateParams {
  firstName: string;
  lastName: string;
}

export function useUpdateProfile() {
  const { user, refreshProfile } = useAuth();

  return useMutation<void, Error, ProfileUpdateParams>({
    mutationFn: async ({ firstName, lastName }) => {
      if (!user?.id) {
        throw new Error("User not authenticated.");
      }
      await updateUserProfile(user.id, firstName, lastName);
    },
    onSuccess: async () => {
      // Force the AuthProvider to re-fetch the profile data from the database
      await refreshProfile(); 
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update profile.", {
        description: error.message,
      });
    },
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchFacilities, 
  updateFacilityStatus, 
  fetchAuditLogs, 
  fetchFhirEvents,
  fetchConsentRecords,
  revokeConsent,
  fetchRegistrationRequests,
  rejectRegistrationRequest,
  createApprovedUser,
  Facility,
  FacilityStatus,
  AuditLog,
  FhirEvent,
  ConsentRecord,
  RegistrationRequest,
} from "@/api/hkit";
import { toast } from "sonner";
import { useAuth } from "./use-auth";
import { generateRandomPassword } from "@/lib/utils"; // Import password generator

// --- Facility Hooks ---

export function useFacilities() {
  return useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: fetchFacilities,
  });
}

export function useApproveFacility() {
  const queryClient = useQueryClient();
  return useMutation<Facility, Error, number>({
    mutationFn: (id: number) => updateFacilityStatus(id, "verified"),
    onSuccess: (updatedFacility) => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success(`Facility ${updatedFacility.name} approved!`, {
        description: "The facility administrator will be notified to complete setup.",
      });
    },
    onError: (error) => {
      toast.error("Failed to approve facility.", {
        description: error.message,
      });
    },
  });
}

// ... (useRejectFacility remains the same)

export function useRejectFacility() {
  const queryClient = useQueryClient();
  return useMutation<Facility, Error, number>({
    mutationFn: (id: number) => updateFacilityStatus(id, "rejected"),
    onSuccess: (updatedFacility) => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.error(`Facility ${updatedFacility.name} rejected.`, {
        description: "The facility contact has been notified.",
      });
    },
    onError: (error) => {
      toast.error("Failed to reject facility.", {
        description: error.message,
      });
    },
  });
}

// --- Registration Request Hooks ---

export function useRegistrationRequests() {
  return useQuery<RegistrationRequest[]>({
    queryKey: ["registrationRequests"],
    queryFn: fetchRegistrationRequests,
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => rejectRegistrationRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrationRequests"] });
      toast.warning("Request rejected.", {
        description: "The status has been updated.",
      });
    },
    onError: (error) => {
      toast.error("Rejection Failed", {
        description: error.message,
      });
    },
  });
}

interface CreateUserParams {
    requestId: string; 
    requestType: 'facility' | 'developer'; 
    requestData: any; 
    email: string; 
    name: string; 
    role: 'FacilityAdmin' | 'Developer';
}

export function useCreateApprovedUser() {
  const queryClient = useQueryClient();
  
  return useMutation<string, Error, CreateUserParams>({
    mutationFn: async (params) => {
        const password = generateRandomPassword(12); // Generate password here
        
        await createApprovedUser({
            ...params,
            password: password,
        });
        
        return password; // Return the generated password
    },
    onSuccess: (generatedPassword, variables) => {
      queryClient.invalidateQueries({ queryKey: ["registrationRequests"] });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      
      const roleLabel = variables.requestType === 'facility' ? 'Facility Administrator' : 'Developer';
      
      // Display the password to the MoH admin
      toast.success(`User account created for ${roleLabel}!`, {
        description: `Temporary Password: ${generatedPassword}. An email has been simulated to ${variables.email}.`,
        duration: 15000,
      });
    },
    onError: (error) => {
      toast.error("User Creation Failed", {
        description: error.message,
      });
    },
  });
}


// --- Audit & Interoperability Hooks ---

export function useAuditLogs() {
    const { role, user } = useAuth();
    const facilityName = user?.facilityName;
    
    return useQuery<AuditLog[]>({
        queryKey: ["auditLogs", role, facilityName],
        queryFn: () => fetchAuditLogs(role || "Guest", facilityName),
    });
}

export function useFhirEvents() {
    return useQuery<FhirEvent[]>({
        queryKey: ["fhirEvents"],
        queryFn: fetchFhirEvents,
    });
}

// --- Governance Hooks ---

export function useConsentRecords() {
    const { role, user } = useAuth();
    const facilityName = user?.facilityName;

    return useQuery<ConsentRecord[]>({
        queryKey: ["consentRecords", role, facilityName],
        queryFn: () => fetchConsentRecords(role || "Guest", facilityName),
    });
}

export function useRevokeConsent() {
    const queryClient = useQueryClient();
    return useMutation<ConsentRecord, Error, string>({
        mutationFn: (patientId: string) => revokeConsent(patientId),
        onSuccess: (revokedRecord) => {
            queryClient.invalidateQueries({ queryKey: ["consentRecords"] });
            toast.warning(`Consent revoked for patient ${revokedRecord.patientId}.`, {
                description: "Data sharing permissions have been updated.",
            });
        },
        onError: (error) => {
            toast.error("Failed to revoke consent.", {
                description: error.message,
            });
        },
    });
}
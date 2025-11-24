import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchFacilities, 
  updateFacilityStatus, 
  fetchAuditLogs, 
  fetchFhirEvents,
  fetchConsentRecords,
  revokeConsent,
  Facility,
  FacilityStatus,
  AuditLog,
  FhirEvent,
  ConsentRecord
} from "@/api/hkit";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

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
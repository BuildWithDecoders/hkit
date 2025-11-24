import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type FacilityStatus = "verified" | "pending" | "rejected";

export interface Facility {
  id: number;
  name: string;
  lga: string;
  type: string;
  status: FacilityStatus;
  compliance: number;
  administrators: number;
  apiActivity: string;
  lastSync: string;
}

// --- New Registration Request Types ---

export interface RegistrationRequest {
  id: string;
  type: 'facility' | 'developer';
  data: any; // JSONB data from the form
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

export interface FacilityRegistrationData {
  facilityName: string;
  facilityType: string;
  lga: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface DeveloperRegistrationData {
  organizationName: string;
  systemName: string;
  technicalContactName: string;
  technicalContactEmail: string;
  useCase: string;
}

// --- Supabase API Functions ---

export async function fetchFacilities(): Promise<Facility[]> {
  // Fetch all facilities (MoH policy allows authenticated users to read all)
  const { data, error } = await supabase
    .from('facilities')
    .select('*');

  if (error) {
    console.error("Error fetching facilities:", error);
    throw new Error("Failed to fetch facilities data.");
  }
  
  // Map Supabase data structure to Facility interface
  return data.map(f => ({
    id: f.id,
    name: f.name,
    lga: f.lga || 'N/A',
    type: f.type || 'N/A',
    status: f.status as FacilityStatus,
    compliance: f.compliance || 0,
    administrators: f.administrators || 0,
    // Keeping these fields mocked/placeholder until real data ingestion is implemented
    apiActivity: f.api_activity || 'N/A',
    lastSync: f.last_sync ? new Date(f.last_sync).toLocaleString() : 'N/A',
  }));
}

export async function updateFacilityStatus(id: number, status: FacilityStatus): Promise<Facility> {
  const { data, error } = await supabase
    .from('facilities')
    .update({ 
      status,
      // Mocking compliance/admins update for verified status, as per previous mock logic
      compliance: status === 'verified' ? 70 : 0,
      administrators: status === 'verified' ? 1 : 0,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating facility status:", error);
    throw new Error(`Failed to update facility status: ${error.message}`);
  }
  
  // Map Supabase data structure back to Facility interface
  return {
    id: data.id,
    name: data.name,
    lga: data.lga || 'N/A',
    type: data.type || 'N/A',
    status: data.status as FacilityStatus,
    compliance: data.compliance || 0,
    administrators: data.administrators || 0,
    apiActivity: data.api_activity || 'N/A',
    lastSync: data.last_sync ? new Date(data.last_sync).toLocaleString() : 'N/A',
  };
}

export async function signUpMoH(email: string, password: string, firstName: string, lastName: string): Promise<void> {
  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData.user?.id;

  if (!userId) {
    throw new Error("User creation failed, no user ID returned.");
  }

  // 2. Update the profile table to assign the MoH role immediately
  // Note: The handle_new_user trigger runs first, creating a basic profile.
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'MoH', first_name: firstName, last_name: lastName })
    .eq('id', userId);

  if (profileError) {
    // If profile update fails, we should ideally log this and potentially delete the auth user.
    console.error("Failed to set MoH role:", profileError);
    throw new Error("User created, but failed to assign MoH role. Please contact support.");
  }
}

// --- Registration Request Functions ---

export async function submitFacilityRegistration(data: FacilityRegistrationData): Promise<void> {
  const { error } = await supabase
    .from('registration_requests')
    .insert({
      type: 'facility',
      data: data,
    });

  if (error) {
    console.error("Error submitting facility registration:", error);
    throw new Error("Failed to submit registration request.");
  }
}

export async function submitDeveloperRegistration(data: DeveloperRegistrationData): Promise<void> {
  const { error } = await supabase
    .from('registration_requests')
    .insert({
      type: 'developer',
      data: data,
    });

  if (error) {
    console.error("Error submitting developer registration:", error);
    throw new Error("Failed to submit registration request.");
  }
}

export async function fetchRegistrationRequests(): Promise<RegistrationRequest[]> {
  const { data, error } = await supabase
    .from('registration_requests')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error("Error fetching registration requests:", error);
    throw new Error("Failed to fetch registration requests.");
  }
  
  return data.map(req => ({
    id: req.id,
    type: req.type as 'facility' | 'developer',
    data: req.data,
    status: req.status as 'pending' | 'approved' | 'rejected',
    submitted_at: new Date(req.submitted_at).toLocaleString(),
  }));
}

export async function rejectRegistrationRequest(requestId: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  const { error } = await supabase
    .from('registration_requests')
    .update({ status: 'rejected', approved_by: userId })
    .eq('id', requestId);

  if (error) {
    console.error("Error rejecting request:", error);
    throw new Error("Failed to reject registration request.");
  }
}

// New function to handle user creation and final approval steps
export async function createApprovedUser({
  requestId,
  requestType,
  requestData,
  email,
  password,
  name,
  role,
}: {
  requestId: string;
  requestType: 'facility' | 'developer';
  requestData: any;
  email: string;
  password: string;
  name: string;
  role: 'FacilityAdmin' | 'Developer';
}): Promise<void> {
  
  const { data: sessionData } = await supabase.auth.getSession();
  const mohUserId = sessionData.session?.user.id;

  if (!mohUserId) {
    throw new Error("User must be authenticated to approve requests.");
  }

  // 1. Invoke the Edge Function for secure administrative actions
  const { data, error } = await supabase.functions.invoke('approve-request', {
    body: JSON.stringify({
      requestId,
      requestType,
      requestData,
      email,
      password,
      name,
      role,
      mohUserId,
    }),
  });

  if (error) {
    console.error("Edge Function invocation failed:", error);
    throw new Error(`Approval failed: ${error.message}`);
  }
  
  if (data && data.error) {
    console.error("Edge Function returned error:", data.error);
    throw new Error(`Approval failed: ${data.error}`);
  }

  // 2. Simulate sending the welcome email with the temporary password
  console.log(`[EMAIL SIMULATION] Sent welcome email to ${email} with temporary password: ${password}`);
  toast.info(`Email simulation: Sent temporary password to ${email}.`, {
    description: `Password: ${password}`,
    duration: 10000,
  });
}


// Placeholder for other data types (Audit Logs, FHIR Events)
export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: "success" | "failed";
}

export async function fetchAuditLogs(role: string, facilityName?: string): Promise<AuditLog[]> {
    // Mock data from src/pages/Audit.tsx
    const mockLogs: AuditLog[] = [
        { id: 1, timestamp: "2024-11-23 14:25:30", user: "admin@moh.kwara", action: "FACILITY_APPROVED", resource: "Baptist Medical Centre", ip: "102.89.23.45", status: "success" },
        { id: 2, timestamp: "2024-11-23 14:23:15", user: "api_key_abc123", action: "PATIENT_CREATED", resource: "Patient/KW2024001234", ip: "41.203.12.88", status: "success" },
        { id: 3, timestamp: "2024-11-23 14:20:42", user: "facility_admin@hospital", action: "API_KEY_GENERATED", resource: "hkit_prod_xyz789", ip: "197.210.55.10", status: "success" },
        { id: 4, timestamp: "2024-11-23 14:18:08", user: "api_key_test456", action: "OBSERVATION_UPDATE", resource: "Observation/obs-12345", ip: "105.112.45.22", status: "failed" },
        { id: 5, timestamp: "2024-11-23 14:15:33", user: "admin@moh.kwara", action: "CONSENT_REVOKED", resource: "Consent/consent-789", ip: "102.89.23.45", status: "success" },
        { id: 6, timestamp: "2024-11-23 14:12:51", user: "api_key_prod999", action: "ENCOUNTER_CREATED", resource: "Encounter/enc-54321", ip: "197.255.88.99", status: "success" },
        // Facility-specific logs for filtering simulation (assuming GH Ilorin is the mock facility)
        { id: 7, timestamp: "2024-11-23 14:10:00", user: "facility_admin@ghilorin", action: "LOGIN", resource: "General Hospital Ilorin", ip: "192.168.1.1", status: "success" },
        { id: 8, timestamp: "2024-11-23 14:05:00", user: "api_key_abc123", action: "PATIENT_CREATED", resource: "General Hospital Ilorin", ip: "41.203.12.88", status: "success" },
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));

    if (role === "FacilityAdmin" && facilityName) {
        // Filter logs relevant to the facility (either resource or user related)
        return mockLogs.filter(log => 
            log.resource.includes(facilityName) || 
            log.user.includes(facilityName.toLowerCase().replace(/\s/g, '')) ||
            log.user.includes("facility_admin@ghilorin") // Specific mock user for GH Ilorin
        );
    }
    
    if (role === "Developer") {
        // Filter logs relevant to API keys/integration actions
        return mockLogs.filter(log => log.user.startsWith("api_key_") || log.action.includes("API_KEY"));
    }

    return mockLogs; // MoH sees all logs
}

export interface FhirEvent {
    id: number;
    resource: string;
    operation: string;
    facility: string;
    status: "success" | "failed" | "warning";
    timestamp: string;
}

export async function fetchFhirEvents(): Promise<FhirEvent[]> {
    // Mock data from src/pages/Interoperability.tsx
    const mockEvents: FhirEvent[] = [
        { id: 1, resource: "Patient", operation: "CREATE", facility: "General Hospital Ilorin", status: "success", timestamp: "2024-11-23 14:23:45" },
        { id: 2, resource: "Observation", operation: "UPDATE", facility: "Baptist Medical Centre", status: "success", timestamp: "2024-11-23 14:23:42" },
        { id: 3, resource: "Encounter", operation: "CREATE", facility: "Sobi Specialist Hospital", status: "failed", timestamp: "2024-11-23 14:23:38" },
        { id: 4, resource: "MedicationRequest", operation: "CREATE", facility: "General Hospital Ilorin", status: "success", timestamp: "2024-11-23 14:23:35" },
        { id: 5, resource: "Condition", operation: "UPDATE", facility: "Private Clinic Offa", status: "warning", timestamp: "2024-11-23 14:23:30" },
    ];
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents;
}

export function getMockMessageDetails(id: number) {
    const event = mockEvents.find(e => e.id === id);
    if (!event) return null;

    const rawPayload = `MSH|^~\&|EMR|GHILORIN|HKIT|KWARA|20241123142345||ADT^A01|MSG0001|P|2.5
PID|1||${event.id}^^^MRN||DOE^JOHN^A||19800101|M|||...`;

    const fhirOutput = JSON.stringify({
        resourceType: event.resource,
        id: event.id,
        meta: { lastUpdated: event.timestamp },
        status: event.status === 'success' ? 'active' : 'draft',
        // ... more FHIR data
    }, null, 2);

    const validationErrors = event.status === 'failed' 
        ? ["Missing required field: Patient.identifier[0].value", "Invalid code system for Encounter.class"]
        : event.status === 'warning'
        ? ["Coding system not recognized (SNOMED CT expected)"]
        : [];

    return {
        id: event.id,
        status: event.status,
        resource: event.resource,
        rawPayload: rawPayload,
        fhirOutput: fhirOutput,
        validationErrors: validationErrors,
    };
}

const mockEvents = [
    { id: 1, resource: "Patient", operation: "CREATE", facility: "General Hospital Ilorin", status: "success", timestamp: "2024-11-23 14:23:45" },
    { id: 2, resource: "Observation", operation: "UPDATE", facility: "Baptist Medical Centre", status: "success", timestamp: "2024-11-23 14:23:42" },
    { id: 3, resource: "Encounter", operation: "CREATE", facility: "Sobi Specialist Hospital", status: "failed", timestamp: "2024-11-23 14:23:38" },
    { id: 4, resource: "MedicationRequest", operation: "CREATE", facility: "General Hospital Ilorin", status: "success", timestamp: "2024-11-23 14:23:35" },
    { id: 5, resource: "Condition", operation: "UPDATE", facility: "Private Clinic Offa", status: "warning", timestamp: "2024-11-23 14:23:30" },
];

// --- Consent API Mock ---

export interface ConsentRecord {
  patientId: string;
  scope: string;
  grantedTo: string;
  expiry: string;
  status: "active" | "revoked";
}

let mockConsentRecords: ConsentRecord[] = [
  { patientId: "KW2024001234", scope: "Full access", grantedTo: "Baptist Medical Centre", expiry: "2025-12-31", status: "active" },
  { patientId: "KW2024001235", scope: "Lab results only", grantedTo: "Private Clinic Offa", expiry: "2025-06-30", status: "active" },
  { patientId: "KW2024001236", scope: "Emergency access", grantedTo: "General Hospital Ilorin", expiry: "Never", status: "revoked" },
];

export async function fetchConsentRecords(role: string, facilityName?: string): Promise<ConsentRecord[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (role === "FacilityAdmin" && facilityName) {
    // Facility Admin only sees consents granted to their facility
    return mockConsentRecords.filter(r => r.grantedTo.includes(facilityName));
  }

  return mockConsentRecords; // MoH sees all consents
}

export async function revokeConsent(patientId: string): Promise<ConsentRecord> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const recordIndex = mockConsentRecords.findIndex(r => r.patientId === patientId);
  if (recordIndex === -1) {
    throw new Error("Consent record not found");
  }

  if (mockConsentRecords[recordIndex].status === 'revoked') {
    throw new Error("Consent already revoked");
  }
  
  mockConsentRecords[recordIndex] = {
    ...mockConsentRecords[recordIndex],
    status: "revoked",
  };
  return mockConsentRecords[recordIndex];
}

// --- Data Quality Mock ---

export interface FacilityScore {
  name: string;
  score: number;
  trend: "up" | "down" | "neutral";
  change: string;
}

export const mockFacilityScores: FacilityScore[] = [
  { name: "General Hospital Ilorin", score: 95, trend: "up", change: "+3%" },
  { name: "Baptist Medical Centre", score: 92, trend: "up", change: "+1%" },
  { name: "Sobi Specialist Hospital", score: 88, trend: "down", change: "-2%" },
  { name: "Private Clinic Offa", score: 85, trend: "up", change: "+5%" },
  { name: "Community Health Centre", score: 78, trend: "down", change: "-4%" },
  { name: "Maternity Hospital", score: 72, trend: "up", change: "+2%" },
];

export interface HeatmapRow {
  facility: string;
  Patient: number;
  Encounter: number;
  Observation: number;
  Medication: number;
}

export const mockHeatmapData: HeatmapRow[] = [
  { facility: "GH Ilorin", Patient: 98, Encounter: 95, Observation: 92, Medication: 90 },
  { facility: "Baptist Medical", Patient: 95, Encounter: 90, Observation: 88, Medication: 85 },
  { facility: "Sobi Hospital", Patient: 85, Encounter: 88, Observation: 91, Medication: 82 },
  { facility: "Private Clinic", Patient: 75, Encounter: 70, Observation: 78, Medication: 65 },
];
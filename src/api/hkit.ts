import { toast } from "sonner";

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

let facilities: Facility[] = [
  {
    id: 1,
    name: "General Hospital Ilorin",
    lga: "Ilorin West",
    type: "Public",
    status: "verified",
    compliance: 92,
    administrators: 3,
    apiActivity: "2.3k req/day",
    lastSync: "2 min ago",
  },
  {
    id: 2,
    name: "Baptist Medical Centre",
    lga: "Ilorin South",
    type: "Private",
    status: "verified",
    compliance: 88,
    administrators: 2,
    apiActivity: "1.8k req/day",
    lastSync: "5 min ago",
  },
  {
    id: 3,
    name: "Sobi Specialist Hospital",
    lga: "Ilorin East",
    type: "Public",
    status: "verified",
    compliance: 95,
    administrators: 4,
    apiActivity: "3.1k req/day",
    lastSync: "1 min ago",
  },
  {
    id: 4,
    name: "Private Clinic Offa",
    lga: "Offa",
    type: "Private",
    status: "pending",
    compliance: 0,
    administrators: 0,
    apiActivity: "N/A",
    lastSync: "N/A",
  },
  {
    id: 5,
    name: "Community Health Centre",
    lga: "Asa",
    type: "Public",
    status: "pending",
    compliance: 0,
    administrators: 0,
    apiActivity: "N/A",
    lastSync: "N/A",
  },
];

// --- Mock API Functions ---

export async function fetchFacilities(): Promise<Facility[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return facilities;
}

export async function updateFacilityStatus(id: number, status: FacilityStatus): Promise<Facility> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const facilityIndex = facilities.findIndex(f => f.id === id);
  if (facilityIndex === -1) {
    throw new Error("Facility not found");
  }

  const updatedFacility = { 
    ...facilities[facilityIndex], 
    status,
    compliance: status === 'verified' ? 70 : 0,
    administrators: status === 'verified' ? 1 : 0,
  };
  
  facilities[facilityIndex] = updatedFacility;
  return updatedFacility;
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
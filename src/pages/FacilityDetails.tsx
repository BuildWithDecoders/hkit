import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Users,
  Key,
  Mail,
  Phone,
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type FacilityStatus = "verified" | "pending" | "rejected";

// Mock data for a detailed facility
const mockFacilityDetails = {
  id: 1,
  name: "General Hospital Ilorin",
  lga: "Ilorin West",
  type: "Public",
  status: "verified" as FacilityStatus,
  compliance: 92,
  administrators: 3,
  apiActivity: "2.3k req/day",
  lastSync: "2 min ago",
  contact: {
    name: "Dr. A. Bello",
    email: "admin@ghilorin.com",
    phone: "+234 801 234 5678",
  },
  integration: {
    emr: "OpenMRS",
    fhirVersion: "R4",
    apiKey: "hkit_prod_abc123...",
    lastSuccessfulEvent: "2024-11-23 14:30:00",
  },
  metrics: {
    totalEvents: 12456,
    successRate: 99.8,
    validationErrors: 23,
  }
};

const submissionActivityData = [
  { hour: "08:00", submissions: 120 },
  { hour: "10:00", submissions: 155 },
  { hour: "12:00", submissions: 180 },
  { hour: "14:00", submissions: 140 },
  { hour: "16:00", submissions: 165 },
  { hour: "18:00", submissions: 130 },
];

const FacilityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, we would fetch data based on 'id'.
  // For now, we use mock data and assume ID 1 is requested.
  const facility = mockFacilityDetails; 

  if (!facility) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Facility Not Found</h1>
        <p className="text-muted-foreground">Could not find facility with ID: {id}</p>
      </div>
    );
  }

  const getStatusBadge = (status: FacilityStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            Pending Approval
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Rejected
          </Badge>
        );
    }
  };

  const handleRevokeKey = () => {
    toast.warning("API Key Revoked (Mock Action)", {
      description: `Key for ${facility.name} has been deactivated.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/facilities")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-foreground">{facility.name}</h1>
            {getStatusBadge(facility.status)}
          </div>
          <p className="text-muted-foreground">Facility ID: {facility.id} | {facility.type} in {facility.lga}</p>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">Data Quality Score</p>
          <p className="text-2xl font-bold text-primary">{facility.compliance}%</p>
        </Card>
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">API Success Rate (24h)</p>
          <p className="text-2xl font-bold text-success">{facility.metrics.successRate}%</p>
        </Card>
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">Validation Errors (24h)</p>
          <p className="text-2xl font-bold text-destructive">{facility.metrics.validationErrors}</p>
        </Card>
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Events Sent</p>
          <p className="text-2xl font-bold text-foreground">{facility.metrics.totalEvents.toLocaleString()}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Activity Chart */}
        <Card className="lg:col-span-2 p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">FHIR Submission Activity (Today)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={submissionActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Submissions"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Contact Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl">Primary Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{facility.contact.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{facility.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{facility.contact.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration Details */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="text-xl">Integration & API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">EMR System</p>
                <p className="font-medium text-foreground">{facility.integration.emr}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">FHIR Version</p>
                <p className="font-medium text-foreground">{facility.integration.fhirVersion}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Last Successful Event</p>
                <p className="font-medium text-foreground">{facility.integration.lastSuccessfulEvent}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Active Administrators</p>
                <p className="font-medium text-foreground">{facility.administrators}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-muted-foreground mb-2">Production API Key</p>
              <div className="flex items-center justify-between bg-secondary border border-border rounded-lg p-3 font-mono text-sm">
                <span className="text-foreground truncate">{facility.integration.apiKey}</span>
                <Button variant="destructive" size="sm" onClick={handleRevokeKey}>
                  Revoke Key
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance and Actions */}
        <Card className="p-6 border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Compliance & Governance</h3>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">View detailed audit logs and data quality reports for this facility.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border">
                View Audit Logs
              </Button>
              <Button variant="outline" className="border-border">
                View Data Quality Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacilityDetails;
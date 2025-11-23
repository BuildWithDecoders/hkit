import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, Shield, Clock, Check, X, Loader2, AlertTriangle } from "lucide-react";
import { useConsentRecords, useRevokeConsent } from "@/hooks/use-hkit-data";
import { Skeleton } from "@/components/ui/skeleton";

const mpiRecords = [
  { id: "KW2024001234", name: "Oluwaseun Adebayo", dob: "1985-03-15", gender: "Male", facility: "General Hospital", verified: true },
  { id: "KW2024001235", name: "Aisha Mohammed", dob: "1992-07-22", gender: "Female", facility: "Baptist Medical", verified: true },
  { id: "KW2024001236", name: "Chukwudi Okafor", dob: "1978-11-10", gender: "Male", facility: "Sobi Hospital", verified: false },
];

const Governance = () => {
  const { data: consentRecords, isLoading: isLoadingConsent, isError: isErrorConsent } = useConsentRecords();
  const revokeMutation = useRevokeConsent();

  const handleRevoke = (patientId: string) => {
    revokeMutation.mutate(patientId);
  };

  const renderConsentContent = () => {
    if (isLoadingConsent) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 border-border">
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      );
    }

    if (isErrorConsent || !consentRecords) {
      return (
        <Card className="p-8 border-destructive/20 bg-destructive/10 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <p className="text-destructive">Error loading consent data.</p>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {consentRecords.map((record, index) => (
          <Card key={index} className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-foreground">
                      Patient: {record.patientId}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        record.status === "active"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }
                    >
                      {record.status === "active" ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      {record.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Scope: </span>
                      <span className="text-foreground font-medium">{record.scope}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Granted To: </span>
                      <span className="text-foreground">{record.grantedTo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expiry: </span>
                      <span className="text-foreground">{record.expiry}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                {record.status === "active" && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="border-destructive/50"
                    onClick={() => handleRevoke(record.patientId)}
                    disabled={revokeMutation.isPending}
                  >
                    {revokeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke"}
                  </Button>
                )}
                <Button variant="outline" size="sm" className="border-border">
                  History
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Consent & Identity Governance</h1>
        <p className="text-muted-foreground">Manage patient identities and data-sharing permissions</p>
      </div>

      <Tabs defaultValue="mpi" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="mpi">Master Patient Index</TabsTrigger>
          <TabsTrigger value="consent">Consent Registry</TabsTrigger>
          <TabsTrigger value="clinicians">Clinician Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="mpi" className="space-y-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by State Health ID, name, or DOB..."
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button variant="outline" className="border-border">
              Advanced Search
            </Button>
          </div>

          <div className="space-y-3">
            {mpiRecords.map((record) => (
              <Card key={record.id} className="p-6 border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{record.name}</h3>
                        {record.verified ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Health ID: </span>
                          <span className="text-foreground font-medium">{record.id}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">DOB: </span>
                          <span className="text-foreground">{record.dob}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gender: </span>
                          <span className="text-foreground">{record.gender}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Facility: </span>
                          <span className="text-foreground">{record.facility}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-border">
                    View Full Record
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consent" className="space-y-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient ID or facility..."
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>

          {renderConsentContent()}
        </TabsContent>

        <TabsContent value="clinicians" className="mt-6">
          <Card className="p-8 border-border text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Clinician Directory</h3>
            <p className="text-sm text-muted-foreground">
              Manage healthcare provider identities and access permissions
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Governance;
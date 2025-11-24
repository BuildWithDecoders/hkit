import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Code2, Clock, CheckCircle2, XCircle, Loader2, AlertTriangle, Eye } from "lucide-react";
import { useRegistrationRequests, useRejectRequest } from "@/hooks/use-hkit-data";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RegistrationRequest } from "@/api/hkit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCreationDialog } from "@/components/registration/UserCreationDialog";

const RegistrationRequests = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUserCreationDialogOpen, setIsUserCreationDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);

  const { data: requests, isLoading, isError } = useRegistrationRequests();
  const rejectMutation = useRejectRequest();

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    if (activeTab === 'all') return requests;
    return requests.filter(r => r.status === activeTab);
  }, [requests, activeTab]);

  const pendingCount = requests?.filter(r => r.status === 'pending').length || 0;
  const approvedCount = requests?.filter(r => r.status === 'approved').length || 0;
  const rejectedCount = requests?.filter(r => r.status === 'rejected').length || 0;
  const totalCount = requests?.length || 0;

  const handleApproveClick = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsUserCreationDialogOpen(true);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };

  const handleViewDetails = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const renderRequestCard = (request: RegistrationRequest) => {
    const isFacility = request.type === 'facility';
    const data = request.data;
    const title = isFacility ? data.facilityName : data.organizationName;
    const subtitle = isFacility ? `${data.facilityType} in ${data.lga}` : `${data.systemName} - ${data.technicalContactEmail}`;
    const Icon = isFacility ? Building2 : Code2;

    const statusBadge = (
      <Badge
        variant="outline"
        className={
          request.status === "approved"
            ? "bg-success/10 text-success border-success/20"
            : request.status === "pending"
            ? "bg-warning/10 text-warning border-warning/20"
            : "bg-destructive/10 text-destructive border-destructive/20"
        }
      >
        {request.status === "approved" ? (
          <CheckCircle2 className="w-3 h-3 mr-1" />
        ) : request.status === "pending" ? (
          <Clock className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        )}
        {request.status}
      </Badge>
    );

    return (
      <Card key={request.id} className="p-6 border-border hover:border-primary/50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                {statusBadge}
              </div>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
              <p className="text-xs text-muted-foreground mt-2">Submitted: {request.submitted_at}</p>
            </div>
          </div>

          <div className="flex gap-2 ml-4 flex-shrink-0">
            <Button size="sm" variant="outline" onClick={() => handleViewDetails(request)}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            {request.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90" 
                  onClick={() => handleApproveClick(request)}
                  disabled={rejectMutation.isPending}
                >
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="border-destructive/50" 
                  onClick={() => handleReject(request.id)}
                  disabled={rejectMutation.isPending}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 border-border">
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      );
    }

    if (isError || !requests) {
      return (
        <Card className="p-8 border-destructive/20 bg-destructive/10 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <p className="text-destructive">Error loading registration requests.</p>
        </Card>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <Card className="p-8 border-border text-center bg-secondary/50">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-3" />
          <p className="text-muted-foreground">No {activeTab} requests found.</p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredRequests.map(renderRequestCard)}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Registration Requests</h1>
        <p className="text-muted-foreground">Review and manage pending facility and developer access requests.</p>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
          <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
      
      {rejectMutation.isPending && (
        <div className="fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-lg shadow-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing request...
        </div>
      )}

      {/* Request Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRequest?.type === 'facility' ? <Building2 className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
              {selectedRequest?.type === 'facility' ? 'Facility Request' : 'Developer Request'}
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedRequest?.submitted_at}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] p-4 border border-border rounded-lg bg-secondary">
            <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
              {JSON.stringify(selectedRequest?.data, null, 2)}
            </pre>
          </ScrollArea>
          {selectedRequest?.status === 'pending' && (
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleReject(selectedRequest.id);
                  setIsDetailsDialogOpen(false);
                }}
              >
                Reject
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90" 
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  handleApproveClick(selectedRequest);
                }}
              >
                Approve & Create Account
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* User Creation Dialog (Final Approval Step) */}
      <UserCreationDialog
        isOpen={isUserCreationDialogOpen}
        onOpenChange={setIsUserCreationDialogOpen}
        request={selectedRequest}
      />
    </div>
  );
};

export default RegistrationRequests;
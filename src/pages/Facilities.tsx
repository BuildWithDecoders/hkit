import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityCardList } from "@/components/facilities/FacilityCardList";
import { useState, useMemo } from "react";
import { useFacilities, useApproveFacility, useRejectFacility } from "@/hooks/use-hkit-data";
import { Facility } from "@/api/hkit";
import { Skeleton } from "@/components/ui/skeleton";

const Facilities = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: facilities, isLoading, isError } = useFacilities();
  const approveMutation = useApproveFacility();
  const rejectMutation = useRejectFacility();

  const handleApprove = (id: number, name: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: number, name: string) => {
    rejectMutation.mutate(id);
  };

  const filteredFacilities = useMemo(() => {
    if (!facilities) return [];
    switch (activeTab) {
      case 'verified':
        return facilities.filter(f => f.status === 'verified');
      case 'pending':
        return facilities.filter(f => f.status === 'pending');
      case 'rejected':
        return facilities.filter(f => f.status === 'rejected');
      case 'all':
      default:
        return facilities;
    }
  }, [facilities, activeTab]);

  const verifiedCount = facilities?.filter(f => f.status === 'verified').length || 0;
  const pendingCount = facilities?.filter(f => f.status === 'pending').length || 0;
  const rejectedCount = facilities?.filter(f => f.status === 'rejected').length || 0;
  const totalCount = facilities?.length || 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 border-border">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <Card className="p-8 border-destructive/20 bg-destructive/10 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <p className="text-destructive">Error loading facility data. Please try refreshing.</p>
        </Card>
      );
    }

    return (
      <FacilityCardList 
        facilities={filteredFacilities} 
        showActions={true} 
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Facility Registry</h1>
          <p className="text-muted-foreground">Manage facility onboarding and compliance</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Add New Facility
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button variant="outline" className="border-border">
          Filter by LGA
        </Button>
        <Button variant="outline" className="border-border">
          Export List
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Facilities ({totalCount})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verifiedCount})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
      
      {(approveMutation.isPending || rejectMutation.isPending) && (
        <div className="fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-lg shadow-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing facility update...
        </div>
      )}
    </div>
  );
};

export default Facilities;
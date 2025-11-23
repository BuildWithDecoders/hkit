import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityCardList } from "@/components/facilities/FacilityCardList";
import { useState } from "react";

const initialFacilities = [
  {
    id: 1,
    name: "General Hospital Ilorin",
    lga: "Ilorin West",
    type: "Public",
    status: "verified" as const,
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
    status: "verified" as const,
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
    status: "verified" as const,
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
    status: "pending" as const,
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
    status: "pending" as const,
    compliance: 0,
    administrators: 0,
    apiActivity: "N/A",
    lastSync: "N/A",
  },
];

const Facilities = () => {
  const [activeTab, setActiveTab] = useState("all");

  const verifiedCount = initialFacilities.filter(f => f.status === 'verified').length;
  const pendingCount = initialFacilities.filter(f => f.status === 'pending').length;
  const totalCount = initialFacilities.length;

  const getFilteredFacilities = () => {
    switch (activeTab) {
      case 'verified':
        return initialFacilities.filter(f => f.status === 'verified');
      case 'pending':
        return initialFacilities.filter(f => f.status === 'pending');
      case 'all':
      default:
        return initialFacilities;
    }
  };

  const filteredFacilities = getFilteredFacilities();

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
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <FacilityCardList facilities={filteredFacilities} showActions={true} />
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          <FacilityCardList facilities={filteredFacilities} showActions={true} />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <FacilityCardList facilities={filteredFacilities} showActions={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Facilities;
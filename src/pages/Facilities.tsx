import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, Clock, XCircle, MapPin, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const facilities = [
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
];

const Facilities = () => {
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Facilities (118)</TabsTrigger>
          <TabsTrigger value="verified">Verified (110)</TabsTrigger>
          <TabsTrigger value="pending">Pending (8)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {facilities.map((facility) => (
              <Card key={facility.id} className="p-6 border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{facility.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          facility.status === "verified"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {facility.status === "verified" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {facility.status === "verified" ? "Verified" : "Pending Approval"}
                      </Badge>
                      <Badge variant="outline" className="border-border">
                        {facility.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{facility.lga}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{facility.administrators} admins</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">API Activity: </span>
                        <span className="text-foreground font-medium">{facility.apiActivity}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Sync: </span>
                        <span className="text-foreground font-medium">{facility.lastSync}</span>
                      </div>
                    </div>

                    {facility.status === "verified" && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Compliance Score</span>
                          <span className="text-sm font-semibold text-foreground">{facility.compliance}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${facility.compliance}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {facility.status === "pending" ? (
                      <>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-border">
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" className="border-border">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-border">
                          Manage
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verified">
          <p className="text-muted-foreground text-center py-8">Showing verified facilities only</p>
        </TabsContent>

        <TabsContent value="pending">
          <p className="text-muted-foreground text-center py-8">Showing pending facilities only</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Facilities;

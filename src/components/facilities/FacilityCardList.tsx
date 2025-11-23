import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Facility {
  id: number;
  name: string;
  lga: string;
  type: string;
  status: "verified" | "pending" | "rejected";
  compliance: number;
  administrators: number;
  apiActivity: string;
  lastSync: string;
}

interface FacilityCardListProps {
  facilities: Facility[];
  showActions: boolean;
}

const FacilityCardList: React.FC<FacilityCardListProps> = ({ facilities, showActions }) => {
  const navigate = useNavigate();

  const handleApprove = (facilityName: string) => {
    toast.success(`Facility ${facilityName} approved!`, {
      description: "The facility administrator will be notified to complete setup.",
    });
    // In a real app, this would trigger a state update/API call
  };

  const handleReject = (facilityName: string) => {
    toast.error(`Facility ${facilityName} rejected.`, {
      description: "The facility contact has been notified.",
    });
    // In a real app, this would trigger a state update/API call
  };

  const handleViewDetails = (facilityId: number) => {
    navigate(`/facilities/${facilityId}`);
  };

  if (facilities.length === 0) {
    return (
      <Card className="p-8 border-border text-center bg-secondary/50">
        <XCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No facilities found matching this criteria.</p>
      </Card>
    );
  }

  return (
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
                      : facility.status === "pending"
                      ? "bg-warning/10 text-warning border-warning/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }
                >
                  {facility.status === "verified" ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : facility.status === "pending" ? (
                    <Clock className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {facility.status === "verified" ? "Verified" : facility.status === "pending" ? "Pending Approval" : "Rejected"}
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

            {showActions && (
              <div className="flex gap-2 ml-4 flex-shrink-0">
                {facility.status === "pending" ? (
                  <>
                    <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleApprove(facility.name)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="border-border" onClick={() => handleReject(facility.name)}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="border-border" onClick={() => handleViewDetails(facility.id)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="border-border" onClick={() => handleViewDetails(facility.id)}>
                      Manage
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export { FacilityCardList };
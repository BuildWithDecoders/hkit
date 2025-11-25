import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Code2 } from "lucide-react";
import { FacilityRegistrationForm } from "@/components/registration/FacilityRegistrationForm";
import { DeveloperRegistrationForm } from "@/components/registration/DeveloperRegistrationForm";
import { Link } from "react-router-dom";

const Register = () => {
  useEffect(() => {
    document.title = "Register Organization | Hkit Portal";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-3xl border-border bg-card/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Hkit Registration</CardTitle>
          <CardDescription className="text-muted-foreground">
            Register your organization to join the Kwara State Health Information Exchange.
          </CardDescription>
        </CardHeader>
        
        <div className="p-6 pt-0">
          <Tabs defaultValue="facility" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary h-auto p-1">
              <TabsTrigger value="facility" className="flex items-center gap-2 py-2">
                <Building2 className="w-4 h-4" />
                Facility Registration
              </TabsTrigger>
              <TabsTrigger value="developer" className="flex items-center gap-2 py-2">
                <Code2 className="w-4 h-4" />
                Developer/Vendor Access
              </TabsTrigger>
            </TabsList>

            <TabsContent value="facility" className="mt-6">
              <FacilityRegistrationForm />
            </TabsContent>

            <TabsContent value="developer" className="mt-6">
              <DeveloperRegistrationForm />
            </TabsContent>
          </Tabs>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already registered? <Link to="/login" className="text-primary hover:underline">Sign In here</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
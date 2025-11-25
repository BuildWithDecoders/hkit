import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, Mail, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateFacilityIntegrationSettings } from "@/hooks/use-hkit-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FacilityIntegrationSettings } from "@/api/hkit"; // Import FacilityIntegrationSettings type

const integrationSchema = z.object({
  emrSystem: z.string().min(1, "EMR System name is required."),
  fhirEndpoint: z.string().url("Must be a valid URL").min(1, "FHIR Endpoint URL is required."),
});

type IntegrationFormValues = z.infer<typeof integrationSchema>;

export function FacilitySettings() {
  const { user } = useAuth();
  const facilityName = user?.facilityName || "Your Facility";
  const updateSettingsMutation = useUpdateFacilityIntegrationSettings();

  // Mock initial values (in a real app, these would be fetched via a query hook)
  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      emrSystem: "OpenMRS",
      fhirEndpoint: "https://emr.ghilorin.com/fhir/r4",
    },
  });

  const onSubmit = async (data: IntegrationFormValues) => {
    await updateSettingsMutation.mutateAsync(data as FacilityIntegrationSettings);
  };

  const handleConfigureAlerts = () => {
    toast.info("Action: Opening Alert Configuration Dialog (Mock)");
  };

  const isSubmitting = updateSettingsMutation.isPending;

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Server className="w-5 h-5" />
            EMR Integration Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Configure the connection details for {facilityName}'s EMR system.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emrSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EMR System Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fhirEndpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FHIR Endpoint URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Integration Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Set up alerts for failed submissions and low data quality scores.</p>
          {/* Placeholder for notification toggles */}
          <Button variant="outline" className="border-border" onClick={handleConfigureAlerts}>
            Configure Alerts (Mock)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Shield, Save, Loader2 } from "lucide-react";
import { useUpdateMoHSystemSettings } from "@/hooks/use-hkit-data";
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
import { MoHSystemSettings } from "@/api/hkit"; // Import MoHSystemSettings type

const systemSettingsSchema = z.object({
  minCompleteness: z.coerce.number().min(50).max(100, "Must be between 50 and 100"),
  errorAlertLimit: z.coerce.number().min(1, "Must be at least 1"),
});

const governanceSettingsSchema = z.object({
  defaultConsentExpiry: z.coerce.number().min(1, "Must be at least 1 month"),
});

type SystemFormValues = z.infer<typeof systemSettingsSchema>;
type GovernanceFormValues = z.infer<typeof governanceSettingsSchema>;

export function MoHSettings() {
  const updateSystemMutation = useUpdateMoHSystemSettings();

  // Form for Data Quality
  const systemForm = useForm<SystemFormValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      minCompleteness: 80,
      errorAlertLimit: 500,
    },
  });

  // Form for Governance
  const governanceForm = useForm<GovernanceFormValues>({
    resolver: zodResolver(governanceSettingsSchema),
    defaultValues: {
      defaultConsentExpiry: 12,
    },
  });

  const handleSaveSystemSettings = async (data: SystemFormValues) => {
    const governanceData = governanceForm.getValues();
    // Combine data from both forms to satisfy MoHSystemSettings interface
    await updateSystemMutation.mutateAsync({
      ...data,
      defaultConsentExpiry: governanceData.defaultConsentExpiry,
    } as MoHSystemSettings);
  };
  
  const handleSaveGovernanceSettings = async (data: GovernanceFormValues) => {
    const systemData = systemForm.getValues();
    // Combine data from both forms to satisfy MoHSystemSettings interface
    await updateSystemMutation.mutateAsync({
      ...systemData,
      defaultConsentExpiry: data.defaultConsentExpiry,
    } as MoHSystemSettings);
  };

  const isSubmitting = updateSystemMutation.isPending;

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Quality Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...systemForm}>
            <form onSubmit={systemForm.handleSubmit(handleSaveSystemSettings)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={systemForm.control}
                  name="minCompleteness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Completeness Threshold (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={systemForm.control}
                  name="errorAlertLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Error Alert Limit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-secondary border-border" disabled={isSubmitting} />
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
                Save Data Quality Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Governance Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...governanceForm}>
            <form onSubmit={governanceForm.handleSubmit(handleSaveGovernanceSettings)} className="space-y-4">
              <FormField
                control={governanceForm.control}
                name="defaultConsentExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Consent Expiry (Months)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-secondary border-border" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="outline" className="border-border" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Governance Defaults
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const facilitySchema = z.object({
  facilityName: z.string().min(3, "Facility name is required"),
  facilityType: z.string().min(3, "Facility type is required (e.g., General Hospital)"),
  lga: z.string().min(2, "LGA is required"),
  contactName: z.string().min(3, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number is required"),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

export function FacilityRegistrationForm() {
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      facilityName: "",
      facilityType: "",
      lga: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = (data: FacilityFormValues) => {
    console.log("Facility Registration Data:", data);
    toast.success("Registration submitted!", {
      description: "Your facility is now pending MoH approval. We will contact you shortly.",
    });
    form.reset();
  };

  return (
    <CardContent className="p-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="facilityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Name</FormLabel>
                  <FormControl>
                    <Input placeholder="General Hospital Ilorin" {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facilityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Public / Private Clinic" {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="lga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local Government Area (LGA)</FormLabel>
                <FormControl>
                  <Input placeholder="Ilorin West" {...field} className="bg-secondary border-border" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h4 className="text-lg font-semibold pt-4 border-t border-border">Primary Contact Details</h4>

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} className="bg-secondary border-border" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@hospital.com" {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+234 80..." {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            <Building2 className="w-4 h-4 mr-2" />
            Submit Facility Registration
          </Button>
        </form>
      </Form>
    </CardContent>
  );
}
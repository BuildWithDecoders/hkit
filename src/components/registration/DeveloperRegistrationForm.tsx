import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Code2, Mail, Users } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const developerSchema = z.object({
  organizationName: z.string().min(3, "Organization name is required"),
  systemName: z.string().min(3, "System name (e.g., EMR, LIS) is required"),
  technicalContactName: z.string().min(3, "Technical contact name is required"),
  technicalContactEmail: z.string().email("Invalid email address"),
  useCase: z.string().min(10, "Please describe your integration use case"),
});

type DeveloperFormValues = z.infer<typeof developerSchema>;

export function DeveloperRegistrationForm() {
  const form = useForm<DeveloperFormValues>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      organizationName: "",
      systemName: "",
      technicalContactName: "",
      technicalContactEmail: "",
      useCase: "",
    },
  });

  const onSubmit = (data: DeveloperFormValues) => {
    console.log("Developer Registration Data:", data);
    toast.success("Developer request submitted!", {
      description: "You will receive sandbox credentials and documentation access upon approval.",
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
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="EMR Solutions Inc." {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Name</FormLabel>
                  <FormControl>
                    <Input placeholder="MediFlow EMR" {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h4 className="text-lg font-semibold pt-4 border-t border-border">Technical Contact</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="technicalContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Developer" {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicalContactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tech@emrsolutions.com" {...field} className="bg-secondary border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="useCase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integration Use Case</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Describe how your system will interact with the HIE (e.g., submitting patient demographics, retrieving lab results)."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-secondary border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            <Code2 className="w-4 h-4 mr-2" />
            Request Developer Access
          </Button>
        </form>
      </Form>
    </CardContent>
  );
}
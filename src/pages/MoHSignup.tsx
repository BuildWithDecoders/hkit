import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { signUpMoH } from "@/api/hkit";
import { useNavigate } from "react-router-dom";

const MoHSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
    }

    try {
      await signUpMoH(email, password, firstName, lastName);
      toast.success("MoH Account Created!", {
        description: "You can now log in with your credentials.",
      });
      navigate("/login");
    } catch (error) {
      toast.error("Signup Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center">
          <Shield className="w-10 h-10 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold">MoH Administrator Setup</CardTitle>
          <CardDescription className="text-destructive font-semibold">
            ⚠️ This page is for initial system setup only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        placeholder="Amina"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="bg-secondary border-border"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        placeholder="Bello"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="bg-secondary border-border"
                    />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@moh.kwara.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (min 6 chars)</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Create MoH Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoHSignup;
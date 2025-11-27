import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const MOCK_CREDENTIALS = [
  { role: "MoH Admin", email: "moh@gmail.com", path: "/moh/dashboard" },
  { role: "Facility Admin", email: "facilities@gmail.com", path: "/facility/dashboard" },
  { role: "Developer", email: "developer@gmail.com", path: "/developer/dashboard" },
];
const MOCK_PASSWORD = "password123";


const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Sign In | Hkit Portal";
  }, []);

  // If already authenticated, the useAuth hook handles redirection.
  // We only need to show a loading state here if the session is being checked.
  if (isAuthenticated && !isLoading) {
    // The AuthProvider handles the specific dashboard redirect based on role.
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4 space-y-6">
      <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/Hkit.png" 
              alt="Hkit Logo" 
              className="h-12 w-auto shadow-[0_0_15px_hsl(var(--primary-glow)/0.5)] rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold sr-only">Hkit Login</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to the State HIE Management Portal</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@moh.kwara.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isBusy}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isBusy}
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isBusy}>
              {isBusy ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Sign In
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need access? <Link to="/register" className="text-primary hover:underline">Register your organization</Link>
          </p>
        </CardContent>
      </Card>
      
      {/* Hackathon Judge Credentials */}
      <Card className="w-full max-w-md border-primary/50 bg-card/90 animate-fade-in p-6">
        <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Hackathon Judge Credentials
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use these accounts to quickly test role-based access control (Password: <span className="font-mono text-foreground bg-secondary px-1 rounded">{MOCK_PASSWORD}</span>)
        </p>
        
        <div className="space-y-3">
          {MOCK_CREDENTIALS.map((cred) => (
            <div key={cred.role} className="flex justify-between items-center p-3 bg-secondary rounded-lg border border-border">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{cred.role}</span>
                <span className="text-xs text-muted-foreground">{cred.email}</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {cred.path}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Login;
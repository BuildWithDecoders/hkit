import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
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
    </div>
  );
};

export default Login;
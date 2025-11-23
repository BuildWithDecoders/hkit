import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Activity, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Mocked password state

  // If already authenticated, redirect to the appropriate dashboard
  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd validate password too. Here, we only use username for mock role lookup.
    login(username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary-glow)/0.5)]">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Hkit Login</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Sign in to the State HIE Management Portal</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (Try: moh, facility, or developer)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need access? <a href="/" className="text-primary hover:underline">Register your organization</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
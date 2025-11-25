import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { useEffect } from "react";

const Unauthorized = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Access Denied | Hkit Portal";
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <ShieldOff className="w-16 h-16 text-destructive mb-6" />
      <h1 className="mb-4 text-4xl font-bold text-foreground">Access Denied</h1>
      <p className="mb-8 text-xl text-muted-foreground">
        You do not have the necessary permissions to view this page.
      </p>
      <Button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary/90">
        Go Back
      </Button>
    </div>
  );
};

export default Unauthorized;
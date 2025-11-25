import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface TemporaryPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  password: string | null;
  email: string | null;
}

export function TemporaryPasswordDialog({ isOpen, onOpenChange, password, email }: TemporaryPasswordDialogProps) {
  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!");
    }
  };

  if (!password) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-success">
            <CheckCircle2 className="w-5 h-5" />
            Account Approved & Created
          </DialogTitle>
          <DialogDescription>
            A temporary password has been generated for the new user. Please securely share this password with the user at **{email}**.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Temporary Password</label>
            <div className="flex gap-2">
              <Input 
                type="text" 
                value={password} 
                readOnly 
                className="flex-1 bg-secondary border-border font-mono"
              />
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-warning">
            Note: The user will be prompted to change this password upon first login.
          </p>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)} className="bg-primary hover:bg-primary/90">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
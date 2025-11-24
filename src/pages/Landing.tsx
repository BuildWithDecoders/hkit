import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Network,
  Database,
  Code2,
  ArrowRight,
  Cpu,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const coreFeatures = [
  { icon: Network, title: "FHIR Interoperability", description: "Standards-based data exchange (FHIR R4, HL7 transformation)." },
  { icon: Shield, title: "Identity & Consent", description: "Master Patient Index and state-level consent registry." },
  { icon: Database, title: "Data Quality Engine", description: "Automated validation, minimum dataset enforcement, and compliance scoring." },
  { icon: Code2, title: "Developer APIs", description: "RESTful access, sandbox environment, webhooks, and comprehensive documentation." },
  { icon: Cpu, title: "Real-Time Monitoring", description: "Live dashboards, performance metrics, audit logs, and system health observability." },
  { icon: Lock, title: "Security & Auditing", description: "Role-based access control, end-to-end encryption, and complete accountability trail." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section: Formidable, Glowing, Minimalist */}
      <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary-glow))_0%,_transparent_70%)] opacity-10"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center space-y-10 animate-fade-in">
            
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
              Kwara State Digital Health Backbone
            </Badge>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold text-foreground leading-none tracking-tighter">
              <span className="block text-muted-foreground/50">HEALTH</span>
              <span className="block text-primary drop-shadow-[0_0_40px_hsl(var(--primary-glow))]">
                INFRASTRUCTURE
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              The unified platform for secure, standards-based health information exchange, powering a healthier Kwara State.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                onClick={() => navigate("/login")}
              >
                Access Management Portal
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:border-primary/50 px-10 py-7 text-lg"
                onClick={() => navigate("/developer")}
              >
                Developer Portal
                <Code2 className="ml-3 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Systems Section: Minimalist Grid */}
      <section className="py-24 bg-secondary/30 border-t border-b border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Core HIE Systems
            </h2>
            <p className="text-lg text-muted-foreground">
              A robust, scalable architecture built on modern interoperability standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, i) => (
              <Card
                key={i}
                className={cn(
                  "p-8 border-border bg-card transition-all duration-300",
                  "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <feature.icon className="w-7 h-7 text-primary flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed mt-4">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (Simplified) */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="relative overflow-hidden border-primary/20 bg-card/50 p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary-glow))_0%,_transparent_70%)] opacity-10"></div>
            <div className="relative max-w-4xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Join the Digital Health Revolution
              </h2>
              <p className="text-xl text-muted-foreground">
                Register your facility or start building your integration today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                  onClick={() => navigate("/register")}
                >
                  Register Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/Hkit.png" 
                alt="Hkit Logo" 
                className="h-8 w-auto shadow-[0_0_15px_hsl(var(--primary-glow)/0.5)] rounded-lg"
              />
              <p className="text-sm text-muted-foreground">Kwara State Health Infrastructure</p>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Kwara State Ministry of Health.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
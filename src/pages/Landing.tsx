import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Shield,
  Network,
  Database,
  Code2,
  Building2,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  Globe,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary-glow))_0%,_transparent_50%)] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="flex items-center justify-center mb-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1">
              Kwara State Digital Health Backbone
            </Badge>
          </div>
          
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
              Health Data
              <br />
              <span className="text-primary drop-shadow-[0_0_30px_hsl(var(--primary-glow))]">
                Unified
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              State-wide digital infrastructure enabling secure, standards-based health information exchange across all healthcare facilities in Kwara State
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-[0_0_30px_hsl(var(--primary-glow)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary-glow)/0.5)] transition-all"
                onClick={() => navigate("/login")}
              >
                Access Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:border-primary/50 px-8 py-6 text-lg"
                onClick={() => navigate("/developer")}
              >
                Developer Portal
                <Code2 className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20">
            {[
              { label: "Connected Facilities", value: "118", icon: Building2 },
              { label: "FHIR Events Daily", value: "45K+", icon: Activity },
              { label: "API Success Rate", value: "99.2%", icon: CheckCircle2 },
              { label: "EMR Integrations", value: "24", icon: Network },
            ].map((stat, i) => (
              <Card
                key={i}
                className="p-6 border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-primary mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Complete Health Infrastructure
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to power a state-wide health information exchange ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Network,
                title: "FHIR-Based Interoperability",
                description: "Standards-compliant data exchange using FHIR R4, HL7 transformation, and real-time event streaming",
              },
              {
                icon: Shield,
                title: "Consent & Identity",
                description: "Master Patient Index, state-level consent registry, and role-based access control",
              },
              {
                icon: Database,
                title: "Data Quality Engine",
                description: "Automated validation, minimum dataset enforcement, and facility compliance scoring",
              },
              {
                icon: Code2,
                title: "Developer-First APIs",
                description: "RESTful FHIR APIs, sandbox environment, webhooks, and comprehensive documentation",
              },
              {
                icon: Activity,
                title: "Real-Time Monitoring",
                description: "Live dashboards, performance metrics, audit logs, and system health observability",
              },
              {
                icon: Zap,
                title: "Scalable Infrastructure",
                description: "Cloud-native architecture built to scale from prototype to millions of patients",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-8 border-border bg-card hover:border-primary/50 transition-all group animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Built For Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Serving the entire healthcare ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Ministry of Health",
                description: "State-wide oversight, facility governance, compliance monitoring, and health intelligence dashboards",
                icon: Globe,
              },
              {
                title: "Healthcare Facilities",
                description: "Seamless integration, patient referrals, data sharing, and compliance management",
                icon: Building2,
              },
              {
                title: "EMR Vendors & Developers",
                description: "API access, sandbox testing, documentation, webhook subscriptions, and technical support",
                icon: Code2,
              },
              {
                title: "Public Health Analysts",
                description: "Analytics, reporting, data quality insights, and evidence-based planning tools",
                icon: Users,
              },
            ].map((useCase, i) => (
              <Card
                key={i}
                className="p-8 border-border bg-card hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary-glow))_0%,_transparent_70%)] opacity-10"></div>
            <div className="relative p-12 md:p-16 text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                  Ready to Transform Healthcare in Kwara State?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join the state-wide health information exchange ecosystem
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-[0_0_30px_hsl(var(--primary-glow)/0.3)]"
                    onClick={() => navigate("/register")}
                  >
                    Register Your Facility
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border hover:border-primary/50 px-8 py-6 text-lg"
                    onClick={() => navigate("/developer")}
                  >
                    Explore API Docs
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/Hkit.png" 
                alt="Hkit Logo" 
                className="h-10 w-auto shadow-[0_0_15px_hsl(var(--primary-glow)/0.5)] rounded-lg"
              />
              <div>
                <p className="font-bold text-foreground sr-only">Hkit</p>
                <p className="text-sm text-muted-foreground">Kwara State Health Infrastructure</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Kwara State Ministry of Health. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
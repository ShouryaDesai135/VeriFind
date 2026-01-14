import { Link } from 'react-router-dom';
import { MapPin, Search, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { platformStats } from '@/data/mockData';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container max-w-lg mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">CampusFind</span>
        </div>
        <Link to="/auth">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container max-w-lg mx-auto px-4 pt-8 pb-16">
        <div className="text-center animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight">
            Lost something?
            <br />
            <span className="text-primary">Find it here.</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Your campus community helping each other recover lost items quickly and securely.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <Link to="/auth" className="w-full">
            <Button size="lg" className="w-full h-14 text-base font-medium btn-press">
              Report Lost Item
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/auth" className="w-full">
            <Button variant="outline" size="lg" className="w-full h-14 text-base font-medium btn-press">
              Browse Found Items
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide text-center">
            Why CampusFind?
          </h2>
          <div className="grid gap-3">
            <FeatureCard
              icon={Shield}
              title="Secure Verification"
              description="Secret question matching ensures items go to the right owner"
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered"
              description="Smart matching helps connect lost items with their owners"
            />
            <FeatureCard
              icon={Search}
              title="Quick Search"
              description="Find what you're looking for with powerful filters"
            />
          </div>
        </div>

        {/* Stats */}
        <div
          className="mt-16 grid grid-cols-3 gap-4 animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          <StatBlock value={platformStats.itemsReturned.toLocaleString()} label="Items Returned" />
          <StatBlock value={platformStats.activeListings.toString()} label="Active Listings" />
          <StatBlock value={`${platformStats.successRate}%`} label="Success Rate" />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
      <div className="p-2 rounded-lg bg-accent shrink-0">
        <Icon className="w-5 h-5 text-accent-foreground" />
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

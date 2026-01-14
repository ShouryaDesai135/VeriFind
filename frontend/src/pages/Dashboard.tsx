import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, TrendingUp, Plus, Search } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatCard } from '@/components/common/StatCard';
import { ActivityItem } from '@/components/common/ActivityItem';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const firstName = profile?.name?.split(' ')[0] || 'there';

  const [stats, setStats] = useState({
    itemsPosted: 0,
    activeClaims: 0,
    returnedItems: 0,
    successRate: 0,
  });

  const [matches, setMatches] = useState<any[]>([]);

  const [activities, setActivities] = useState<any[]>([]);

  // Load stats
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "items"), where("postedBy", "==", user.uid));

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => d.data());

      const posted = items.length;
      const claimed = items.filter((i: any) => i.status === "claimed").length;
      const resolved = items.filter((i: any) => i.status === "resolved").length;

      setStats({
        itemsPosted: posted,
        activeClaims: claimed,
        returnedItems: resolved,
        successRate: posted ? Math.round((resolved / posted) * 100) : 0,
      });
    });

    return () => unsub();
  }, [user]);

  // Load activity history
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "activity"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setActivities(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!profile) return;

    fetch(`http://localhost:4000/api/matches/${profile.uid}`)
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch(() => {});
  }, [profile]);

  return (
    <>
      <PageContainer>
        {/* Header */}
        <div className="animate-fade-up">
          <p className="text-muted-foreground">Good morning,</p>
          <h1 className="text-2xl font-bold text-foreground">{firstName} 👋</h1>
        </div>

        {/* Stats Grid */}
        <div
          className="mt-6 grid grid-cols-2 gap-3 animate-fade-up"
          style={{ animationDelay: "50ms" }}
        >
          <StatCard
            icon={Package}
            label="Items Posted"
            value={stats.itemsPosted}
          />
          <StatCard
            icon={Clock}
            label="Active Claims"
            value={stats.activeClaims}
          />
          <StatCard
            icon={CheckCircle}
            label="Returned"
            value={stats.returnedItems}
          />
          <StatCard
            icon={TrendingUp}
            label="Success Rate"
            value={`${stats.successRate}%`}
          />
        </div>

        {/* Quick Actions */}
        <div
          className="mt-8 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Quick Actions
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link to="/post">
              <Button
                variant="outline"
                className="w-full h-24 flex-col gap-2 bg-card border-border card-hover btn-press"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">Post New Item</span>
              </Button>
            </Link>
            <Link to="/items">
              <Button
                variant="outline"
                className="w-full h-24 flex-col gap-2 bg-card border-border card-hover btn-press"
              >
                <div className="p-2 rounded-lg bg-accent">
                  <Search className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-medium">Browse Items</span>
              </Button>
            </Link>
          </div>
        </div>

        {matches.length > 0 && (
          <div className="mt-8 animate-fade-up">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🔔 Possible Matches
            </h2>

            <div className="mt-3 space-y-3">
              {matches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/item/${m.id}`)}
                  className="p-4 bg-card border border-border rounded-xl cursor-pointer hover:border-primary"
                >
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground">{m.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div
          className="mt-8 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Recent Activity
          </h2>
          <div className="mt-3 bg-card rounded-xl border border-border divide-y divide-border">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="px-4">
                  <ActivityItem activity={activity} />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
      <BottomNav />
    </>
  );
}

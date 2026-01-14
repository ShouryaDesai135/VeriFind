import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

type FireItem = {
  id: string;
  title: string;
  location: string;
  imageUrl?: string;
  status: "available" | "claimed" | "resolved";
};

type Tab = "posts" | "claims";

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [items, setItems] = useState<FireItem[]>([]);

  const [stats, setStats] = useState({
    itemsPosted: 0,
    activeClaims: 0,
    returnedItems: 0,
    successRate: 0,
  });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "items"), where("postedBy", "==", user.uid));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() as FireItem }));
      setItems(data);

      const posted = data.length;
      const claimed = data.filter((i) => i.status === "claimed").length;
      const resolved = data.filter((i) => i.status === "resolved").length;

      setStats({
        itemsPosted: posted,
        activeClaims: claimed,
        returnedItems: resolved,
        successRate: posted ? Math.round((resolved / posted) * 100) : 0,
      });
    });

    return () => unsub();
  }, [user]);

  const myPosts = items;
  const myClaims = items.filter((i) => i.status === "claimed");

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <PageContainer>
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{profile?.name}</h1>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatBox icon={Package} value={stats.itemsPosted} label="Posted" />
          <StatBox icon={Clock} value={stats.activeClaims} label="Claims" />
          <StatBox icon={CheckCircle} value={stats.returnedItems} label="Returned" />
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveTab("posts")}
              className={cn(
                "flex-1 py-2.5 rounded-md",
                activeTab === "posts" && "bg-card"
              )}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("claims")}
              className={cn(
                "flex-1 py-2.5 rounded-md",
                activeTab === "claims" && "bg-card"
              )}
            >
              My Claims
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {activeTab === "posts"
              ? myPosts.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/items/${item.id}`)}
                  />
                ))
              : myClaims.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/items/${item.id}`)}
                  />
                ))}
          </div>
        </div>

        {/* Settings */}
        <div className="mt-8">
          <h2 className="text-sm text-muted-foreground uppercase">Settings</h2>
          <div className="mt-3 bg-card rounded-xl border">
            <SettingRow icon={Bell} label="Notifications" action={<Switch />} />
            <Separator />
            <SettingRow icon={Moon} label="Dark Mode" action={<Switch />} />
            <Separator />
            <SettingRow
              icon={Settings}
              label="Edit Profile"
              action={<ChevronRight className="w-4 h-4" />}
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-8 text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </PageContainer>
      <BottomNav />
    </>
  );
}

function StatBox({ icon: Icon, value, label }: any) {
  return (
    <div className="bg-card rounded-xl border p-4 text-center">
      <Icon className="w-5 h-5 mx-auto text-primary" />
      <p className="text-xl font-bold mt-2">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ItemRow({ item, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border"
    >
      <img
        src={item.imageUrl || "https://via.placeholder.com/40"}
        className="w-12 h-12 rounded"
      />
      <div className="flex-1 text-left">
        <p className="font-medium">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.location}</p>
      </div>
      <span className="text-xs capitalize">{item.status}</span>
    </button>
  );
}

function SettingRow({ icon: Icon, label, action }: any) {
  return (
    <div className="flex justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      {action}
    </div>
  );
}

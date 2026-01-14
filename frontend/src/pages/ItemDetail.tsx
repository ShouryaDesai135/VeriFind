import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, HelpCircle, AlertTriangle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClaimModal } from "@/components/claim/ClaimModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load item from Firestore instead of mockItems
  useEffect(() => {
    if (!id) return;

    getDoc(doc(db, "items", id)).then((snap) => {
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() });
      } else {
        setItem(null);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PageContainer withBottomNav={false}>
        <p className="text-center mt-10 text-muted-foreground">Loading...</p>
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer withBottomNav={false}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Item Not Found</h1>
        </div>
        <p className="mt-8 text-center text-muted-foreground">
          This item doesn't exist or has been removed.
        </p>
      </PageContainer>
    );
  }

  const statusStyles = {
    available: "bg-success/10 text-success border-success/20",
    claimed: "bg-warning/10 text-warning border-warning/20",
    resolved: "bg-muted text-muted-foreground border-border",
  };

  const typeStyles = {
    lost: "bg-destructive/10 text-destructive",
    found: "bg-primary/10 text-primary",
  };

  return (
    <>
      <PageContainer withBottomNav={false} withTopPadding={false}>
        {/* Image Header */}
        <div className="relative aspect-[4/3] bg-muted -mx-4">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Badge
            className={cn(
              "absolute top-4 right-4 uppercase text-xs font-medium",
              typeStyles[item.type]
            )}
            variant="outline"
          >
            {item.type}
          </Badge>
        </div>

        {/* Content */}
        <div className="pt-6 animate-fade-up">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
            <Badge
              variant="outline"
              className={cn("capitalize shrink-0", statusStyles[item.status])}
            >
              {item.status}
            </Badge>
          </div>

          <p className="text-muted-foreground mt-3">{item.description}</p>

          {/* Info Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-xs uppercase font-medium">Location</span>
              </div>
              <p className="text-sm font-medium text-foreground mt-2">
                {item.location}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase font-medium">Date</span>
              </div>
              <p className="text-sm font-medium text-foreground mt-2">
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Hint Box */}
          <div className="mt-6 bg-accent/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-accent-foreground">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Public Hint</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              To claim this item, you'll need to answer a verification question
              that only the true owner would know.
            </p>
          </div>

          {/* Warning for lost items */}
          {item.type === "lost" && (
            <div className="mt-4 bg-warning/10 rounded-xl p-4 border border-warning/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    This item is lost
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you found this item, please contact the owner.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Claim Button */}
          {item.status === "available" &&
            item.type === "found" &&
            item.postedBy !== auth.currentUser?.uid && (
              <Button
                size="lg"
                className="w-full h-14 mt-8 text-base font-medium btn-press"
                onClick={() => setShowClaimModal(true)}
              >
                Claim This Item
              </Button>
            )}
        </div>
      </PageContainer>

      {/* Claim Modal */}
      <ClaimModal
        item={item}
        open={showClaimModal}
        onOpenChange={setShowClaimModal}
      />
    </>
  );
}

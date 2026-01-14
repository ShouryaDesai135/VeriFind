import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Item } from '@/data/mockData';
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface ClaimModalProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimModal({ item, open, onOpenChange }: ClaimModalProps) {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  // Case-insensitive secret check
  const correct =
    answer.toLowerCase().trim() === item.secretAnswer?.toLowerCase().trim();

  if (!correct) {
    setError("Incorrect answer. Please try again.");
    setIsLoading(false);
    return;
  }

  try {
    // Lock item as CLAIMED
    await updateDoc(doc(db, "items", item.id), {
      status: "claimed",
      claimedBy: auth.currentUser?.uid,
      claimedAt: new Date().toISOString(),
    });

    // Write activity
    await addDoc(collection(db, "activity"), {
      userId: auth.currentUser?.uid,
      type: "claimed",
      itemId: item.id,
      itemTitle: item.title,
      timestamp: new Date().toISOString(),
    });

    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Go to OTP screen
    onOpenChange(false);
    navigate("/otp", {
      state: {
        item,
        otp,
      },
    });
  } catch (err) {
    console.error(err);
    setError("Something went wrong. Try again.");
  }

  setIsLoading(false);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Verify Ownership</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Item Summary */}
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.location}</p>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="answer">Answer the secret question:</Label>
              <p className="text-sm font-medium text-foreground bg-accent/50 p-3 rounded-lg">
                {item.secretQuestion}
              </p>
            </div>

            <Input
              id="answer"
              placeholder="Type your answer..."
              className="h-12"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError('');
              }}
            />

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Warning */}
            <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
              <p className="text-xs text-muted-foreground">
                ⚠️ Please only claim items that belong to you. False claims may result
                in account suspension.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 btn-press"
              disabled={!answer.trim() || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Submit Verification'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

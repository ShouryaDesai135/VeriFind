import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  MapPin,
  Camera,
  Lock,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { categoryConfig, ItemCategory } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const steps = [
  { id: 1, title: 'Item Details', icon: Package },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Photo', icon: Camera },
  { id: 4, title: 'Verification', icon: Lock },
];

export default function PostItem() {
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    type: "found" as "lost" | "found",
    title: "",
    description: "",
    category: "" as ItemCategory | "",
    location: "",
    date: "",
    imageUrl: "",
    secretQuestion: "",
    secretAnswer: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        secretQuestion: form.type === "found" ? form.secretQuestion : null,
        secretAnswer: form.type === "found" ? form.secretAnswer : null,
      };


      const res = await fetch("http://localhost:4000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.matches.length > 0) {
        setAiMatches(data.matches);
        setShowMatches(true);
      } else {
        toast({
          title: "Item posted",
          description: "No matches yet. We'll notify you if something appears.",
        });
        navigate("/items");
      }
    } catch (err) {
      toast({
        title: "Post failed",
        description: "Could not reach AI server",
        variant: "destructive",
      });
    }
    await addDoc(collection(db, "activity"), {
      userId: auth.currentUser?.uid,
      type: "posted",
      itemTitle: form.title,
      timestamp: new Date().toISOString(),
    });
  };

  const updateForm = (updates: Partial<typeof form>) => {
    setForm({ ...form, ...updates });
  };

  {
    showMatches && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-background rounded-xl p-6 w-full max-w-md">
          <h2 className="text-lg font-bold">⚡ Possible Matches Found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            These items look similar to what you posted.
          </p>

          <div className="mt-4 space-y-3">
            {aiMatches.map((m) => (
              <div
                key={m.id}
                className="p-3 border rounded-lg cursor-pointer hover:border-primary"
                onClick={() => navigate(`/item/${m.id}`)}
              >
                <p className="font-medium">{m.title}</p>
                <p className="text-sm text-muted-foreground">{m.location}</p>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4" onClick={() => navigate("/items")}>
            Go to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageContainer withBottomNav={false}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Post Item</h1>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 4
          </p>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              currentStep === step.id
                ? "w-8 bg-primary"
                : currentStep > step.id
                ? "bg-primary"
                : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-8 animate-fade-up" key={currentStep}>
        {currentStep === 1 && <Step1 form={form} updateForm={updateForm} />}
        {currentStep === 2 && <Step2 form={form} updateForm={updateForm} />}
        {currentStep === 3 && <Step3 form={form} updateForm={updateForm} />}
        {currentStep === 4 && <Step4 form={form} updateForm={updateForm} />}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 h-12 btn-press"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12 btn-press"
          onClick={() => {
            if (currentStep < 4) {
              setCurrentStep(currentStep + 1);
            } else {
              handleSubmit();
            }
          }}
        >
          {currentStep === 4 ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Post Item
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </PageContainer>
  );
}

// Step 1: Item Details
function Step1({
  form,
  updateForm,
}: {
  form: any;
  updateForm: (updates: any) => void;
}) {
  const categories = Object.entries(categoryConfig) as [ItemCategory, { label: string }][];

  return (
    <div className="space-y-6">
      {/* Type Toggle */}
      <div>
        <Label>What are you reporting?</Label>
        <div className="mt-2 flex bg-secondary rounded-lg p-1">
          <button
            onClick={() => updateForm({ type: 'found' })}
            className={cn(
              'flex-1 py-3 text-sm font-medium rounded-md transition-all duration-200',
              form.type === 'found'
                ? 'bg-card text-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Found Item
          </button>
          <button
            onClick={() => updateForm({ type: 'lost' })}
            className={cn(
              'flex-1 py-3 text-sm font-medium rounded-md transition-all duration-200',
              form.type === 'lost'
                ? 'bg-card text-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Lost Item
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Item Name</Label>
        <Input
          id="title"
          placeholder="e.g., Black Backpack"
          className="h-12"
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => updateForm({ category: key })}
              className={cn(
                'py-3 px-2 text-xs font-medium rounded-lg border transition-all duration-200',
                form.category === key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the item in detail..."
          className="min-h-[100px] resize-none"
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
        />
      </div>
    </div>
  );
}

// Step 2: Location
function Step2({
  form,
  updateForm,
}: {
  form: any;
  updateForm: (updates: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Where was it {form.type}?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Help others locate the item
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g., Main Library, 3rd Floor"
          className="h-12"
          value={form.location}
          onChange={(e) => updateForm({ location: e.target.value })}
        />
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={() => {
          navigator.geolocation.getCurrentPosition((pos) => {
            updateForm({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
            alert("Location captured!");
          });
        }}
      >
        Use My Current Location
      </Button>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          className="h-12"
          value={form.date}
          onChange={(e) => updateForm({ date: e.target.value })}
        />
      </div>
    </div>
  );
}

// Step 3: Photo
function Step3({
  form,
  updateForm,
}: {
  form: any;
  updateForm: (updates: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Add a photo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A photo helps others identify the item
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          placeholder="https://example.com/image.jpg"
          className="h-12"
          value={form.imageUrl}
          onChange={(e) => updateForm({ imageUrl: e.target.value })}
        />
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
        <Camera className="w-10 h-10 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground mt-3">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG up to 5MB
        </p>
      </div>

      {form.imageUrl && (
        <div className="mt-4 rounded-xl overflow-hidden bg-muted aspect-video">
          <img
            src={form.imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

// Step 4: Verification
function Step4({
  form,
  updateForm,
}: {
  form: any;
  updateForm: (updates: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Set up verification</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create a secret question only the owner would know
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="secretQuestion">Secret Question</Label>
        <Input
          id="secretQuestion"
          placeholder="e.g., What brand is the charger?"
          className="h-12"
          value={form.secretQuestion}
          onChange={(e) => updateForm({ secretQuestion: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secretAnswer">Answer</Label>
        <Input
          id="secretAnswer"
          placeholder="The answer to verify ownership"
          className="h-12"
          value={form.secretAnswer}
          onChange={(e) => updateForm({ secretAnswer: e.target.value })}
        />
      </div>

      <div className="bg-accent/50 rounded-xl p-4">
        <p className="text-sm text-foreground font-medium">Why set up verification?</p>
        <p className="text-sm text-muted-foreground mt-1">
          This ensures items are returned to their rightful owners. Only someone
          who can answer the secret question correctly can claim this item.
        </p>
      </div>
    </div>

  );
}

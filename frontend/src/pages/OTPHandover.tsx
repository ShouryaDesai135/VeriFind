import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Check, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function OTPHandover() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const item = location.state?.item;

  // Generate a random 6-digit OTP
  const otp = '472819';

  const handleCopy = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    toast({
      title: 'Code copied!',
      description: 'Share this code with the item holder.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageContainer withBottomNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        {/* Success Animation */}
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-check-bounce">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mt-6">Claim Verified!</h1>
        <p className="text-muted-foreground mt-2 max-w-xs">
          Your ownership has been verified. Use the code below to collect your item.
        </p>

        {/* OTP Display */}
        <div className="mt-8 w-full max-w-xs">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <p className="text-xs uppercase font-medium text-muted-foreground tracking-wide">
              Handover Code
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              {otp.split('').map((digit, index) => (
                <div
                  key={index}
                  className="w-10 h-12 bg-secondary rounded-lg flex items-center justify-center text-xl font-bold text-foreground"
                >
                  {digit}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 btn-press"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 w-full max-w-xs text-left">
          <p className="text-sm font-medium text-foreground">What's next?</p>
          <ol className="mt-3 space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-sm text-muted-foreground">
                Contact the person who found your item
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-sm text-muted-foreground">
                Meet at a safe, public location on campus
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-sm text-muted-foreground">
                Share your handover code to verify and collect
              </span>
            </li>
          </ol>
        </div>

        {/* Done Button */}
        <Button
          size="lg"
          className="w-full max-w-xs mt-8 h-12 btn-press"
          onClick={() => navigate('/dashboard')}
        >
          Back to Home
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </PageContainer>
  );
}

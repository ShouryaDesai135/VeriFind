import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);

    // Navigate to landing after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/landing');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div
        className={`flex flex-col items-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lifted mb-6">
          <MapPin className="w-10 h-10 text-primary-foreground" />
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-foreground tracking-tight">CampusFind</h1>
        <p className="text-muted-foreground mt-2">Lost & Found, Simplified</p>

        {/* Loading indicator */}
        <div className="mt-12 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse-soft"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

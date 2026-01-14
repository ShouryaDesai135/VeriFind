import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ItemsFeed from "./pages/ItemsFeed";
import PostItem from "./pages/PostItem";
import ItemDetail from "./pages/ItemDetail";
import OTPHandover from "./pages/OTPHandover";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CampusMap from "./pages/CampusMap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/items" element={<ItemsFeed />} />
            <Route path="/post" element={<PostItem />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/otp" element={<OTPHandover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/map" element={<CampusMap />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Auth } from "./pages/Auth";
import { ThrifterTerms } from "./pages/ThrifterTerms";
import { ThrifterDashboard } from "./pages/ThrifterDashboard";
import { VisualSearchResults } from "./pages/VisualSearchResults";
import { StyleProfile } from "./pages/StyleProfile";
import { OurMission } from "./pages/OurMission";
import { HowToUse } from "./pages/HowToUse";
import { Connect } from "./pages/Connect";
import { CatalogAdmin } from "./pages/CatalogAdmin";
import CatalogScraper from "./pages/CatalogScraper";
import Gallery from "./pages/Gallery";
import CuraCart from "./pages/CuraCart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/thrifter-terms" element={<ThrifterTerms />} />
          <Route path="/thrifter-dashboard" element={<ThrifterDashboard />} />
          <Route path="/search" element={<VisualSearchResults />} />
          <Route path="/profile" element={<StyleProfile />} />
          <Route path="/style-profile" element={<StyleProfile />} /> {/* Redirect old route */}
          <Route path="/our-mission" element={<OurMission />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/catalog-admin" element={<CatalogAdmin />} />
          <Route path="/catalog-scraper" element={<CatalogScraper />} />
          <Route path="/cura-cart" element={<CuraCart />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

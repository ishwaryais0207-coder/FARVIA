import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SihDemoBar } from './components/SihDemoBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { MarketplacePage } from './pages/MarketplacePage';
import { RequirementsPage } from './pages/RequirementsPage';
import { SmartMatchesPage } from './pages/SmartMatchesPage';
import { SurplusProducePage } from './pages/SurplusProducePage';
import { FairPriceAnalyticsPage } from './pages/FairPriceAnalyticsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ImpactDashboard } from './pages/ImpactDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Modals
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AddProductModal } from './components/AddProductModal';
import { PostRequirementModal } from './components/PostRequirementModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { UpiPaymentModal } from './components/UpiPaymentModal';
import { LogisticsTrackerModal } from './components/LogisticsTrackerModal';
import { RateOrderModal } from './components/RateOrderModal';
import { PriceTransparencyModal } from './components/PriceTransparencyModal';
import { ToastContainer } from './components/ToastContainer';
import { NotificationCenterModal } from './components/NotificationCenterModal';

const AppContent: React.FC = () => {
  const { currentView, isNotificationCenterOpen, setIsNotificationCenterOpen } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'farmer-dashboard':
        return <FarmerDashboard />;
      case 'buyer-dashboard':
        return <BuyerDashboard />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'requirements':
        return <RequirementsPage />;
      case 'smart-matches':
        return <SmartMatchesPage />;
      case 'surplus':
        return <SurplusProducePage />;
      case 'fair-price':
        return <FairPriceAnalyticsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'impact':
        return <ImpactDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Smart India Hackathon Live Presentation Flow Bar */}
      <SihDemoBar />

      {/* Global Responsive Navigation Bar */}
      <Navbar />

      {/* Primary Page Canvas */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Application Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      <VoiceAssistantModal />
      <AddProductModal />
      <PostRequirementModal />
      <ProductDetailsModal />
      <UpiPaymentModal />
      <LogisticsTrackerModal />
      <RateOrderModal />
      <PriceTransparencyModal />
      
      {/* Toast Alert System & Notification Center */}
      <ToastContainer />
      <NotificationCenterModal 
        isOpen={isNotificationCenterOpen} 
        onClose={() => setIsNotificationCenterOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

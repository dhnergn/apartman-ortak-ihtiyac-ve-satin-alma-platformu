import React, { useState } from 'react';
import { TenantProvider, useTenant } from './lib/security/tenantContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './features/dashboard/DashboardView';
import { NeedsFeed } from './features/needs/NeedsFeed';
import { QuotesView } from './features/quotes/QuotesView';
import { VotingView } from './features/voting/VotingView';
import { ProvidersDirectory } from './features/providers/ProvidersDirectory';
import { AuditLogView } from './features/audit/AuditLogView';
import { ApartmentManagementView } from './features/apartments/ApartmentManagementView';
import { CreateNeedModal } from './features/needs/CreateNeedModal';
import { RegisterApartmentModal } from './features/apartments/RegisterApartmentModal';
import { Building2, Shield, HeartHandshake, CheckCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isCreateNeedOpen, setIsCreateNeedOpen] = useState<boolean>(false);
  const [isRegisterApartmentOpen, setIsRegisterApartmentOpen] = useState<boolean>(false);
  const { currentApartment, currentUser, currentUnit } = useTenant();

  const handleNavigateTab = (tab: string, catFilter?: string) => {
    setActiveTab(tab);
    setCategoryFilter(catFilter || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCategoryFilter(null);
        }}
        onOpenCreateNeed={() => setIsCreateNeedOpen(true)}
        onOpenRegisterApartment={() => setIsRegisterApartmentOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={handleNavigateTab}
            onOpenCreateNeed={() => setIsCreateNeedOpen(true)}
            onOpenRegisterApartment={() => setIsRegisterApartmentOpen(true)}
          />
        )}

        {activeTab === 'apartment' && (
          <ApartmentManagementView
            onOpenRegisterModal={() => setIsRegisterApartmentOpen(true)}
          />
        )}

        {activeTab === 'needs' && (
          <NeedsFeed
            onOpenCreateNeed={() => setIsCreateNeedOpen(true)}
            selectedCategoryFilter={categoryFilter}
          />
        )}

        {activeTab === 'quotes' && <QuotesView />}

        {activeTab === 'voting' && <VotingView />}

        {activeTab === 'providers' && <ProvidersDirectory />}

        {activeTab === 'audit' && <AuditLogView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Apartman İmece</span>
            <span>•</span>
            <span>Apartman ve Konut Toplulukları İçin Ortak Talep ve Teklif Platformu</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Tenant İzolasyonu Aktif ({currentApartment.name})
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Shield className="w-3.5 h-3.5 text-cyan-600" />
              1 Daire = 1 Oy Prensibi
            </span>
          </div>
        </div>
      </footer>

      {/* Global Need Creation Modal */}
      <CreateNeedModal
        isOpen={isCreateNeedOpen}
        onClose={() => setIsCreateNeedOpen(false)}
        onSuccess={() => {
          setActiveTab('needs');
        }}
      />

      {/* Register Apartment Modal */}
      <RegisterApartmentModal
        isOpen={isRegisterApartmentOpen}
        onClose={() => setIsRegisterApartmentOpen(false)}
        onSuccess={(newAptId) => {
          setActiveTab('apartment');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <TenantProvider>
      <MainContent />
    </TenantProvider>
  );
}

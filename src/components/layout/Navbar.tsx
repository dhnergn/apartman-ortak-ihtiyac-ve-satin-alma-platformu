import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { DEMO_USERS } from '../../lib/db/mockStore';
import {
  Building2,
  Users,
  ShieldCheck,
  PlusCircle,
  Vote,
  FileSpreadsheet,
  History,
  Store,
  ChevronDown,
  Sparkles,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateNeed: () => void;
  onOpenRegisterApartment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateNeed,
  onOpenRegisterApartment,
}) => {
  const {
    currentUser,
    currentApartment,
    apartments,
    switchUser,
    switchApartment,
    currentUnit,
  } = useTenant();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAptMenuOpen, setIsAptMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Banner / Tenant & Role Bar */}
      <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Apartment Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Aktif Konut:
            </span>
            <div className="relative">
              <button
                onClick={() => {
                  setIsAptMenuOpen(!isAptMenuOpen);
                  setIsUserMenuOpen(false);
                }}
                className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{currentApartment.name}</span>
                <span className="text-[10px] bg-cyan-900 text-cyan-300 px-1.5 py-0.5 rounded">
                  {currentApartment.district}, {currentApartment.city}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isAptMenuOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Apartman Değiştir (Multi-Tenant İzolasyon)
                  </div>
                  {apartments.map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => {
                        switchApartment(apt.id);
                        setIsAptMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                        apt.id === currentApartment.id ? 'bg-cyan-50 font-bold text-cyan-900' : ''
                      }`}
                    >
                      <div>
                        <div className="text-slate-900 font-medium">{apt.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {apt.district}, {apt.city} • {apt.totalUnits} Daire
                        </div>
                      </div>
                      {apt.id === currentApartment.id && (
                        <span className="w-2 h-2 rounded-full bg-cyan-600" />
                      )}
                    </button>
                  ))}

                  <div className="pt-1.5 mt-1 border-t border-slate-100 px-2 pb-1">
                    <button
                      onClick={() => {
                        setIsAptMenuOpen(false);
                        onOpenRegisterApartment();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Yeni Apartman / Site Kaydet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Persona & Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline">Kullanıcı Rolü Simülasyonu:</span>
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsAptMenuOpen(false);
                }}
                className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white">{currentUser.fullName}</span>
                {currentUnit && (
                  <span className="bg-slate-700 text-slate-200 px-1.5 py-0.2 rounded text-[10px]">
                    {currentUnit.unitNumber}
                  </span>
                )}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    currentUser.role === 'MANAGER'
                      ? 'bg-purple-900 text-purple-200'
                      : currentUser.role === 'PROVIDER' || currentUser.role === 'SUPPLIER'
                      ? 'bg-amber-900 text-amber-200'
                      : 'bg-blue-900 text-blue-200'
                  }`}
                >
                  {currentUser.role === 'MANAGER'
                    ? 'Yönetici'
                    : currentUser.role === 'PROVIDER'
                    ? 'Hizmet Sağlayıcı'
                    : currentUser.role === 'SUPPLIER'
                    ? 'Tedarikçi'
                    : 'Daire Sakini'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Rol Değiştir ve Farklı Açılardan Test Et
                  </div>
                  {DEMO_USERS.map((usr) => (
                    <button
                      key={usr.id}
                      onClick={() => {
                        switchUser(usr.id);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                        usr.id === currentUser.id ? 'bg-cyan-50 font-bold text-cyan-900' : ''
                      }`}
                    >
                      <div>
                        <div className="text-slate-900 font-semibold">{usr.fullName}</div>
                        <div className="text-[10px] text-slate-500">
                          {usr.role === 'MANAGER'
                            ? 'Apartman Yöneticisi (Oylama & Teklif Onayı)'
                            : usr.role === 'PROVIDER'
                            ? 'Güvenlik / Kamera Sağlayıcısı'
                            : usr.role === 'SUPPLIER'
                            ? 'Filtre / Malzeme Tedarikçisi'
                            : 'Daire A04 Sakini (İhtiyaca Katılım & Oy)'}
                        </div>
                      </div>
                      {usr.id === currentUser.id && (
                        <span className="w-2 h-2 rounded-full bg-cyan-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Apartmanİmece</span>
                <span className="text-[11px] font-semibold bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded">
                  Platform
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Ortak İhtiyaç, Toplu Alım & Şeffaf Teklif Karşılaştırma
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('apartment')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'apartment'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-600" />
              Apartmanım
            </button>
            <button
              onClick={() => setActiveTab('needs')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'needs'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Ortak İhtiyaçlar
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quotes'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              Teklifler & Karşılaştırma
            </button>
            <button
              onClick={() => setActiveTab('voting')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'voting'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Vote className="w-4 h-4 text-purple-600" />
              Oylamalar
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'providers'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4 text-amber-600" />
              Sağlayıcılar
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              Denetim Kütüğü
            </button>
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateNeed}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all shadow-cyan-600/20 hover:shadow-cyan-600/40 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>İhtiyaç Oluştur</span>
            </button>
          </div>
        </div>

        {/* Mobile tabs row */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('needs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'needs' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            İhtiyaçlar
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'quotes' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Teklifler
          </button>
          <button
            onClick={() => setActiveTab('voting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'voting' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Oylamalar
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'providers' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Sağlayıcılar
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'audit' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Denetim Kütüğü
          </button>
        </div>
      </div>
    </header>
  );
};

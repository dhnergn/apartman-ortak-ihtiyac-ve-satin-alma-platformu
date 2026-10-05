import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import {
  Building2,
  Users,
  Key,
  MapPin,
  CheckCircle2,
  Plus,
  Home,
  ShieldCheck,
  Search,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface ApartmentManagementViewProps {
  onOpenRegisterModal: () => void;
}

export const ApartmentManagementView: React.FC<ApartmentManagementViewProps> = ({
  onOpenRegisterModal,
}) => {
  const { currentApartment, activeApartmentUnits, currentUser, apartments, switchApartment } = useTenant();
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchUnit, setSearchUnit] = useState('');

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(currentApartment.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredUnits = activeApartmentUnits.filter((u) => {
    if (!searchUnit.trim()) return true;
    const q = searchUnit.toLowerCase();
    return u.unitNumber.toLowerCase().includes(q) || (u.residentName && u.residentName.toLowerCase().includes(q));
  });

  const occupiedUnits = activeApartmentUnits.filter((u) => u.residentName);
  const occupancyRate = Math.round((occupiedUnits.length / (currentApartment.totalUnits || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-600" />
            <span>Apartman ve Konut Yönetimi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Apartman bilgileri, daire dökümü ve komşuların katılımı için güvenli davet kodu yönetimi.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Apartman / Site Kaydet</span>
        </button>
      </div>

      {/* Apartman Bilgi Kartı & Davet Kodu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sol 2 Kolon: Detaylar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                Aktif Yönetim
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">{currentApartment.name}</h3>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {currentApartment.addressLine}, {currentApartment.district} / {currentApartment.city}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">{currentApartment.totalUnits}</div>
              <div className="text-[11px] text-slate-500 font-medium">Toplam Daire</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-500 text-[11px]">Apartman Yöneticisi</div>
              <div className="font-bold text-slate-900 mt-0.5">{currentApartment.managerName}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-500 text-[11px]">Kayıtlı Daire Oranı</div>
              <div className="font-bold text-cyan-800 mt-0.5">
                {occupiedUnits.length} / {currentApartment.totalUnits} (%{occupancyRate})
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
              <div className="text-slate-500 text-[11px]">Kayıt Tarihi</div>
              <div className="font-bold text-slate-800 mt-0.5">
                {new Date(currentApartment.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Komşu Davet Kodu */}
        <div className="bg-gradient-to-br from-slate-900 to-cyan-950 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Key className="w-4 h-4" />
              <span>Sakin Davet Kodu</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Komşularınızın bu apartmana katılarak ortak taleplere dahil olması için bu kodu paylaşın:
            </p>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="font-mono text-lg font-black tracking-widest text-cyan-300">
                {currentApartment.inviteCode}
              </span>
              <button
                onClick={handleCopyInviteCode}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5 pt-3 border-t border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Davet kodu olmadan dışarıdan kimse apartman verilerinize erişemez.</span>
          </div>
        </div>
      </div>

      {/* Kayıtlı Diğer Apartmanlar Seçicisi (Yöneticiler için) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Home className="w-4 h-4 text-cyan-600" />
            <span>Sistemde Kayıtlı Apartmanlar ({apartments.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Tıklayarak aktif apartmanı değiştirin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {apartments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => switchApartment(apt.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                apt.id === currentApartment.id
                  ? 'bg-cyan-50/70 border-cyan-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span>{apt.name}</span>
                  {apt.id === currentApartment.id && (
                    <span className="text-[9px] bg-cyan-700 text-white px-1.5 py-0.2 rounded font-bold">
                      Aktif
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {apt.district}, {apt.city} • {apt.totalUnits} Daire
                </div>
              </div>

              <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                {apt.inviteCode}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daireler Tablosu / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Daire ve Bağımsız Bölüm Listesi ({activeApartmentUnits.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Apartmandaki tüm daireler, katlar ve kayıtlı sakin durumları
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Daire no veya sakin ara..."
              value={searchUnit}
              onChange={(e) => setSearchUnit(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 w-56 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filteredUnits.map((u) => {
            const isManagerUnit = u.residentId === currentApartment.managerId || u.unitNumber.includes('1');
            return (
              <div
                key={u.id}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                  u.residentName
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-dashed border-slate-300 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{u.unitNumber}</span>
                  <span className="text-[10px] text-slate-400">{u.floorNumber}. Kat</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  {u.residentName ? (
                    <div>
                      <div className="font-semibold text-slate-800 truncate text-[11px]">
                        {u.residentName}
                      </div>
                      <div className="text-[9px] text-emerald-700 font-medium">✓ Kayıtlı Sakin</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">Boş / Henüz Katılmadı</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

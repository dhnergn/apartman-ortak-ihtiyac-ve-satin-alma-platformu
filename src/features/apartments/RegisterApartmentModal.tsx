import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  Key,
  Shield,
  Home,
  MapPin,
  Hash,
  Sparkles,
  Users,
} from 'lucide-react';

interface RegisterApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newApartmentId: string) => void;
}

const PRESET_CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Kocaeli', 'Gaziantep', 'Muğla'];

export const RegisterApartmentModal: React.FC<RegisterApartmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerApartment, currentUser } = useTenant();

  const [name, setName] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [totalUnits, setTotalUnits] = useState<number>(16);
  const [unitPrefix, setUnitPrefix] = useState('Daire ');
  const [managerUnitNumber, setManagerUnitNumber] = useState('1');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdInfo, setCreatedInfo] = useState<{ name: string; inviteCode: string; totalUnits: number } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = registerApartment({
      name,
      city,
      district,
      addressLine,
      postalCode: postalCode || undefined,
      totalUnits: Number(totalUnits),
      unitPrefix,
      managerUnitNumber,
    });

    if (result.success && result.apartmentId) {
      // Find created apartment or show success modal
      setCreatedInfo({
        name,
        inviteCode: 'Oluşturuldu',
        totalUnits: Number(totalUnits),
      });

      if (onSuccess) {
        onSuccess(result.apartmentId);
      }
    } else {
      setErrorMessage(result.error || 'Apartman kaydı sırasında bir hata oluştu.');
    }
  };

  const handleFinish = () => {
    setCreatedInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Apartman / Site Kaydı Oluştur</h3>
              <p className="text-xs text-slate-400">
                Yönetici olarak yeni konut topluluğunuzu sisteme dahil edin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdInfo ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Apartmanınız Başarıyla Kaydedildi!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              <strong>{createdInfo.name}</strong> adına bağımsız organizasyon oluşturuldu.{' '}
              <strong>{createdInfo.totalUnits} adet daire</strong> sisteme eklendi ve yönetici yetkileriniz tanımlandı.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-left space-y-2">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-cyan-600" />
                <span>Apartman Sakinleri İçin Davet Kodu:</span>
              </div>
              <div className="font-mono text-base font-extrabold text-cyan-900 bg-white p-2.5 rounded-lg border border-cyan-200 text-center tracking-wider">
                Sistem tarafından aktif edildi
              </div>
              <p className="text-[11px] text-slate-500">
                Komşularınız bu davet kodunu kullanarak apartmana kayıt talebi gönderebilir.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleFinish}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Yeni Apartman Yönetim Paneline Git →
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Info Banner */}
            <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-950 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Bağımsız Tenant Güvencesi:</span> Kaydedeceğiniz apartmanın sakinleri,
                ihtiyaçları, daire bilgileri ve teklifleri yalnızca bu apartmana kayıtlı üyeler tarafından görülebilir.
                Diğer apartmanlardan mutlak veri izolasyonu ile korunur.
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Apartman Adı */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apartman / Site / Blok Adı <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Kardelen Sitesi (A Blok) veya Güneş Apartmanı"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>

            {/* Şehir & İlçe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İl (Şehir) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden bg-white"
                >
                  {PRESET_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İlçe <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kadıköy, Çankaya, Karşıyaka"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Açık Adres & Posta Kodu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Açık Adres (Mahalle, Cadde, No) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Caferağa Mah. Moda Cad. No: 84"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Posta Kodu</label>
                <input
                  type="text"
                  placeholder="Örn: 34710"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Daire ve Bağımsız Bölüm Yapılandırması */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-cyan-600" />
                <span>Bağımsız Bölüm ve Daire Ayarları</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Toplam Daire Sayısı */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Toplam Daire Sayısı <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={2}
                    max={250}
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(Math.max(2, Number(e.target.value)))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-bold"
                  />
                  <span className="text-[10px] text-slate-500">2 ile 250 daire arası</span>
                </div>

                {/* Daire Numaralandırma Şablonu */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Daire İsimlendirme
                  </label>
                  <select
                    value={unitPrefix}
                    onChange={(e) => setUnitPrefix(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Daire ">Daire 1, Daire 2...</option>
                    <option value="No: ">No: 1, No: 2...</option>
                    <option value="A">A1, A2, A3...</option>
                    <option value="B">B1, B2, B3...</option>
                    <option value="D">D1, D2, D3...</option>
                  </select>
                </div>

                {/* Yöneticinin Kendi Dairesi */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Yönetici Daire No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 1 veya A1"
                    value={managerUnitNumber}
                    onChange={(e) => setManagerUnitNumber(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium"
                  />
                  <span className="text-[10px] text-slate-500">Sizin daireniz olarak atanır</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>
                  Sistem otomatik olarak <strong>{totalUnits} adet daire kaydını</strong> oluşturacak ve yöneticilik
                  hesabınızı ({currentUser.fullName}) apartman yöneticisi olarak bağlayacaktır.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apartmanı Kaydet & Yönetimi Başlat</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

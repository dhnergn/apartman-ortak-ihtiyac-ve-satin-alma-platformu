import React from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import {
  Building2,
  Users,
  FileSpreadsheet,
  Vote,
  Sparkles,
  ShoppingCart,
  Wrench,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  BellRing,
  HelpCircle,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: string, categoryFilter?: string) => void;
  onOpenCreateNeed: () => void;
  onOpenRegisterApartment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenCreateNeed,
  onOpenRegisterApartment,
}) => {
  const {
    currentApartment,
    currentUser,
    currentUnit,
    needs,
    quotes,
    votes,
    auditLogs,
  } = useTenant();

  const activeNeedsCount = needs.filter((n) => n.status !== 'COMPLETED' && n.status !== 'CANCELLED').length;
  const activeQuotesCount = quotes.filter((q) => q.status !== 'SUPERSEDED').length;
  const activeVotesCount = votes.filter((v) => v.status === 'ACTIVE').length;

  // Personal participation
  const myNeeds = currentUnit
    ? needs.filter((n) => n.participants.some((p) => p.unitId === currentUnit.id))
    : [];

  const pendingVotes = currentUnit
    ? votes.filter((v) => v.status === 'ACTIVE' && !v.ballots.some((b) => b.unitId === currentUnit.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3 border border-cyan-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>{currentApartment.name} • {currentApartment.district}, {currentApartment.city}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Hoş Geldiniz, {currentUser.fullName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
            Apartmanınızdaki ihtiyaçları komşularınızla tek çatı altında birleştirin. Dağınık bireysel fiyatlar
            yerine toplu talep gücüyle doğrulanmış sağlayıcılardan şeffaf teklifler toplayın.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateNeed}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Yeni Ortak İhtiyaç Bildir</span>
            </button>
            <button
              onClick={onOpenRegisterApartment}
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-cyan-300" />
              <span>+ Yeni Apartman Kaydet</span>
            </button>
            <button
              onClick={() => onNavigateTab('needs')}
              className="text-slate-300 hover:text-white text-xs sm:text-sm font-medium px-3 py-2.5 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
            >
              <span>Açık Talepler ({needs.length})</span>
              <ArrowRight className="w-4 h-4 text-cyan-300" />
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('needs')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-cyan-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Aktif İhtiyaçlar</span>
            <span className="p-2 rounded-lg bg-cyan-50 text-cyan-700">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeNeedsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Talep ve konsolidasyon aşamasında</div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('quotes')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Toplanan Teklifler</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeQuotesCount}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
            <span>Karşılaştırma Matrisine Hazır</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('voting')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-purple-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Açık Oylamalar</span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Vote className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeVotesCount}</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">1 Daire = 1 Oy Prensibi</div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('apartment')}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Apartman Büyüklüğü</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{currentApartment.totalUnits} Daire</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center justify-between">
            <span>Yönetici: {currentApartment.managerName.split(' ')[0]}</span>
            <span className="text-cyan-700 underline text-[10px]">Yönet →</span>
          </div>
        </div>
      </div>

      {/* Action shortcuts by category */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Hızlı Kategori Seçimi & İhtiyaç Havuzu
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Ortak Alışveriş */}
          <button
            onClick={() => onNavigateTab('needs', 'PERSONAL_BULK_PURCHASE')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Ortak Alışveriş</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Su arıtma filtresi, yangın tüpü, toplu sarf malzemesi
              </div>
            </div>
          </button>

          {/* Tamir & Bakım */}
          <button
            onClick={() => onNavigateTab('needs', 'COMMON_PROPERTY')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-700 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Tamir & Bakım</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Asansör arızası, çatı izolasyonu, hidrofor ve elektrik
              </div>
            </div>
          </button>

          {/* Periyodik Temizlik */}
          <button
            onClick={() => onNavigateTab('needs', 'SERVICE_CONTRACT')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Düzenli Hizmet</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Haftalık merdiven temizliği, bahçe bakımı, dezenfeksiyon
              </div>
            </div>
          </button>

          {/* Güvenlik Sistemleri */}
          <button
            onClick={() => onNavigateTab('needs', 'SECURITY_PROJECT')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Bina Güvenliği</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Kamera sistemi, interkom diafon, akıllı kapı kilidi
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Split section: Personal Status & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Unit Status */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Participation card if Resident */}
          {currentUnit && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  <span>Dairenizin ({currentUnit.unitNumber}) Katıldığı Talepler</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {myNeeds.length} Aktif Katılım
                </span>
              </div>

              {myNeeds.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                  Daireniz henüz aktif bir ortak talebe katılmamıştır. Aşağıdaki listeden komşularınızın açtığı ihtiyaçlara katılabilirsiniz.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myNeeds.map((n) => {
                    const myPart = n.participants.find((p) => p.unitId === currentUnit.id);
                    return (
                      <div
                        key={n.id}
                        className="p-3 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{n.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {n.category} • Toplam {n.currentParticipants} daire katıldı
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-700 text-white font-bold text-[11px]">
                            {myPart?.quantity || 1} Adet
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pending Votes Alert */}
          {pendingVotes.length > 0 && (
            <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg">
                  <Vote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Dairenizin Oy Kullanması Beklenen Karar Var!</h4>
                  <p className="text-xs text-purple-200">
                    {pendingVotes[0].title} oylamasında daireniz ({currentUnit?.unitNumber}) henüz oy kullanmadı.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => onNavigateTab('voting')}
                  className="bg-white text-purple-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  Şimdi Oy Ver →
                </button>
              </div>
            </div>
          )}

          {/* Featured Comparison Preview: Su Arıtma Filtresi */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Öne Çıkan Karşılaştırma
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">
                  Su Arıtma Filtresi Toplu Teklif Karşılaştırması
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('quotes')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Matrisi İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              12 dairenin toplam 24 set talebi için 2 onaylı sağlayıcıdan teklif toplandı.
              Firma teklifleri arasında birim fiyat, ücretsiz montaj ve garanti farkları bulunmaktadır.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800">EkoFiltre A.Ş. (v2)</div>
                <div className="text-base font-extrabold text-cyan-800 my-1">10.944 TL</div>
                <div className="text-[11px] text-slate-500">24 Ay Garanti • Montaj Ücretsiz Dahil</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800">AquaPura Ltd. (v1)</div>
                <div className="text-base font-extrabold text-cyan-800 my-1">10.656 TL</div>
                <div className="text-[11px] text-slate-500">12 Ay Garanti • Montaj Hariç (+150 TL)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Community Announcements & Recent Logs */}
        <div className="space-y-4">
          {/* Duyurular */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <BellRing className="w-4 h-4 text-amber-500" />
              <span>Apartman Duyuruları</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                <div className="font-bold flex items-center justify-between">
                  <span>Kamera Sistemi Oylaması</span>
                  <span className="text-[10px] text-amber-700">Aktif</span>
                </div>
                <p className="mt-1 text-slate-700 leading-relaxed">
                  Berke Güvenlik teklifi için açılan oylama 5 Ekim tarihinde kapanacaktır. Lütfen oyunuzu kullanınız.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <div className="font-bold flex items-center justify-between">
                  <span>Kombi Bakımı Talebi</span>
                  <span className="text-[10px] text-slate-500">Talep Açık</span>
                </div>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  Kış öncesi 6 daire katıldı, hedef 10 daireye ulaştığında servis teklifi istenecektir.
                </p>
              </div>
            </div>
          </div>

          {/* Son Güvenlik Hareketleri (Audit Mini Feed) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Son İşlemler</span>
              </h3>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-900 cursor-pointer"
              >
                Tümü →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-slate-800 font-medium line-clamp-1">{log.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

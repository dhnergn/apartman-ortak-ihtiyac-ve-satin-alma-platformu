import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { Need, NeedType } from '../../types';
import { NeedStatusBadge, NeedTypeBadge } from '../../components/common/StatusBadge';
import { QuoteComparisonModal } from '../quotes/QuoteComparisonModal';
import { SubmitQuoteModal } from '../quotes/SubmitQuoteModal';
import {
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  Minus,
  AlertCircle,
  HelpCircle,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface NeedsFeedProps {
  onOpenCreateNeed: () => void;
  selectedCategoryFilter?: string | null;
}

export const NeedsFeed: React.FC<NeedsFeedProps> = ({ onOpenCreateNeed, selectedCategoryFilter }) => {
  const { needs, quotes, currentUnit, currentUser, currentApartment, joinNeed, leaveNeed } = useTenant();

  const [typeFilter, setTypeFilter] = useState<string>(selectedCategoryFilter || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeedForCompare, setSelectedNeedForCompare] = useState<Need | null>(null);
  const [selectedNeedForQuote, setSelectedNeedForQuote] = useState<Need | null>(null);

  // Participation quantity local state
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [actionMessage, setActionMessage] = useState<{ id: string; text: string; isError?: boolean } | null>(null);

  const getQuantity = (needId: string) => quantities[needId] || 1;
  const setQuantity = (needId: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [needId]: Math.max(1, Math.min(20, val)) }));
  };

  const filteredNeeds = needs.filter((need) => {
    if (typeFilter !== 'ALL' && need.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        need.title.toLowerCase().includes(q) ||
        need.description.toLowerCase().includes(q) ||
        need.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleJoin = (needId: string) => {
    const qty = getQuantity(needId);
    const res = joinNeed(needId, qty);
    if (res.success) {
      setActionMessage({ id: needId, text: `Talebe ${qty} adet ile başarıyla katıldınız.` });
    } else {
      setActionMessage({ id: needId, text: res.error || 'Katılım başarısız.', isError: true });
    }
  };

  const handleLeave = (needId: string) => {
    const res = leaveNeed(needId);
    if (res.success) {
      setActionMessage({ id: needId, text: 'Talepten çekildiniz.' });
    } else {
      setActionMessage({ id: needId, text: res.error || 'İşlem başarısız.', isError: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{currentApartment.name} Ortak İhtiyaç Havuzu</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {filteredNeeds.length} İhtiyaç
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Komşularla aynı ihtiyacı birleştirin, tek merkezden sağlayıcılardan şeffaf teklif toplayın.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="İhtiyaç veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 w-48 sm:w-60 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
          />
          <button
            onClick={onOpenCreateNeed}
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni İhtiyaç Bildir</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setTypeFilter('ALL')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            typeFilter === 'ALL'
              ? 'bg-slate-900 text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Tüm İhtiyaçlar ({needs.length})
        </button>
        <button
          onClick={() => setTypeFilter('PERSONAL_BULK_PURCHASE')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            typeFilter === 'PERSONAL_BULK_PURCHASE'
              ? 'bg-sky-700 text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Ortak Alışveriş (Filtre, Ürün vb.)
        </button>
        <button
          onClick={() => setTypeFilter('COMMON_PROPERTY')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            typeFilter === 'COMMON_PROPERTY'
              ? 'bg-orange-700 text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Ortak Mülk Tamir & Bakım (Asansör, Çatı)
        </button>
        <button
          onClick={() => setTypeFilter('SERVICE_CONTRACT')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            typeFilter === 'SERVICE_CONTRACT'
              ? 'bg-teal-700 text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Periyodik Hizmet (Temizlik, Bahçe)
        </button>
        <button
          onClick={() => setTypeFilter('SECURITY_PROJECT')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            typeFilter === 'SECURITY_PROJECT'
              ? 'bg-violet-700 text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Bina Güvenlik Yatırımı (Kamera, Alarm)
        </button>
      </div>

      {/* Needs Cards Feed */}
      {filteredNeeds.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">Bu kategoride henüz ihtiyaç bulunmuyor</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Komşularınızla birlikte tasarruf etmek istediğiniz bir hizmet veya ürünü hemen bildirerek ilk talebi açabilirsiniz.
          </p>
          <button
            onClick={onOpenCreateNeed}
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>İlk İhtiyacı Oluştur</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNeeds.map((need) => {
            const needQuotes = quotes.filter((q) => q.needId === need.id && q.status !== 'SUPERSEDED');
            const percent = Math.min(100, Math.round((need.currentParticipants / (need.targetParticipants || 1)) * 100));
            const isUserJoined = currentUnit ? need.participants.some((p) => p.unitId === currentUnit.id) : false;
            const myParticipation = currentUnit ? need.participants.find((p) => p.unitId === currentUnit.id) : null;

            return (
              <div
                key={need.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Top tags row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <NeedTypeBadge type={need.type} />
                      <span className="text-[11px] font-semibold text-slate-500">• {need.category}</span>
                    </div>
                    <NeedStatusBadge status={need.status} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 hover:text-cyan-700 transition-colors">
                    {need.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {need.description}
                  </p>

                  {/* Participation Target Progress Bar */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-700 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-600" />
                        <span className="font-bold text-slate-900">{need.currentParticipants}</span> / {need.targetParticipants} Daire Katıldı
                      </span>
                      <span className="text-cyan-700 font-bold">%{percent} Hedefe Ulaşıldı</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          percent >= 100 ? 'bg-emerald-500' : 'bg-cyan-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Toplam Biriken Miktar:{' '}
                        <strong className="text-slate-800">{need.totalQuantity > 0 ? need.totalQuantity : need.currentParticipants} Adet/Birim</strong>
                      </span>
                      {need.estimatedBudget && (
                        <span>
                          Tahmini Bütçe: <strong>{need.estimatedBudget.toLocaleString('tr-TR')} TL</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Katılımcı Daireler Avatar / Pill Listesi */}
                  {need.participants.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Katılan Daireler ({need.participants.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {need.participants.map((p) => (
                          <span
                            key={p.id}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              currentUnit && p.unitId === currentUnit.id
                                ? 'bg-cyan-100 text-cyan-900 border border-cyan-300 font-bold'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p.unitNumber} {p.quantity > 1 ? `(${p.quantity} set)` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action messages */}
                  {actionMessage && actionMessage.id === need.id && (
                    <div
                      className={`mb-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                        actionMessage.isError
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {actionMessage.isError ? (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>{actionMessage.text}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action Strip */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Left: Quotes summary or Provider Action */}
                  <div className="flex items-center gap-2">
                    {needQuotes.length > 0 ? (
                      <button
                        onClick={() => setSelectedNeedForCompare(need)}
                        className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                        <span>{needQuotes.length} Teklif Alındı • Karşılaştır</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Sağlayıcı teklifi bekleniyor
                      </span>
                    )}

                    {/* If user is provider or supplier */}
                    {(currentUser.role === 'PROVIDER' || currentUser.role === 'SUPPLIER') && (
                      <button
                        onClick={() => setSelectedNeedForQuote(need)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Teklif Ver
                      </button>
                    )}
                  </div>

                  {/* Right: Resident Join/Leave action */}
                  <div className="flex items-center gap-2">
                    {currentUnit && (
                      <>
                        {isUserJoined ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                              ✓ Daireniz ({currentUnit.unitNumber}) Katıldı {myParticipation ? `(${myParticipation.quantity} ad.)` : ''}
                            </span>
                            <button
                              onClick={() => handleLeave(need.id)}
                              className="text-slate-400 hover:text-rose-600 text-xs font-medium cursor-pointer underline"
                            >
                              Ayrıl
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {need.type === 'PERSONAL_BULK_PURCHASE' && (
                              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => setQuantity(need.id, getQuantity(need.id) - 1)}
                                  className="px-2 py-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-bold text-slate-800">
                                  {getQuantity(need.id)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQuantity(need.id, getQuantity(need.id) + 1)}
                                  className="px-2 py-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => handleJoin(need.id)}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>Dairemle Katıl</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quote Comparison Modal */}
      {selectedNeedForCompare && (
        <QuoteComparisonModal
          need={selectedNeedForCompare}
          isOpen={true}
          onClose={() => setSelectedNeedForCompare(null)}
        />
      )}

      {/* Submit Quote Modal */}
      {selectedNeedForQuote && (
        <SubmitQuoteModal
          need={selectedNeedForQuote}
          isOpen={true}
          onClose={() => setSelectedNeedForQuote(null)}
          onSuccess={() => {
            setActionMessage({
              id: selectedNeedForQuote.id,
              text: 'Teklifiniz başarıyla sunuldu.',
            });
          }}
        />
      )}
    </div>
  );
};

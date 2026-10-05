import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { Need, Quote } from '../../types';
import { VerificationBadge } from '../../components/common/StatusBadge';
import {
  X,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  ShieldCheck,
  Star,
  Vote,
  Info,
  History,
  TrendingDown,
  Building,
} from 'lucide-react';

interface QuoteComparisonModalProps {
  need: Need;
  isOpen: boolean;
  onClose: () => void;
  onStartVote?: (quote: Quote) => void;
}

export const QuoteComparisonModal: React.FC<QuoteComparisonModalProps> = ({
  need,
  isOpen,
  onClose,
  onStartVote,
}) => {
  const { quotes, currentUser, currentApartment, createVote } = useTenant();
  const [selectedVersionQuote, setSelectedVersionQuote] = useState<Quote | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter quotes for this need (Active latest versions)
  const needQuotes = quotes.filter((q) => q.needId === need.id);
  const activeQuotes = needQuotes.filter((q) => q.status !== 'SUPERSEDED');
  const supersededQuotes = needQuotes.filter((q) => q.status === 'SUPERSEDED');

  const handleLaunchVote = (quote: Quote) => {
    if (currentUser.role !== 'MANAGER') {
      setFeedbackMessage('Oylama başlatma yetkisi yalnızca apartman yöneticisine aittir.');
      return;
    }

    const perUnit = Math.round(quote.total / (currentApartment.totalUnits || 1));
    const title = `${quote.providerName} Teklifinin Apartman Onayına Sunulması`;
    const description = `"${need.title}" kapsamında ${quote.providerName} tarafından verilen ${quote.total.toLocaleString('tr-TR')} TL tutarındaki (${currentApartment.totalUnits} daire için daire başı ~${perUnit.toLocaleString('tr-TR')} TL) teklifin kabul edilmesini onaylıyor musunuz?`;

    const res = createVote({
      needId: need.id,
      quoteId: quote.id,
      title,
      description,
      durationDays: 7,
    });

    if (res.success) {
      setFeedbackMessage(`"${quote.providerName}" teklifi için 1 Daire = 1 Oy oylaması başarıyla başlatıldı!`);
      if (onStartVote) onStartVote(quote);
    } else {
      setFeedbackMessage(res.error || 'Oylama başlatılamadı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Teklif Karşılaştırma Matrisi</span>
                <span className="text-xs bg-blue-900 text-blue-300 font-normal px-2 py-0.5 rounded-full">
                  {activeQuotes.length} Sağlayıcı Teklifi
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-xl">
                İhtiyaç: <span className="text-slate-200 font-semibold">{need.title}</span> • {currentApartment.name}
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

        {/* Impartiality / Neutrality Banner */}
        <div className="px-6 py-3 bg-amber-50/80 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Şeffaflık ve Tarafsızlık İlkesi:</span> Sistem ticari veya sponsorlu olarak
            hiçbir sağlayıcıyı otomatik "En İyi Teklif" ilan etmez. Daire sakinleri ve yönetim; fiyat, garanti süresi,
            teslim süresi, montaj kapsamı ve doğrulanmış firma puanını birlikte inceleyerek oylama ile karar verir.
          </div>
        </div>

        {feedbackMessage && (
          <div className="m-6 mb-0 p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 font-medium flex items-center justify-between">
            <span>{feedbackMessage}</span>
            <button onClick={() => setFeedbackMessage(null)} className="text-cyan-700 hover:text-cyan-900 text-xs font-bold">
              Kapat
            </button>
          </div>
        )}

        <div className="p-6">
          {activeQuotes.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">Henüz Verilmiş Teklif Bulunmuyor</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                İhtiyaç onaylı sağlayıcılara yayınlanmıştır. Teklifler geldiğinde bu matriste karşılaştırmalı olarak görünecektir.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-3 px-4 text-slate-500 font-semibold w-48">Kriterler</th>
                    {activeQuotes.map((q) => (
                      <th key={q.id} className="py-3 px-4 min-w-[240px]">
                        <div className="font-bold text-slate-900 text-sm">{q.providerName}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <VerificationBadge status={q.providerVerification} />
                          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {q.providerRating.toFixed(2)}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Toplam Fiyat */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/30">Toplam Tutar (KDV Dahil)</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 font-bold text-base text-slate-900">
                        {q.total.toLocaleString('tr-TR')} {q.currency}
                        <div className="text-[11px] font-normal text-slate-500">
                          Matrah: {q.subtotal.toLocaleString('tr-TR')} TL + KDV ({q.tax.toLocaleString('tr-TR')} TL)
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Daire Başına Tahmini Maliyet */}
                  <tr className="hover:bg-slate-50/50 bg-cyan-50/30">
                    <td className="py-3 px-4 font-semibold text-cyan-900 bg-cyan-100/40">
                      Daire Başı Tahmini Maliyet
                    </td>
                    {activeQuotes.map((q) => {
                      // If personal bulk purchase, calculate per requested item; if common property divide by totalUnits
                      const perUnitCost =
                        need.type === 'PERSONAL_BULK_PURCHASE'
                          ? Math.round(q.total / (need.totalQuantity || need.targetParticipants || 1))
                          : Math.round(q.total / currentApartment.totalUnits);

                      return (
                        <td key={q.id} className="py-3 px-4 font-bold text-cyan-900 text-sm">
                          ~{perUnitCost.toLocaleString('tr-TR')} TL
                          <span className="block text-[10px] text-slate-500 font-normal">
                            {need.type === 'PERSONAL_BULK_PURCHASE'
                              ? '(Birim set başına tahmini pay)'
                              : `(${currentApartment.totalUnits} daireye eşit bölündüğünde)`}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Garanti */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/30">Garanti Süresi</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-slate-800 font-medium">
                        {q.warrantyMonths > 0 ? `${q.warrantyMonths} Ay (${q.warrantyMonths / 12} Yıl)` : 'Garanti Yok'}
                      </td>
                    ))}
                  </tr>

                  {/* Tamamlama / Teslimat Süresi */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/30">Teslimat / Tamamlama</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-slate-800">
                        <span className="font-semibold text-slate-900">{q.completionTimeDays} İş Günü</span>
                        {q.estimatedStartDate && (
                          <span className="block text-[10px] text-slate-500">
                            Başlama: {new Date(q.estimatedStartDate).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Kurulum / Montaj Dahil mi? */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/30">Kurulum / Montaj</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4">
                        {q.installationIncluded ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3.5 h-3.5" /> Dahil
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Hariç (Yalnızca Ürün Teslimi)
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Ödeme Koşulları */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/30">Ödeme Koşulları</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-slate-700">
                        {q.paymentTerms}
                      </td>
                    ))}
                  </tr>

                  {/* Kapsam & Kalemler */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/30">Kalemler & Açıklama</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4">
                        <p className="text-slate-600 mb-2">{q.description}</p>
                        <div className="space-y-1">
                          {q.items.map((it) => (
                            <div key={it.id} className="text-[11px] bg-slate-100/70 p-1.5 rounded flex justify-between">
                              <span className="text-slate-800">
                                {it.itemTitle} (x{it.quantity})
                              </span>
                              <span className="font-semibold text-slate-900">
                                {it.totalPrice.toLocaleString('tr-TR')} TL
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Sürüm / Versiyon */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/30">Teklif Sürümü</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                          v{q.version}
                        </span>
                        {q.revisionNotes && (
                          <div className="text-[10px] text-cyan-800 mt-1 italic">{q.revisionNotes}</div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Aksiyon Satırı */}
                  <tr className="bg-slate-50">
                    <td className="py-4 px-4 font-bold text-slate-900">Apartman Kararı</td>
                    {activeQuotes.map((q) => (
                      <td key={q.id} className="py-4 px-4">
                        {currentUser.role === 'MANAGER' ? (
                          <button
                            onClick={() => handleLaunchVote(q)}
                            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <Vote className="w-3.5 h-3.5" />
                            <span>Bu Teklifi Oylamaya Aç</span>
                          </button>
                        ) : (
                          <div className="text-center p-2 rounded bg-white border border-slate-200 text-slate-600 text-[11px]">
                            Yönetici oylamaya açtığında oy verebilirsiniz
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Versiyon Geçmişi / Audit List (Varsa) */}
          {supersededQuotes.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <span>Teklif Revizyon Geçmişi (Eski Teklif Versiyonları)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {supersededQuotes.map((sq) => (
                  <div key={sq.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                      <span>{sq.providerName} (Sürüm v{sq.version})</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Arşivlendi</span>
                    </div>
                    <div className="text-slate-600">
                      Eski Tutar: <span className="line-through">{sq.total.toLocaleString('tr-TR')} TL</span> • {sq.warrantyMonths} Ay Garanti
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(sq.createdAt).toLocaleDateString('tr-TR')} tarihinde sunulmuştu.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Teklif geçerlilik tarihleri sağlayıcı garantisindedir.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

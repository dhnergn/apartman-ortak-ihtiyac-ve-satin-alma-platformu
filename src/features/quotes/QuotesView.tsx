import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { Need, Quote } from '../../types';
import { VerificationBadge } from '../../components/common/StatusBadge';
import { QuoteComparisonModal } from './QuoteComparisonModal';
import { SubmitQuoteModal } from './SubmitQuoteModal';
import {
  FileSpreadsheet,
  Clock,
  Star,
  CheckCircle,
  Vote,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const QuotesView: React.FC = () => {
  const { needs, quotes, currentApartment, currentUser } = useTenant();
  const [selectedNeedForCompare, setSelectedNeedForCompare] = useState<Need | null>(null);
  const [selectedNeedForQuote, setSelectedNeedForQuote] = useState<Need | null>(null);

  // Needs that have quotes
  const needsWithQuotes = needs.filter((n) => quotes.some((q) => q.needId === n.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Sağlayıcı Teklifleri & Karşılaştırma Havuzu</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Toplu talep oluşturulan işler için sağlayıcı firmalardan toplanan şeffaf fiyat ve hizmet teklifleri.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Toplam <strong>{quotes.filter((q) => q.status !== 'SUPERSEDED').length}</strong> Aktif Teklif
        </div>
      </div>

      {needsWithQuotes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="text-sm font-bold text-slate-700">Henüz Teklif Alınan İhtiyaç Bulunmuyor</div>
          <p className="text-xs text-slate-500 mt-1">
            İhtiyaçlar hedef katılımcı sayısına ulaştığında sağlayıcılardan teklifler toplanacaktır.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {needsWithQuotes.map((need) => {
            const needQuotes = quotes.filter((q) => q.needId === need.id && q.status !== 'SUPERSEDED');

            return (
              <div key={need.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                  <div>
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {need.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{need.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hedef: {need.targetParticipants} daire • Toplam Talep: {need.totalQuantity || need.currentParticipants} Adet/Birim
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(currentUser.role === 'PROVIDER' || currentUser.role === 'SUPPLIER') && (
                      <button
                        onClick={() => setSelectedNeedForQuote(need)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Teklif Sun
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedNeedForCompare(need)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Yan Yana Karşılaştır ({needQuotes.length})</span>
                    </button>
                  </div>
                </div>

                {/* Quotes Cards for this Need */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {needQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{q.providerName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Sürüm: v{q.version}</div>
                          </div>
                          <VerificationBadge status={q.providerVerification} />
                        </div>

                        {/* Total price */}
                        <div className="my-3 p-2.5 rounded-lg bg-slate-50">
                          <div className="text-[11px] text-slate-500 font-medium">Toplam Teklif:</div>
                          <div className="text-xl font-black text-slate-900">
                            {q.total.toLocaleString('tr-TR')} {q.currency}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Matrah: {q.subtotal.toLocaleString('tr-TR')} TL + KDV
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-xs text-slate-600 mb-3">
                          <li className="flex items-center justify-between">
                            <span className="text-slate-500">Garanti:</span>
                            <span className="font-semibold text-slate-800">{q.warrantyMonths} Ay</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-slate-500">Teslim Süresi:</span>
                            <span className="font-semibold text-slate-800">{q.completionTimeDays} İş Günü</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-slate-500">Montaj:</span>
                            <span className="font-semibold text-slate-800">
                              {q.installationIncluded ? '✓ Dahil' : 'Hariç'}
                            </span>
                          </li>
                        </ul>

                        <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-2">
                          "{q.description}"
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedNeedForCompare(need)}
                        className="w-full mt-2 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Matriste İncele →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedNeedForCompare && (
        <QuoteComparisonModal
          need={selectedNeedForCompare}
          isOpen={true}
          onClose={() => setSelectedNeedForCompare(null)}
        />
      )}

      {selectedNeedForQuote && (
        <SubmitQuoteModal
          need={selectedNeedForQuote}
          isOpen={true}
          onClose={() => setSelectedNeedForQuote(null)}
          onSuccess={() => setSelectedNeedForQuote(null)}
        />
      )}
    </div>
  );
};

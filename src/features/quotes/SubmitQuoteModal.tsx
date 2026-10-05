import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { Need } from '../../types';
import { X, Plus, Trash2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface SubmitQuoteModalProps {
  need: Need;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitQuoteModal: React.FC<SubmitQuoteModalProps> = ({ need, isOpen, onClose, onSuccess }) => {
  const { providers, currentUser, submitQuote } = useTenant();

  // Pick provider associated with current user or fallback to first available
  const myProvider = providers.find((p) => p.userId === currentUser.id) || providers[0];

  const [items, setItems] = useState<Array<{ itemTitle: string; quantity: number; unitPrice: number }>>([
    {
      itemTitle: need.title,
      quantity: need.totalQuantity > 0 ? need.totalQuantity : 1,
      unitPrice: need.estimatedBudget ? Math.round(need.estimatedBudget / (need.totalQuantity || 1)) : 500,
    },
  ]);

  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [completionTimeDays, setCompletionTimeDays] = useState<number>(5);
  const [installationIncluded, setInstallationIncluded] = useState<boolean>(true);
  const [paymentTerms, setPaymentTerms] = useState<string>('İş tesliminde havale / nakit');
  const [description, setDescription] = useState<string>('Kurumsal teknik servis ve faturalı garanti kapsamında teklif.');
  const [validityDays, setValidityDays] = useState<number>(30);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [...prev, { itemTitle: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const tax = Math.round(subtotal * 0.2);
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = submitQuote({
      needId: need.id,
      providerId: myProvider.id,
      items: items.map((it) => ({
        itemTitle: it.itemTitle,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
      warrantyMonths: Number(warrantyMonths),
      completionTimeDays: Number(completionTimeDays),
      installationIncluded,
      paymentTerms,
      description,
      validityDays: Number(validityDays),
    });

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(res.error || 'Teklif sunulamadı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Teklif Ver / Revize Et</h3>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {need.title} • Sağlayıcı: <span className="text-amber-300 font-semibold">{myProvider.companyName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Items breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Fiyatlandırma Kalemleri
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-cyan-700 hover:text-cyan-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Kalem Ekle
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    required
                    placeholder="Kalem açıklaması (örn. 5li Filtre Seti veya İşçilik)"
                    value={item.itemTitle}
                    onChange={(e) => handleItemChange(index, 'itemTitle', e.target.value)}
                    className="flex-1 text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                  <div className="w-20">
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="Adet"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-300 text-center bg-white"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="Birim TL"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-300 text-right bg-white font-semibold"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total calculation strip */}
            <div className="mt-3 p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                Matrah: {subtotal.toLocaleString('tr-TR')} TL + %20 KDV ({tax.toLocaleString('tr-TR')} TL)
              </span>
              <div className="text-sm font-bold text-slate-900">
                Toplam Teklif: <span className="text-cyan-700">{total.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Garanti Süresi (Ay)</label>
              <input
                type="number"
                min={0}
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tamamlama Süresi (İş Günü)</label>
              <input
                type="number"
                min={1}
                value={completionTimeDays}
                onChange={(e) => setCompletionTimeDays(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teklif Geçerlilik (Gün)</label>
              <input
                type="number"
                min={1}
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={installationIncluded}
                onChange={(e) => setInstallationIncluded(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded"
              />
              <span>Kurulum / Montaj ve Yerinde Servis Hizmeti Fiyata Dahildir</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ödeme Şartları</label>
            <input
              type="text"
              required
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Açıklama & Notlar</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Teklifi Gönder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

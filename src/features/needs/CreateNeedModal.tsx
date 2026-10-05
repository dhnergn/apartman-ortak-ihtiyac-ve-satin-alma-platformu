import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { NeedType } from '../../types';
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  UserCheck,
} from 'lucide-react';

interface CreateNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_PROMPTS = [
  'Kış öncesi 10 daire için yıllık kombi ve petek temizliği servisi almak istiyoruz.',
  'Apartmanımızdaki 15 daire için 5 aşamalı su arıtma filtre seti toplu alımı.',
  'Otopark ve giriş kapısı için 16 kameralı IP güvenlik sistemi ve kayıt cihazı projesi.',
  'Apartman merdivenleri ve ortak alanlar için haftalık profesyonel temizlik sözleşmesi.',
  'Ortak asansörün kapı sensörü arızalandı, acil yetkili servis revizyonu gerekiyor.',
];

export const CreateNeedModal: React.FC<CreateNeedModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createNeed, currentApartment, currentUnit, currentUser } = useTenant();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kombi & Isıtma Bakımı');
  const [type, setType] = useState<NeedType>('PERSONAL_BULK_PURCHASE');
  const [description, setDescription] = useState('');
  const [targetParticipants, setTargetParticipants] = useState<number>(10);
  const [estimatedBudget, setEstimatedBudget] = useState<string>('8000');
  const [deadlineDays, setDeadlineDays] = useState<number>(14);
  const [initialQuantity, setInitialQuantity] = useState<number>(1);
  const [userNotes, setUserNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAiParse = async (promptToUse?: string) => {
    const text = promptToUse || aiPrompt;
    if (!text.trim()) {
      setErrorMessage('Lütfen önce ihtiyacınızı belirten bir cümle yazın veya hazır önerilerden birine tıklayın.');
      return;
    }

    setIsAiLoading(true);
    setErrorMessage(null);
    setAiSuccessMessage(null);

    try {
      const response = await fetch('/api/ai/parse-need', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error('AI sunucusundan yanıt alınamadı.');
      }

      const data = await response.json();

      // Populate form fields with validated AI output
      if (data.title) setTitle(data.title);
      if (data.category) setCategory(data.category);
      if (data.type) setType(data.type as NeedType);
      if (data.description) setDescription(data.description);
      if (data.targetParticipants) setTargetParticipants(Number(data.targetParticipants));
      if (data.estimatedBudget) setEstimatedBudget(String(data.estimatedBudget));

      setAiSuccessMessage(`Gemini AI ihtiyacı "${data.category}" kategorisinde analiz etti ve formu doldurdu. Kontrol edip yayınlayabilirsiniz.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'AI çözümleme sırasında bir sorun oluştu.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const budgetNum = estimatedBudget ? Number(estimatedBudget) : undefined;

    const result = createNeed({
      title,
      category,
      type,
      description,
      targetParticipants: Number(targetParticipants),
      estimatedBudget: budgetNum,
      deadlineDays: Number(deadlineDays),
      initialQuantity: Number(initialQuantity),
      userNotes,
    });

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(result.error || 'İhtiyaç oluşturulamadı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h3 className="font-bold text-base">Yeni Ortak İhtiyaç / Talep Bildir</h3>
              <p className="text-xs text-slate-400">
                {currentApartment.name} sakinleri ve yönetimi için ortak talep toplama
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

        {/* AI Assisted Box */}
        <div className="p-6 bg-gradient-to-b from-cyan-50/70 to-white border-b border-cyan-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-cyan-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-900">
              Gemini AI ile Hızlı İhtiyaç Çözümleme
            </span>
            <span className="text-[10px] bg-cyan-200 text-cyan-800 px-2 py-0.5 rounded-full font-medium ml-auto">
              Server-Side AI Gateway
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Ne istediğinizi serbest Türkçe metinle yazın. Gemini modeli kategoriyi, hedef daire sayısını ve bütçeyi otomatik taslaklaştırsın:
          </p>

          <div className="relative mb-2.5">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Örn: 12 daire kış gelmeden kombi bakımını ortak yaptırmak istiyoruz, güvenilir servis teklifi toplayalım..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-cyan-200 bg-white shadow-inner focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[11px] text-slate-500 font-medium">Hızlı Örnekler:</span>
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiPrompt(p);
                  handleAiParse(p);
                }}
                className="text-[11px] px-2 py-1 rounded-md bg-white hover:bg-cyan-100 border border-cyan-200 text-slate-700 transition-colors cursor-pointer text-left truncate max-w-xs"
              >
                {p.slice(0, 36)}...
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * AI doğrudan veritabanına yazmaz; form doldurulur ve sizin onayınızla yayınlanır.
            </span>
            <button
              type="button"
              disabled={isAiLoading || !aiPrompt.trim()}
              onClick={() => handleAiParse()}
              className="bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Çözümle & Formu Doldur</span>
                </>
              )}
            </button>
          </div>

          {aiSuccessMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* The Manual/Review Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Örn: Su Arıtma, Kombi Bakımı, Asansör"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>

            {/* Need Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                İhtiyaç Tipi <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as NeedType)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden bg-white"
              >
                <option value="PERSONAL_BULK_PURCHASE">Ortak Alışveriş (Dairelerin Bireysel İhtiyacı)</option>
                <option value="COMMON_PROPERTY">Ortak Mülk Tamir & Bakım (Bina Ortak Alanı)</option>
                <option value="SERVICE_CONTRACT">Düzenli Hizmet Sözleşmesi (Temizlik, Bahçe)</option>
                <option value="SECURITY_PROJECT">Bina Güvenlik Yatırımı (Kamera, İnterkom)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              İhtiyaç Başlığı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: 15 Daire Su Arıtma Filtresi Kartuş Seti Toplu Alımı"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detaylı Açıklama & Şartlar <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sağlayıcıların ve komşuların bilmesi gereken teknik detaylar, marka/model veya kapsam..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Target Participants */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hedeflenen Daire <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={currentApartment.totalUnits}
                value={targetParticipants}
                onChange={(e) => setTargetParticipants(Math.max(1, Number(e.target.value)))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500">Maksimum {currentApartment.totalUnits} daire</span>
            </div>

            {/* Estimated Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahmini Toplam Bütçe (TL)
              </label>
              <input
                type="number"
                min={0}
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                placeholder="Örn: 9000"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500">Bağlayıcı olmayan bütçe</span>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Talep Toplama Süresi
              </label>
              <select
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden bg-white"
              >
                <option value={7}>7 Gün</option>
                <option value={14}>14 Gün (Önerilen)</option>
                <option value={21}>21 Gün</option>
                <option value={30}>30 Gün</option>
              </select>
            </div>
          </div>

          {/* Dairem Adına İlk Katılım (Eğer Sakin ise) */}
          {currentUnit && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Oluştururken Dairemiz ({currentUnit.unitNumber}) Otomatik Katılsın:
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser.fullName} adına bu talep için ilk katılım kaydı oluşturulacaktır.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">İstenen Adet:</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={initialQuantity}
                  onChange={(e) => setInitialQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-xs p-1.5 rounded-lg border border-slate-300 text-center font-bold"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
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
              <span>İhtiyacı Apartmana Duyur & Yayınla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

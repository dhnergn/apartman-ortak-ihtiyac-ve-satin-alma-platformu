import React from 'react';
import { NeedStatus, NeedType, VerificationStatus } from '../../types';
import { ShieldCheck, ShieldAlert, CheckCircle, Clock, Vote, ShoppingCart, Wrench, Sparkles, Shield } from 'lucide-react';

export const NeedStatusBadge: React.FC<{ status: NeedStatus }> = ({ status }) => {
  switch (status) {
    case 'COLLECTING_DEMAND':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Talep Toplanıyor
        </span>
      );
    case 'QUOTING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Teklifler İnceleniyor
        </span>
      );
    case 'VOTING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
          <Vote className="w-3.5 h-3.5 text-purple-600" />
          Apartman Oylamasında
        </span>
      );
    case 'ORDERED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-200">
          <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
          Sipariş / İş Başladı
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Tamamlandı
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
          İptal Edildi
        </span>
      );
    default:
      return null;
  }
};

export const NeedTypeBadge: React.FC<{ type: NeedType }> = ({ type }) => {
  switch (type) {
    case 'PERSONAL_BULK_PURCHASE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800">
          <ShoppingCart className="w-3 h-3 text-sky-700" />
          Ortak Alışveriş
        </span>
      );
    case 'COMMON_PROPERTY':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
          <Wrench className="w-3 h-3 text-orange-700" />
          Ortak Alan Tamir & Bakım
        </span>
      );
    case 'SERVICE_CONTRACT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
          <Sparkles className="w-3 h-3 text-teal-700" />
          Periyodik Hizmet
        </span>
      );
    case 'SECURITY_PROJECT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800">
          <Shield className="w-3 h-3 text-violet-700" />
          Bina Güvenlik Projesi
        </span>
      );
  }
};

export const VerificationBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  if (status === 'VERIFIED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Doğrulanmış İşletme
      </span>
    );
  }
  if (status === 'DOCUMENT_SUBMITTED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-500" />
        Evrak İnceleniyor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <ShieldAlert className="w-3 h-3 text-slate-400" />
      Doğrulanmamış
    </span>
  );
};

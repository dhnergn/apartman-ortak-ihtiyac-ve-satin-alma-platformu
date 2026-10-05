import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { VerificationBadge } from '../../components/common/StatusBadge';
import {
  Store,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Briefcase,
  Search,
} from 'lucide-react';

export const ProvidersDirectory: React.FC = () => {
  const { providers } = useTenant();
  const [search, setSearch] = useState('');

  const filteredProviders = providers.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.companyName.toLowerCase().includes(q) ||
      p.serviceCategories.some((c) => c.toLowerCase().includes(q)) ||
      p.serviceRegions.some((r) => r.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600" />
            <span>Kayıtlı Sağlayıcı ve Tedarikçi Havuzu</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Apartman taleplerine teklif sunan doğrulanmış teknik servis ve ürün tedarikçi firmaları.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Firma veya kategori ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 w-64 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Trust Notice */}
      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Doğrulama ve Güven Standardı:</span> Yalnızca resmi vergi levhası ve ticaret
          sicil kaydı platform tarafından incelenip onaylanan işletmelere <strong>"Doğrulanmış İşletme"</strong> rozeti
          verilir. Platform komisyon karşılığı sıralama yapmaz; tüm sağlayıcılar eşit şartlarda teklif sunar.
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{provider.companyName}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Vergi No: <span className="font-mono">{provider.taxNumber || 'Gizli'}</span>
                  </div>
                </div>
                <VerificationBadge status={provider.verificationStatus} />
              </div>

              {/* Rating & Completed Jobs */}
              <div className="flex items-center gap-4 my-3 p-2.5 bg-slate-50 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{provider.ratingScore.toFixed(2)}</span>
                  <span className="text-[11px] font-normal text-slate-500">({provider.ratingCount} değerlendirme)</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span><strong>{provider.completedJobsCount}</strong> Tamamlanan İş</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-3">
                <div className="text-[11px] font-semibold text-slate-500 mb-1">Uzmanlık Alanları:</div>
                <div className="flex flex-wrap gap-1">
                  {provider.serviceCategories.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div className="mb-3 flex items-start gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Bölgeler: {provider.serviceRegions.join(', ')}</span>
              </div>
            </div>

            {/* Contact Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> {provider.contactPhone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> {provider.contactEmail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

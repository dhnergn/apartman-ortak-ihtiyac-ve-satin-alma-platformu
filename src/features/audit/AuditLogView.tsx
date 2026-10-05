import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import {
  History,
  Shield,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  Vote,
  UserPlus,
  Terminal,
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, currentApartment } = useTenant();
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction === 'ALL') return true;
    return log.action.includes(filterAction);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-600" />
            <span>Apartman Güvenlik & Denetim Kütüğü (Audit Log)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Değiştirilemez olay günlüğü • Her ihtiyaç katılımı, teklif sunumu ve oylama işlemi zaman damgasıyla saklanır.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="ALL">Tüm Güvenlik Olayları ({auditLogs.length})</option>
            <option value="need">İhtiyaç ve Talepler</option>
            <option value="participant">Daire Katılımları</option>
            <option value="quote">Sağlayıcı Teklifleri</option>
            <option value="vote">Oylama ve Kararlar</option>
          </select>
        </div>
      </div>

      {/* Security Assurance Banner */}
      <div className="p-3.5 bg-slate-900 text-slate-300 rounded-xl text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Tenant İzolasyon Doğrulaması:</strong> Gösterilen tüm log kayıtları yalnızca{' '}
            <span className="text-white font-bold">{currentApartment.name}</span> veritabanı kapsamına aittir.
          </span>
        </div>
        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono">
          IMMUTABLE LOGS
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Zaman Damgası</th>
                <th className="py-3 px-4">Olay Tipi</th>
                <th className="py-3 px-4">İşlemi Yapan</th>
                <th className="py-3 px-4">Detay ve Açıklama</th>
                <th className="py-3 px-4 text-right">IP Adresi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const getActionBadge = () => {
                  if (log.action.includes('vote')) {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                        <Vote className="w-3 h-3" /> Oylama
                      </span>
                    );
                  }
                  if (log.action.includes('quote')) {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                        <FileSpreadsheet className="w-3 h-3" /> Teklif
                      </span>
                    );
                  }
                  if (log.action.includes('participant')) {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        <UserPlus className="w-3 h-3" /> Katılım
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-semibold">
                      İhtiyaç
                    </span>
                  );
                };

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{getActionBadge()}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {log.summary}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTenant } from '../../lib/security/tenantContext';
import { Vote, BallotDecision } from '../../types';
import {
  Vote as VoteIcon,
  CheckCircle,
  XCircle,
  MinusCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Plus,
  Users,
  Award,
} from 'lucide-react';

export const VotingView: React.FC = () => {
  const { votes, currentUnit, currentUser, currentApartment, castVote, createVote } = useTenant();
  const [feedback, setFeedback] = useState<{ id: string; text: string; isError?: boolean } | null>(null);
  const [isCreateVoteOpen, setIsCreateVoteOpen] = useState(false);

  // New vote form state
  const [voteTitle, setVoteTitle] = useState('');
  const [voteDesc, setVoteDesc] = useState('');
  const [voteDuration, setVoteDuration] = useState(7);

  const handleCastVote = (voteId: string, decision: BallotDecision) => {
    const res = castVote(voteId, decision);
    if (res.success) {
      setFeedback({ id: voteId, text: `Oyunuz (${decision === 'YES' ? 'KABUL' : decision === 'NO' ? 'RED' : 'ÇEKİMSER'}) başarıyla kaydedildi.` });
    } else {
      setFeedback({ id: voteId, text: res.error || 'Oy kullanılamadı.', isError: true });
    }
  };

  const handleCreateVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createVote({
      title: voteTitle,
      description: voteDesc,
      durationDays: voteDuration,
    });
    if (res.success) {
      setIsCreateVoteOpen(false);
      setVoteTitle('');
      setVoteDesc('');
    } else {
      alert(res.error || 'Oylama oluşturulamadı.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <VoteIcon className="w-5 h-5 text-purple-600" />
            <span>Apartman Karar ve Oylama Sistemi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            1 Daire = 1 Oy Prensibi • Ortak harcama ve sağlayıcı seçiminde şeffaf ve demokratik onay süreci.
          </p>
        </div>

        {currentUser.role === 'MANAGER' && (
          <button
            onClick={() => setIsCreateVoteOpen(true)}
            className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Oylama Başlat</span>
          </button>
        )}
      </div>

      {/* 1 Daire 1 Oy Kural Notu */}
      <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Daire Bazlı İrade Güvencesi:</span> Bir dairede birden fazla sakin veya aile
          üyesi bulunsa dahi, her bağımsız bölüm (daire) sistemde yalnızca 1 oy hakkına sahiptir. Verilen oylar
          değiştirilemez ve şeffaf biçimde denetim günlüğünde arşivlenir.
        </div>
      </div>

      {/* Modal for creating a new vote */}
      {isCreateVoteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Yeni Apartman Oylaması Başlat</h3>
            <p className="text-xs text-slate-500 mb-4">
              Tüm daire sakinlerinin onayına sunulacak ortak karar başlığını giriniz.
            </p>

            <form onSubmit={handleCreateVoteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Oylama Konusu</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Asansör Revizyonu İçin X Firması Teklifi"
                  value={voteTitle}
                  onChange={(e) => setVoteTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Açıklama & Gerekçe</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Toplam bütçe, daire başı maliyet ve oylama detayları..."
                  value={voteDesc}
                  onChange={(e) => setVoteDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Oylama Süresi</label>
                <select
                  value={voteDuration}
                  onChange={(e) => setVoteDuration(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value={3}>3 Gün</option>
                  <option value={7}>7 Gün (Standart)</option>
                  <option value={14}>14 Gün</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateVoteOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Oylamayı Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Votes List */}
      {votes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <VoteIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="text-sm font-bold text-slate-700">Aktif Oylama Bulunmuyor</div>
          <p className="text-xs text-slate-500 mt-1">
            Yönetici ortak mülk teklifleri veya kararları için oylama başlattığında burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {votes.map((vote) => {
            const totalBallots = vote.ballots.length;
            const eligibleUnits = vote.totalEligibleUnits || currentApartment.totalUnits;
            const participationRate = Math.round((totalBallots / eligibleUnits) * 100);

            const yesCount = vote.ballots.filter((b) => b.decision === 'YES').length;
            const noCount = vote.ballots.filter((b) => b.decision === 'NO').length;
            const abstainCount = vote.ballots.filter((b) => b.decision === 'ABSTAIN').length;

            const yesPercent = totalBallots > 0 ? Math.round((yesCount / totalBallots) * 100) : 0;
            const noPercent = totalBallots > 0 ? Math.round((noCount / totalBallots) * 100) : 0;
            const abstainPercent = totalBallots > 0 ? Math.round((abstainCount / totalBallots) * 100) : 0;

            const myBallot = currentUnit ? vote.ballots.find((b) => b.unitId === currentUnit.id) : null;

            return (
              <div
                key={vote.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Vote Card Header */}
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-purple-50/50 to-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                        {vote.status === 'ACTIVE' ? 'Aktif Oylama' : 'Sonuçlandı'}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Son Tarih: {new Date(vote.endTime).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{vote.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <Users className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-bold text-slate-800">
                        {totalBallots} / {eligibleUnits} Daire Oy Kullandı
                      </div>
                      <div className="text-[10px] text-slate-500">Katılım Oranı: %{participationRate}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">{vote.description}</p>

                  {/* Vote Result Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    {/* Kabul */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> KABUL
                        </span>
                        <span>{yesCount} Daire (%{yesPercent})</span>
                      </div>
                      <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${yesPercent}%` }} />
                      </div>
                    </div>

                    {/* Red */}
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1">
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-rose-600" /> RED
                        </span>
                        <span>{noCount} Daire (%{noPercent})</span>
                      </div>
                      <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-600 h-full transition-all duration-500" style={{ width: `${noPercent}%` }} />
                      </div>
                    </div>

                    {/* Çekimser */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                        <span className="flex items-center gap-1">
                          <MinusCircle className="w-4 h-4 text-slate-500" /> ÇEKİMSER
                        </span>
                        <span>{abstainCount} Daire (%{abstainPercent})</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: `${abstainPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Feedback message */}
                  {feedback && feedback.id === vote.id && (
                    <div
                      className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                        feedback.isError
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {feedback.isError ? (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>{feedback.text}</span>
                    </div>
                  )}

                  {/* Vote Action Area */}
                  {currentUnit ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Daireniz: <span className="text-purple-700 font-extrabold">{currentUnit.unitNumber}</span> ({currentUser.fullName})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {myBallot
                            ? `Daireniz adına daha önce oy kullanılmıştır (${new Date(myBallot.castAt).toLocaleDateString('tr-TR')}).`
                            : 'Bu oylamada henüz oy kullanmadınız. Lütfen iradenizi belirtin:'}
                        </div>
                      </div>

                      {myBallot ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                              myBallot.decision === 'YES'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : myBallot.decision === 'NO'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            ✓ Oyunuz: {myBallot.decision === 'YES' ? 'KABUL' : myBallot.decision === 'NO' ? 'RED' : 'ÇEKİMSER'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCastVote(vote.id, 'YES')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> KABUL
                          </button>
                          <button
                            onClick={() => handleCastVote(vote.id, 'NO')}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> RED
                          </button>
                          <button
                            onClick={() => handleCastVote(vote.id, 'ABSTAIN')}
                            className="bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            ÇEKİMSER
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      Oy kullanabilmek için apartman sakini ve atanmış bir daire sahibi olmanız gerekmektedir.
                    </div>
                  )}

                  {/* Transparent ballot audit trail for this vote */}
                  {vote.ballots.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Oy Kullanan Dairelerin Şeffaf Listesi:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {vote.ballots.map((b, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                              b.decision === 'YES'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : b.decision === 'NO'
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <strong>{b.unitNumber}:</strong> {b.decision === 'YES' ? 'Kabul' : b.decision === 'NO' ? 'Red' : 'Çekimser'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
